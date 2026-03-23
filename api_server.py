"""
MangaScribe API Server
FastAPI backend that exposes the manga scanlation pipeline as REST endpoints.
"""
import os
import io
import base64
import logging
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np

from src.detector import BubbleDetector
from src.ocr import MangaReader
from src.translator import get_translator, LingoTranslator, LocalTranslator
from src.cleaner import ImageCleaner
from src.typesetter import TextRenderer

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MangaScribe-API")

app = FastAPI(
    title="MangaScribe API",
    description="Automated manga scanlation pipeline — detect, OCR, translate, clean, typeset.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Lazy-loaded pipeline modules ─────────────────────────────────
_detector: Optional[BubbleDetector] = None
_ocr: Optional[MangaReader] = None
_cleaner: Optional[ImageCleaner] = None
_typesetter: Optional[TextRenderer] = None


def _get_detector():
    global _detector
    if _detector is None:
        _detector = BubbleDetector()
    return _detector


def _get_ocr():
    global _ocr
    if _ocr is None:
        _ocr = MangaReader()
    return _ocr


def _get_cleaner():
    global _cleaner
    if _cleaner is None:
        _cleaner = ImageCleaner()
    return _cleaner


def _get_typesetter():
    global _typesetter
    if _typesetter is None:
        _typesetter = TextRenderer()
    return _typesetter


def _image_to_base64(img: Image.Image) -> str:
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


# ── Endpoints ─────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "ok", "service": "MangaScribe API", "version": "2.0.0"}


@app.post("/api/detect")
async def detect_bubbles(file: UploadFile = File(...)):
    """
    Detect speech bubbles and OCR the Japanese text.
    Returns bounding boxes and extracted text for each bubble.
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Save temp file for YOLO (it needs a file path)
        temp_path = "temp_upload.jpg"
        image.save(temp_path)
        
        detector = _get_detector()
        ocr = _get_ocr()
        
        bboxes = detector.detect(temp_path)
        
        bubbles = []
        for i, bbox in enumerate(bboxes):
            x1, y1, x2, y2 = bbox
            crop = image.crop((x1, y1, x2, y2))
            jp_text = ocr.process(crop)
            
            bubbles.append({
                "id": i,
                "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                "japanese_text": jp_text or "",
                "translated_text": ""
            })
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return JSONResponse({
            "success": True,
            "bubble_count": len(bubbles),
            "bubbles": bubbles,
            "image_width": image.width,
            "image_height": image.height
        })
        
    except Exception as e:
        logger.error(f"Detection failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/translate")
async def translate_text(
    text: str = Form(...),
    context_prompt: str = Form(""),
    source_locale: str = Form("ja"),
    target_locale: str = Form("en"),
    use_lingo: bool = Form(True)
):
    """
    Translate text using Lingo.dev (with MCP-style context) or Ollama fallback.
    """
    try:
        translator = get_translator(prefer_lingo=use_lingo)
        
        if isinstance(translator, LingoTranslator):
            result = translator.translate(
                text,
                context_prompt=context_prompt,
                source_locale=source_locale,
                target_locale=target_locale
            )
        else:
            result = translator.translate(text, context_prompt=context_prompt)
        
        return JSONResponse({
            "success": True,
            "original": text,
            "translation": result,
            "engine": "lingo.dev" if isinstance(translator, LingoTranslator) else "ollama"
        })
        
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/process")
async def process_full(
    file: UploadFile = File(...),
    context_prompt: str = Form(""),
    target_locale: str = Form("en"),
    use_lingo: bool = Form(True)
):
    """
    Full pipeline: detect → OCR → translate → clean → typeset.
    Returns the final image as base64 plus all bubble data.
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        temp_path = "temp_upload.jpg"
        image.save(temp_path)
        
        detector = _get_detector()
        ocr = _get_ocr()
        cleaner = _get_cleaner()
        typesetter = _get_typesetter()
        translator = get_translator(prefer_lingo=use_lingo)
        
        bboxes = detector.detect(temp_path)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        result_image = image.copy()
        bubbles = []
        
        for i, bbox in enumerate(bboxes):
            x1, y1, x2, y2 = bbox
            crop = image.crop((x1, y1, x2, y2))
            
            jp_text = ocr.process(crop)
            
            if not jp_text or len(jp_text.strip()) == 0:
                bubbles.append({
                    "id": i,
                    "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "japanese_text": "",
                    "translated_text": "",
                    "skipped": True
                })
                continue
            
            if isinstance(translator, LingoTranslator):
                en_text = translator.translate(
                    jp_text,
                    context_prompt=context_prompt,
                    target_locale=target_locale
                )
            else:
                en_text = translator.translate(jp_text, context_prompt=context_prompt)
            
            if en_text and en_text != "[Translation Error]":
                result_image = cleaner.clean(result_image, bbox)
                result_image = typesetter.render(result_image, en_text, bbox)
            
            bubbles.append({
                "id": i,
                "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                "japanese_text": jp_text,
                "translated_text": en_text,
                "skipped": False
            })
        
        result_b64 = _image_to_base64(result_image)
        original_b64 = _image_to_base64(image)
        
        return JSONResponse({
            "success": True,
            "bubble_count": len(bubbles),
            "bubbles": bubbles,
            "original_image": original_b64,
            "result_image": result_b64,
            "image_width": image.width,
            "image_height": image.height,
            "engine": "lingo.dev" if isinstance(translator, LingoTranslator) else "ollama"
        })
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/render")
async def render_image(
    file: UploadFile = File(...),
    bubbles_json: str = Form(...)
):
    """
    Takes an image and a JSON list of bubbles (with translated text),
    runs the cleaner (inpainting) and typesetter, and returns the final image.
    Used for the step-by-step dashboard mode.
    """
    try:
        import json
        bubbles = json.loads(bubbles_json)
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        result_image = image.copy()
        
        cleaner = _get_cleaner()
        typesetter = _get_typesetter()
        
        for bubble in bubbles:
            en_text = bubble.get("translated_text", "")
            skipped = bubble.get("skipped", False)
            
            if skipped or not en_text:
                continue
                
            bbox_dict = bubble.get("bbox", {})
            bbox = (
                bbox_dict.get("x1", 0),
                bbox_dict.get("y1", 0),
                bbox_dict.get("x2", 0),
                bbox_dict.get("y2", 0)
            )
            
            result_image = cleaner.clean(result_image, bbox)
            result_image = typesetter.render(result_image, en_text, bbox)

        result_b64 = _image_to_base64(result_image)
        
        return JSONResponse({
            "success": True,
            "result_image": result_b64
        })
        
    except Exception as e:
        logger.error(f"Render failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

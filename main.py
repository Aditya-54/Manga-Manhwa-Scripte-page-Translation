import argparse
import os
import logging
from PIL import Image
import numpy as np

from src.detector import BubbleDetector
from src.ocr import MangaReader
from src.translator import LocalTranslator
from src.cleaner import ImageCleaner
from src.typesetter import TextRenderer

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MangaScribe")

def main():
    parser = argparse.ArgumentParser(description="MangaScribe: Automated Scanlation Pipeline")
    parser.add_argument("image_path", help="Path to the input manga page image")
    parser.add_argument("--output", default="result_page.png", help="Path to save the result")
    parser.add_argument("--model-path", default="models/comic_bubble.pt", help="Path to YOLO detection model")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.image_path):
        logger.error(f"Input file not found: {args.image_path}")
        return

    logger.info("Initializing pipeline modules...")
    try:
        detector = BubbleDetector(model_path=args.model_path)
        ocr = MangaReader()
        translator = LocalTranslator()
        cleaner = ImageCleaner()
        typesetter = TextRenderer()
    except Exception as e:
        logger.critical(f"Failed to initialize modules: {e}")
        return

    try:
        original_image = Image.open(args.image_path).convert("RGB")
    except Exception as e:
        logger.error(f"Failed to open image: {e}")
        return

    # 1. Detection
    logger.info("Step 1: Detecting Speech Bubbles...")
    bboxes = detector.detect(args.image_path)
    
    if not bboxes:
        logger.warning("No bubbles detected. Exiting.")
        return

    result_image = original_image.copy()

    for i, bbox in enumerate(bboxes):
        logger.info(f"Processing Bubble {i+1}/{len(bboxes)} at {bbox}...")
        x1, y1, x2, y2 = bbox
        
        crop = original_image.crop((x1, y1, x2, y2))
        
        # 2. OCR
        logger.info("Step 2: Performing OCR...")
        jp_text = ocr.process(crop)
        
        if not jp_text or len(jp_text.strip()) == 0:
            logger.info("Empty text detected, skipping bubble.")
            continue
            
        logger.info(f"Detected Text: {jp_text}")

        # 3. Translation
        logger.info("Step 3: Translating...")
        en_text = translator.translate(jp_text)
        logger.info(f"Translated Text: {en_text}")
        
        if not en_text or en_text == "[Translation Error]":
             logger.warning("Translation failed or empty, skipping text replacement.")
             continue

        # 4. Cleaning (Inpainting)
        logger.info("Step 4: Cleaning (Inpainting)...")
        result_image = cleaner.clean(result_image, bbox)

        # 5. Typesetting
        logger.info("Step 5: Typesetting...")
        result_image = typesetter.render(result_image, en_text, bbox)

    logger.info(f"Saving result to {args.output}...")
    result_image.save(args.output)
    logger.info("Pipeline completed successfully!")

if __name__ == "__main__":
    main()

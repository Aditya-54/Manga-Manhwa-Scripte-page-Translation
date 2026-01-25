from manga_ocr import MangaOcr
from PIL import Image
import logging
import numpy as np

logger = logging.getLogger(__name__)

class MangaReader:
    """
    Wrapper for MangaOCR to extract text from images.
    """
    def __init__(self):
        """
        Initialize MangaOCR.
        Using force_cpu=False to use CUDA if available by default in manga-ocr implementation
        or relying on PyTorch default behavior.
        """
        logger.info("Loading MangaOCR model...")
        self.mocr = MangaOcr()

    def process(self, image_crop: Image.Image) -> str:
        """
        Perform OCR on a cropped image region.
        
        Args:
            image_crop: PIL Image object containing the text bubble.
            
        Returns:
            Detected text string.
        """
        text = self.mocr(image_crop)
        return text

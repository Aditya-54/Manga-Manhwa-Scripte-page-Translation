import os
from typing import List, Tuple, Any
from ultralytics import YOLO
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BubbleDetector:
    """
    Detects speech bubbles in manga pages using YOLOv8.
    """
    def __init__(self, model_path: str = "models/comic_bubble.pt"):
        """
        Initialize the YOLO detector.
        Falls back to 'yolov8n.pt' if the custom model is not found.
        """
        if not os.path.exists(model_path):
            logger.warning(f"Model not found at {model_path}. Falling back to 'yolov8n.pt'.")
            model_path = "yolov8n.pt"
            
        logger.info(f"Loading YOLO model from {model_path}...")
        self.model = YOLO(model_path)

    def detect(self, image_path: str) -> List[Tuple[int, int, int, int]]:
        """
        Run inference on an image and return bounding boxes.
        
        Args:
            image_path: Path to the input image.
            
        Returns:
            List of bounding boxes (x1, y1, x2, y2) as integers.
        """
        logger.info(f"Running detection on {image_path}...")
        results: List[Any] = self.model(image_path)
        
        bboxes = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                bboxes.append((x1, y1, x2, y2))
                
        logger.info(f"Detected {len(bboxes)} bubbles.")
        return bboxes

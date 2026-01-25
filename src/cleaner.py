from simple_lama_inpainting import SimpleLama
from PIL import Image, ImageDraw
import logging
import numpy as np
import cv2

logger = logging.getLogger(__name__)

class ImageCleaner:
    """
    Removes text from images using LaMa inpainting.
    """
    def __init__(self):
        logger.info("Loading LaMa Inpainting model...")
        self.lama = SimpleLama()

    def clean(self, image: Image.Image, bbox: tuple) -> Image.Image:
        """
        Inpaint the area defined by bbox.
        
        Args:
            image: Original PIL Image.
            bbox: Tuple (x1, y1, x2, y2).
            
        Returns:
            Inpainted PIL Image.
        """
        x1, y1, x2, y2 = bbox
        
        img_np = np.array(image)
        crop = img_np[y1:y2, x1:x2]
        
        if len(crop.shape) == 3:
            gray = cv2.cvtColor(crop, cv2.COLOR_RGB2GRAY)
        else:
            gray = crop
            
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 21, 10
        )
        
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        crop_mask = np.zeros_like(gray)
        
        h, w = gray.shape
        img_area = h * w
        
        if len(contours) > 0:
            contours = sorted(contours, key=cv2.contourArea, reverse=True)
            
            for i, cnt in enumerate(contours):
                area = cv2.contourArea(cnt)
                x, y, cw, ch = cv2.boundingRect(cnt)
                
                if area < 3:
                     continue
                     
                is_border = False
                
                # Check for border conditions (large size or frame-like)
                if i == 0 and area > 0.1 * img_area:
                    is_border = True
                    
                touches_left = x <= 2
                touches_top = y <= 2
                touches_right = (x + cw) >= w - 2
                touches_bottom = (y + ch) >= h - 2
                
                if (touches_left and touches_right) or (touches_top and touches_bottom):
                    is_border = True
                    
                if is_border:
                    continue
                    
                cv2.drawContours(crop_mask, [cnt], -1, 255, -1)

        kernel_morph = np.ones((3,3), np.uint8)
        crop_mask = cv2.morphologyEx(crop_mask, cv2.MORPH_CLOSE, kernel_morph)

        kernel = np.ones((3,3), np.uint8)
        crop_mask = cv2.dilate(crop_mask, kernel, iterations=4)
        
        mask = Image.new("L", image.size, 0)
        start_x, start_y = x1, y1
        
        crop_mask_pil = Image.fromarray(crop_mask)
        mask.paste(crop_mask_pil, (start_x, start_y))
        
        logger.info(f"Cleaning region: {bbox}...")
        
        result = self.lama(image, mask)
        
        return result

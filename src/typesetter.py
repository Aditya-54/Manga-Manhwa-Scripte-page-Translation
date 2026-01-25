from PIL import Image, ImageDraw, ImageFont
import textwrap
import logging

logger = logging.getLogger(__name__)

class TextRenderer:
    """
    Renders text back onto the image.
    """
    def __init__(self, font_path: str = "arial.ttf", font_size: int = 20):
        self.font_path = font_path
        self.base_font_size = font_size
        try:
            self.font = ImageFont.truetype(font_path, font_size)
        except IOError:
            logger.warning(f"Could not load font {font_path}, using default.")
            self.font = ImageFont.load_default()

    def render(self, image: Image.Image, text: str, bbox: tuple) -> Image.Image:
        """
        Draw text centered in the bbox.
        
        Args:
            image: PIL Image (cleaned).
            text: Translated text.
            bbox: (x1, y1, x2, y2).
            
        Returns:
            Image with text drawn.
        """
        x1, y1, x2, y2 = bbox
        width = x2 - x1
        height = y2 - y1
        
        draw = ImageDraw.Draw(image)
        
        # Estimate chars per line
        avg_char_width = 10 
        chars_per_line = max(1, width // avg_char_width)
        
        lines = textwrap.wrap(text, width=chars_per_line)
        
        line_height = 0
        if hasattr(self.font, 'getbbox'):
             line_height = self.font.getbbox("A")[3]
        else:
             line_height = 15

        total_text_height = len(lines) * line_height
        
        start_y = y1 + (height - total_text_height) // 2
        
        current_y = start_y
        for line in lines:
            try:
                line_width = self.font.getlength(line)
            except AttributeError:
                line_width = len(line) * avg_char_width

            start_x = x1 + (width - line_width) // 2
            
            outline_range = 2
            for adj_x in range(-outline_range, outline_range+1):
                for adj_y in range(-outline_range, outline_range+1):
                    draw.text((start_x+adj_x, current_y+adj_y), line, font=self.font, fill="white")

            draw.text((start_x, current_y), line, font=self.font, fill="black")
            current_y += line_height
            
        return image

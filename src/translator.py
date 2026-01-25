import requests
import logging
import json

logger = logging.getLogger(__name__)

class LocalTranslator:
    """
    Translates text using a local Ollama instance (Llama 3).
    """
    def __init__(self, model: str = "llama3", host: str = "http://localhost:11434"):
        self.model = model
        self.host = host
        self.api_url = f"{host}/api/generate"

    def translate(self, text: str) -> str:
        """
        Translate Japanese text to English.
        
        Args:
            text: Japanese text string.
            
        Returns:
            English translation.
        """
        if not text or text.strip() == "":
            return ""

        logger.info(f"Translating: {text[:20]}...")
        
        prompt = (
            "You are a professional manga translator. Translate the following Japanese text to English. "
            "Output ONLY the English translation, no explanations, no notes. "
            "Keep it natural and informal if it fits a comic context.\n\n"
            f"Text: {text}\n"
            "Translation:"
        )

        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        try:
            response = requests.post(self.api_url, json=data)
            response.raise_for_status()
            result = response.json()
            translation = result.get("response", "").strip()
            logger.info(f"Translation result: {translation[:20]}...")
            return translation
        except requests.RequestException as e:
            logger.error(f"Translation failed: {e}")
            return "[Translation Error]"

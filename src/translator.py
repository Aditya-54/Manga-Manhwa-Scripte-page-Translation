import requests
import logging
import json
import os

logger = logging.getLogger(__name__)


class LocalTranslator:
    """
    Translates text using a local Ollama instance (Llama 3).
    """
    def __init__(self, model: str = "llama3", host: str = "http://localhost:11434"):
        self.model = model
        self.host = host
        self.api_url = f"{host}/api/generate"

    def translate(self, text: str, context_prompt: str = "") -> str:
        """
        Translate Japanese text to English.
        
        Args:
            text: Japanese text string.
            context_prompt: Optional MCP-style context for tone-aware translation.
            
        Returns:
            English translation.
        """
        if not text or text.strip() == "":
            return ""

        logger.info(f"Translating: {text[:20]}...")
        
        base_instruction = (
            "You are a professional manga translator. Translate the following Japanese text to English. "
            "Output ONLY the English translation, no explanations, no notes. "
            "Keep it natural and informal if it fits a comic context.\n\n"
        )
        
        if context_prompt:
            base_instruction += f"Context: {context_prompt}\n\n"
        
        prompt = base_instruction + f"Text: {text}\nTranslation:"

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


class LingoTranslator:
    """
    Translates text using the official Lingo.dev Python SDK for context-aware,
    tone-preserving manga translation.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("LINGODOTDEV_API_KEY", "")
        self._engine = None
        
        if not self.api_key:
            logger.warning(
                "No Lingo.dev API key found. Set LINGODOTDEV_API_KEY env variable. "
                "Falling back to LocalTranslator if used."
            )
        else:
            try:
                from lingodotdev import LingoDotDevEngine
                self._engine = LingoDotDevEngine({"api_key": self.api_key})
                logger.info("Lingo.dev SDK engine initialized successfully")
            except ImportError:
                logger.warning(
                    "lingodotdev package not installed. Run: pip install lingodotdev"
                )
            except Exception as e:
                logger.error(f"Failed to initialize Lingo.dev engine: {e}")

    @property
    def is_available(self) -> bool:
        return self._engine is not None

    def translate(self, text: str, context_prompt: str = "",
                  source_locale: str = "ja", target_locale: str = "en") -> str:
        """
        Translate text using Lingo.dev SDK with MCP-style context.
        
        Args:
            text: Source text (Japanese by default).
            context_prompt: MCP-style context prompt describing character, tone, scene.
            source_locale: Source language code.
            target_locale: Target language code.
            
        Returns:
            Translated text string.
        """
        if not text or text.strip() == "":
            return ""
        
        if not self.is_available:
            logger.error("Lingo.dev engine not available.")
            return "[Translation Error: No API Key]"

        logger.info(f"[Lingo.dev] Translating: {text[:20]}...")

        import asyncio

        async def _do_translate():
            # Build the text with context if provided
            content_text = text
            if context_prompt:
                # Prepend context as instructions for the AI translation
                content_text = f"[Context: {context_prompt}]\n\n{text}"
            
            params = {
                "source_locale": source_locale,
                "target_locale": target_locale,
            }
            result = await self._engine.localize_text(content_text, params)
            return result

        try:
            # Run the async SDK method synchronously.
            # Each call gets a fresh event loop + fresh engine to avoid
            # "Event loop is closed" errors from httpx client reuse.
            import threading
            from lingodotdev import LingoDotDevEngine
            result_holder = [None]
            error_holder = [None]
            
            def run_in_thread():
                try:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    try:
                        # Create a fresh engine instance per thread
                        engine = LingoDotDevEngine({"api_key": self.api_key})
                        
                        async def _do():
                            content_text = text
                            if context_prompt:
                                content_text = f"[Context: {context_prompt}]\n\n{text}"
                            params = {
                                "source_locale": source_locale,
                                "target_locale": target_locale,
                            }
                            return await engine.localize_text(content_text, params)
                        
                        result_holder[0] = loop.run_until_complete(_do())
                    finally:
                        loop.close()
                except Exception as e:
                    error_holder[0] = e
            
            thread = threading.Thread(target=run_in_thread)
            thread.start()
            thread.join(timeout=30)
            
            if error_holder[0]:
                raise error_holder[0]
            translation = result_holder[0] or ""

            if isinstance(translation, str):
                translation = translation.strip()
            else:
                translation = str(translation).strip()
            
            logger.info(f"[Lingo.dev] Result: {translation[:30]}...")
            return translation
        except Exception as e:
            logger.error(f"[Lingo.dev] Translation failed: {e}")
            return "[Translation Error]"


def get_translator(prefer_lingo: bool = True):
    """
    Factory function: returns LingoTranslator if API key is available
    and prefer_lingo is True, otherwise falls back to LocalTranslator.
    """
    if prefer_lingo:
        lingo = LingoTranslator()
        if lingo.is_available:
            logger.info("Using Lingo.dev translator (context-aware)")
            return lingo
        logger.info("Lingo.dev key not found, falling back to Ollama")
    
    return LocalTranslator()

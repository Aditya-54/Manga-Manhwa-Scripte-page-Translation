# 🔮 Future Plans & Roadmap

## 1. Advanced Typesetting
*   **Vertical Text Support**: Implement an algorithm to write English text vertically or detect if the bubble shape suits vertical text better.
*   **Auto-Font Selection**: Detect the "emotion" of the text (shouting, whispering) and select appropriate fonts (bold, scribbled, small).
*   **Shape-Aware Wrapping**: Instead of a simple rectangular wrap, use the contour of the bubble to flow text more naturally.

## 2. Improved Inpainting & Cleaning
*   **Refined Masking**: Improve the OpenCV mask to handle complex sound effects (SFX) that might overlap with art.
*   **SFX Translation**: Detect large Sound Effects (outside bubbles), identifying them separately, and replacing them with stylized English SFX.

## 3. Translation Quality
*   **Context Awareness**: Currently, translation is done bubble-by-bubble. Future versions should pass the *entire page context* or previous pages to the LLM to maintain consistent character names and tone.
*   **Glossary Support**: Allow users to define specific terms (e.g., "Hokage", "Chakra") to ensure consistent terms.

## 4. Application & UI
*   **Web Interface**: Build a Streamlit or React front-end to allow drag-and-drop usage.
*   **Batch Processing**: Support processing entire folders or PDF chapters at once.
*   **PDF Export**: Automatically compile processed images back into a PDF or CBZ file.

## 5. Performance
*   **Optimization**: Quantize models to run faster on CPUs or lower-end GPUs.
*   **Parallel Processing**: Run OCR and Cleaning in parallel for multiple bubbles to speed up page generation.

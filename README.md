

**MangaScribe** is an automated manga scanlation pipeline that detects speech bubbles, reads Japanese text, translates it to English using a local LLM, cleans the bubbles, and typesets the translated text back onto the page.

##  Installation

### Prerequisites
*   **Python 3.10+**
*   **Ollama**: Download from [ollama.com](https://ollama.com) and install it.
*   **Git Bash** or **PowerShell**

### Setup Steps

1.  **Clone the project** (or extract the files).
2.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Start Ollama Server**:
    Open a **separate** terminal and run:
    ```bash
    ollama run llama3
    ```
    *(Keep this terminal open/minimized)*.

4.  **Download Detection Model**:
    Run the included script to fetch the specialized YOLOv8 model for speech bubbles:
    ```bash
    python download_model.py
    ```

##  Usage

Run the pipeline on a single image:

```bash
python main.py path/to/your/image.jpg --output result_page.png
```

**Example:**
```bash
python main.py a.jpg
```

##  Pipeline Architecture

1.  **Detection**: Uses **YOLOv8** (`ogkalu/comic-speech-bubble-detector-yolov8m`) to find speech bubbles.
2.  **OCR**: Uses **MangaOCR** to accurately read vertical Japanese text.
3.  **Translation**: Connects to a local **Ollama (Llama 3)** instance via API to translate Japanese to English.
4.  **Cleaning**: Uses **Simple LaMa Inpainting** combined with **OpenCV** masking to erase original text while preserving the bubble background.
5.  **Typesetting**: Uses **Pillow** to text-wrap and render English text centered in the bubble.

## Current Progress

Below is a comparison of the input vs the automated output.

| Original Input (`a.jpg`) | Automated Result (`result_page.png`) |
| :---: | :---: |
| ![Original](a.jpg) | ![Result](result_page.png) |


## 🚧 Future Plans & Contribution

Development is actively ongoing! We are working on features like **Advanced Typesetting**, **Context-Aware Translation**, and a **Web UI**.

**Contributors are welcome!** 
For a detailed roadmap of what's coming next, please check [FUTURE_PLANS.md](FUTURE_PLANS.md).

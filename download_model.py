from huggingface_hub import hf_hub_download
import shutil
import os

def download_model():
    if not os.path.exists("models"):
        os.makedirs("models")
        
    print("Downloading YOLOv8 Comic Bubble Detector from Hugging Face...")
    try:
        # 'ogkalu/comic-speech-bubble-detector-yolov8m' contains comic-speech-bubble-detector.pt
        model_path = hf_hub_download(repo_id="ogkalu/comic-speech-bubble-detector-yolov8m", filename="comic-speech-bubble-detector.pt")
        target_path = "models/comic_bubble.pt"
        shutil.copy(model_path, target_path)
        print(f"Model successfully saved to {target_path}")
    except Exception as e:
        print(f"Failed to download model: {e}")

if __name__ == "__main__":
    download_model()

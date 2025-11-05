import sys
import json
import os
#-- ====================================== remove b4 running ======================================
import re
import subprocess


# --- Force-add site-packages to sys.path ---
site_packages = r"C:\Users\admin\AppData\Local\Programs\Python\Python313\Lib\site-packages"
if site_packages not in sys.path:
    sys.path.append(site_packages)


# --- DEBUG INFO ---
debug_info = {
    "python_executable": sys.executable,
    "sys_path": sys.path,
    "current_working_directory": os.getcwd()
}
print(json.dumps(debug_info))


# --- Dependency Auto-Check (Fixed) ---
required_libraries = {
    "PyPDF2": "PyPDF2",
    "python-docx": "docx",
    "pytesseract": "pytesseract",
    "Pillow": "PIL",
    "groq": "groq"
}
missing = []
for lib, import_name in required_libraries.items():
    try:
        __import__(import_name)
    except ImportError:
        missing.append(lib)
if missing:
    print(json.dumps({
        "error": f"Missing Python libraries: {', '.join(missing)}",
        "hint": f"Install them by running: pip install {' '.join(missing)}"
    }))
    sys.exit(1)


# --  =================================== end remove ===============================================




# --- Safe Imports ---
from PyPDF2 import PdfReader
import docx
import pytesseract
from PIL import Image
from groq import Groq


# --- Tesseract Path Check ---
tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(tesseract_path):
    pytesseract.pytesseract.tesseract_cmd = tesseract_path
else:
    if not any("Tesseract-OCR" in p for p in os.environ.get("PATH", "").split(";")):
        print(json.dumps({
            "error": "Tesseract OCR is not installed or not in your PATH.",
            "hint": "Download it from https://github.com/UB-Mannheim/tesseract/wiki and install to C:\\Program Files\\Tesseract-OCR"
        }))
        sys.exit(1)


# --- Groq API Setup ---
api_key = ""
if not api_key:
    print(json.dumps({
        "error": "Missing GROQ_API_KEY environment variable.",
        "hint": "Set your Groq API key in environment variable GROQ_API_KEY"
    }))
    sys.exit(1)
client = Groq(api_key=api_key)


# --- Argument Handling ---
if len(sys.argv) < 2:
    print(json.dumps({"error": "No file path provided"}))
    sys.exit(1)
file_path = sys.argv[1]
if not os.path.exists(file_path):
    print(json.dumps({"error": "File not found"}))
    sys.exit(1)


# --- Extract Text Function ---
def extract_text(file_path):
    ext = file_path.lower().split(".")[-1]
    text = ""
    try:
        if ext == "pdf":
            reader = PdfReader(file_path)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        elif ext == "docx":
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        elif ext in ["jpg", "jpeg", "png"]:
            text = pytesseract.image_to_string(Image.open(file_path))
        else:
            return f"Unsupported file format: .{ext}"
        return text.strip()
    except Exception as e:
        return f"Error reading file: {e}"


# --- Extract Text ---
text = extract_text(file_path)
if not text or text.startswith("Error"):
    print(json.dumps({"error": text or "Could not extract text from the file"}))
    sys.exit(1)


# --- Use Groq to Generate AI Summary ---
try:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # or another supported model
        messages=[
            {
                "role": "system",
                "content": "You are an expert résumé summarizer. Summarize the applicant’s data in 2-3 concise paragraphs, focusing on name, contact, skills, qualifications and key highlights."
            },
            {
                "role": "user",
                "content": text
            }
        ],
        max_completion_tokens=300
    )
    ai_summary = response.choices[0].message.content.strip()
except Exception as e:
    print(json.dumps({"error": f"AI summarization failed: {e}"}))
    sys.exit(1)


# --- Output JSON for PHP ---
print(json.dumps({
    "success": True,
    "ai_summary": ai_summary
}, indent=4))
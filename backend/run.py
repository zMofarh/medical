import os
import sys
import subprocess

# تحديد مسار بايثون الخاص بالبيئة الافتراضية
if os.name == "nt":  # Windows
    venv_python = os.path.join("../.venv", "Scripts", "python.exe")
else:  # Linux/Mac
    venv_python = os.path.join("../.venv", "bin", "python")

if not os.path.exists(venv_python):
    print("Error: Virtual environment .venv not found.")
    print("Please make sure .venv folder exists in backend directory.")
    sys.exit(1)

# الأمر لتشغيل uvicorn
command = [venv_python, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"]
print(command)
print("Starting FastAPI server on http://127.0.0.1:8000 ...")
try:
    subprocess.run(command, check=True)
except KeyboardInterrupt:
    print("\nServer stopped.")
except subprocess.CalledProcessError as e:
    print(f"Error starting Uvicorn: {e}")

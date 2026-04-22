# 1. Base Image: Use Python 3.10 for reliability
FROM python:3.10-slim

# 2. Environment Variables
# Prevents Python from writing pyc files and ensures output is sent straight to terminal
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Work Directory
WORKDIR /app

# 4. Dependency Management
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Application Injection
COPY . .

# 6. Production Launch Command
# Cloud Run expects the app to listen on the port defined by the PORT env variable ($PORT)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

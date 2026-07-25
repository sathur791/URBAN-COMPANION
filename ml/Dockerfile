FROM python:3.11-slim

WORKDIR /ml

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "scripts/train_all.py"]

FROM python:3.13-slim

RUN mkdir /app
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

CMD exec uvicorn main:app --host 0.0.0.0 --port 8000

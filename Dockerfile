## Humphrey Come Home
# Auth: Bryce Emery
# Date: 26Feb23
# Ref: https://www.docker.com/blog/how-to-dockerize-django-app/

FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1
RUN mkdir /app
WORKDIR /app

RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin

ADD requirements.txt /app

RUN pip install --upgrade pip && pip install -r /app/requirements.txt




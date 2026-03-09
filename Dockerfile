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
    postgresql-client \
    gdal-bin

ADD requirements.txt /app

RUN pip install --upgrade pip && pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

EXPOSE 8000

ENTRYPOINT ["./wait_for_pg.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

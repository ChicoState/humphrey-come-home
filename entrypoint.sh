#!/bin/sh
# wait_for_pg.sh
# Bryce Emery
# Ref: https://www.tutorialpedia.org/blog/docker-wait-for-postgresql-to-be-running/

set -e

echo "===> Waiting for PostGIS at ${POSTGRES_DB_HOST}:${POSTGRES_DB_PORT}... <==="
until pg_isready -h "${POSTGRES_DB_HOST:-db}" -p "${POSTGRES_DB_PORT:-5432}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"; do
  >&2 echo "PostGIS is unavailable (retrying in 1 second)..."
  sleep 1
done

>&2 echo "PostGIS is ready ===> Starting Django..."

python manage.py makemigrations
python manage.py migrate
# Create superuser if does not already exist
# I got this check with help from a Chatbot --Bryce
if python manage.py shell -c "from django.contrib.auth.models import User; import sys; sys.exit(0 if User.objects.filter(username='${DJANGO_SUPERUSER_NAME}').exists() else 1)"; then
  echo "Initial superuser exists ===>"
else
  echo "===> Creating initial superuser"
  python manage.py createsuperuser --username="${DJANGO_SUPERUSER_NAME}" --email="${DJANGO_SUPERUSER_MAIL}" --no-input
fi


exec "$@"

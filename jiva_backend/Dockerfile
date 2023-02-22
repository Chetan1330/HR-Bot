# pull official base image
FROM python:3.10

# set work directory
WORKDIR /app
# VOLUME /app

# install psycopg2
RUN pip install --upgrade pip

# install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

#Copy app files to app directory
COPY . .

# collect static files
RUN python manage.py collectstatic --noinput

# add and run as non-root user
RUN adduser --disabled-password djangouser
USER djangouser

CMD ["gunicorn", "jiva_backend.wsgi", "-b", ":8000", "--reload", "--workers", "3", "--timeout", "120"]
Running docker commands
docker-compose exec web python manage.py migrate --noinput

--https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/

https://levelup.gitconnected.com/deploy-your-django-app-to-a-vps-with-nginx-cc2fc0869cfa

open /Library/PostgreSQL/15/uninstall-postgresql.app

When ssh fails
sudo ufw allow 22/tcp

cc

docker run -v $(pwd):/app rasa/rasa:3.2.1-full train --domain domain.yml --data data --out models
#!/bin/bash
cd /home/alik/MY-DIARY

# 1. Включаем сервисный nginx с локацией для certbot
NGINX_CONFIG=nginx-init.conf sudo -E /usr/bin/docker compose up -d nginx

# Небольшая пауза, чтобы контейнер успел переинициализироваться
sleep 2

# 2. Запускаем обновление сертификатов Certbot
/usr/bin/docker run --rm --name certbot \
  -v "/home/alik/MY-DIARY/certbot/conf:/etc/letsencrypt" \
  -v "/home/alik/MY-DIARY/certbot/www:/var/www/certbot" \
  certbot/certbot renew --quiet

# 3. Возвращаем основной nginx (переменную НЕ передаем, монтируется обычный nginx.conf)
sudo /usr/bin/docker compose up -d nginx

# Деплой на VPS заказчика (чеклист разработчика)

После того как заказчик прислал IP + SSH.

## На сервере (один раз)

```bash
apt update && apt install -y nginx certbot python3-certbot-nginx
mkdir -p /var/www/apexgard
```

## DNS (делает заказчик)

- `A` `@` → IP
- `A` `www` → IP

## Заливка сайта

```bash
rsync -avz --delete R:/work/apexgard-site/ user@IP:/var/www/apexgard/ \
  --exclude .git --exclude docs --exclude .github
```

Или scp содержимое: index.html, css/, js/, assets/, CNAME не нужен на VPS.

## nginx

```nginx
server {
    listen 80;
    server_name apexgard.ru www.apexgard.ru;
    root /var/www/apexgard;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

```bash
certbot --nginx -d apexgard.ru -d www.apexgard.ru
```

## Проверка

- https://apexgard.ru
- https://www.apexgard.ru
- QR → assets/qr-apexgard.png
- Метрика в index.html

## Не использовать

- GitHub Pages для продакшена
- CNAME на github.io в DNS заказчика

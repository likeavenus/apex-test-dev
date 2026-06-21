# APEXGARD — лендинг

Сайт-лендинг для продуктов APEXGARD: полиуретановая защитная плёнка (PPF 190 Micron) и установочная жидкость (Wrap Soap).

Тёмная тема с бирюзовым акцентом по дизайн-референсу заказчика. Контент и картинки — временные заглушки, будут заменены на финальные материалы.

## Стек

- Чистый HTML + CSS + JS, без сборки и зависимостей
- Шрифты: Montserrat + Inter (Google Fonts)
- Анимации появления на IntersectionObserver

## Структура

```
index.html        — вся разметка лендинга
css/styles.css    — стили (тёмная тема, адаптив)
js/main.js        — меню, скролл-эффекты, reveal-анимации
assets/           — картинки-заглушки и favicon
```

## Запуск локально

Открыть `index.html` в браузере, либо поднять локальный сервер:

```bash
npx serve .
# или
python -m http.server 8080
```

## Деплой (GitHub Pages)

- Репозиторий: https://github.com/likeavenus/apex-test-dev
- Workflow: `.github/workflows/deploy.yml` — автодеплой при push в `main`
- Временный URL: https://likeavenus.github.io/apex-test-dev/
- **Целевой домен:** https://apexgard.ru (файл `CNAME` в корне)

### Подключение домена

1. Заказчик добавляет DNS в Selectel → см. `docs/INSTRUKCIYA-ZAKAZCHIKU.md`
2. GitHub → Settings → Pages → Custom domain: `apexgard.ru` → Enforce HTTPS
3. Проверить `apexgard.ru` и `www.apexgard.ru`

### QR и аналитика

- QR: `assets/qr-apexgard.png`, ссылка с UTM — см. `docs/QR-KOD.md`
- Яндекс Метрика: код вставить в `index.html` (место помечено комментарием)

## TODO

- [ ] Заказчик: DNS-записи в Selectel
- [ ] GitHub Pages: custom domain + HTTPS (после DNS)
- [ ] Код Яндекс Метрики от заказчика

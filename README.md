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

## Деплой

**Продакшен:** VPS заказчика в Selectel + nginx + Let's Encrypt.  
Инструкция для заказчика: `docs/INSTRUKCIYA-SERVER-ZAKAZCHIKU.md`  
Чеклист разработчика: `docs/DEPLOY-VPS-DEV.md`

**Демо (временно):** https://likeavenus.github.io/apex-test-dev/ — не использовать с apexgard.ru.

## TODO

- [ ] Заказчик: VPS + DNS + SSH
- [ ] Деплой на VPS
- [ ] Код Яндекс Метрики от заказчика

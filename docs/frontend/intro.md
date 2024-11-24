<style lang="scss">
@tailwind utilities;

.tw-text-primary {
  color: var(--vp-c-accent, #299764);
}

.tw-bg-primary {
  color: var(--vp-c-accent, #299764);
}

.tags {
  flex-wrap: wrap;
}

.tag {
  padding: 5px 10px;
  border: 1px solid #19B58F;
  white-space: nowrap;
}
</style>

# Introduction
 
Важная информация для разработчиков о frontend-части административной панели от великолепных специалистов, которых по праву считают лучшими в мире.😏

## Скрипты проекта

``npm run dev``: Запуск административной панели в режиме разработчика.

``npm run preview``: Запуск административной панели в режиме Production.

``npm run build``: Сборка административной панели в Production.

``npm run lint``: Проверка проекта на ошибки Eslint.

``npm run lint:fix``: Проверка проекта на ошибки Eslint с автоматическим исправлением.

``npm run test:unit``: Live Проверка unit тестов с выводом в терминале.

``npm run coverage``: Проверка Components тестов с выводом в терминале.

``npm run coverage:ui``: Live Проверка Components тестов с выводом на веб странице.

``npm run docs:dev``: Запуск страницы документации в режиме разработчика.

``npm run docs:build``: Сборка страниц документации проекта.

## Полезные ссылки

Новая Админка: [http://10.35.16.1](http://10.35.16.1) (Логин: web, Пароль: 12345)

Старая Админка: [http://10.200.3.1](http://10.200.3.1) (Логин: touchon, Пароль: touchon)

Figma Дизайн: [https://www.figma.com](https://www.figma.com/design/pDt71g3yU58Wfw15lB7pMM/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%BA%D0%B0?node-id=15-22143&node-type=frame&t=ukB0bp3aVLw0wYd5-0)

Swagger: 
- Translator [http://10.35.16.1:8081/swagger/index.html](http://10.35.16.1:8081/swagger/index.html)
- Object manager [http://10.35.16.1:8082/swagger/index.html](http://10.35.16.1:8082/swagger/index.html)
- Action router [http://10.35.16.1:8083/swagger/index.html](http://10.35.16.1:8083/swagger/index.html)

Confluence: [http://10.35.99.102:8090](http://10.35.99.102:8090)

Jira Software: [http://178.57.106.190:17171](http://178.57.106.190:17171)

Github Repository: [https://github.com/VladimirDronik/admin-panel](https://github.com/VladimirDronik/admin-panel)

## Стек
<div class="tags tw-flex tw-gap-2 tw-pt-2 tw-w-full">
  <div class="tag tw-rounded-lg tw-text-primary">Nuxt v3</div>
  <div class="tag tw-rounded-lg tw-text-primary">PrimeVue v4</div>
  <div class="tag tw-rounded-lg tw-text-primary">Tailwind v3</div>
  <div class="tag tw-rounded-lg tw-text-primary">Pinia v2</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vue-i18n v10</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vite v5</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vitest v2</div>
  <div class="tag tw-rounded-lg tw-text-primary">Scss</div>
</div>

## Конфигурация

Используется как SPA фреймворк.

[Nuxt](https://nuxt.com/):
- ssr: ``false``
- autoImport: ``true`` (Кроме autoImport Primevue)

[Tailwind](https://tailwindcss.com/):
- классы имеют prefix ``tw-``

[PrimeVue](https://primevue.org/setup/):
- Интегрирован Tailwind
- список использующихся компонентов прописан в <span class="tw-text-primary">theme/Components.ts</span>

## Icons

Используются готовые решения 
[vue-tabler-icons](https://tabler.io/icons)
и
[primeicons](https://primevue.org/icons/#list).
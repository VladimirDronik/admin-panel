<style lang="scss">
@tailwind utilities;

.tw-text-primary {
  color: var(--vp-c-accent, #299764);
}
.tw-bg-primary {
  color: var(--vp-c-accent, #299764);
}
.tag {
  padding: 5px 10px;
  border: 1px solid #19B58F;
}
</style>

# Introduction
 
Основаная информация для разработчиков о Frontend части Административной панели от Потрясающих для Лучших разработчиков в мире.😏

## Полезные ссылки

Новая Админка: [http://10.35.16.1](http://10.35.16.1) (Логин: web, Пароль: 12345)

Старая Админка: [http://10.200.3.1](http://10.200.3.1) (Логин: touchon, Пароль: touchon)

Swagger: 
- Translator [http://10.35.16.1:8081/swagger/index.html](http://10.35.16.1:8081/swagger/index.html)
- Object manager [http://10.35.16.1:8082/swagger/index.html](http://10.35.16.1:8082/swagger/index.html)
- Action router [http://10.35.16.1:8083/swagger/index.html](http://10.35.16.1:8083/swagger/index.html)

Confluence: [http://10.35.99.102:8090](http://10.35.99.102:8090)

Jira Software: [http://178.57.106.190:17171](http://178.57.106.190:17171)

Github Repository: [https://github.com/VladimirDronik/admin-panel](https://github.com/VladimirDronik/admin-panel)

## Стек
<div class="tw-flex tw-gap-2 tw-pt-2">
  <div class="tag tw-rounded-lg tw-text-primary">Nuxt v3</div>
  <div class="tag tw-rounded-lg tw-text-primary">PrimeVue v4</div>
  <div class="tag tw-rounded-lg tw-text-primary">Tailwind v3</div>
  <div class="tag tw-rounded-lg tw-text-primary">Pinia v2</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vue-i18n v10</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vite v5</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vitest v2</div>
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
[primeicons](https://primevue.org/icons/#list)
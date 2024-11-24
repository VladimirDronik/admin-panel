<template><div><h1 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction"><span>Introduction</span></a></h1>
<p>Важная информация для разработчиков о frontend-части административной панели от великолепных специалистов, которых по праву считают лучшими в мире.😏</p>
<h2 id="скрипты-проекта" tabindex="-1"><a class="header-anchor" href="#скрипты-проекта"><span>Скрипты проекта</span></a></h2>
<p><code v-pre>npm run dev</code>: Запуск административной панели в режиме разработчика.</p>
<p><code v-pre>npm run preview</code>: Запуск административной панели в режиме Production.</p>
<p><code v-pre>npm run build</code>: Сборка административной панели в Production.</p>
<p><code v-pre>npm run lint</code>: Проверка проекта на ошибки Eslint.</p>
<p><code v-pre>npm run lint:fix</code>: Проверка проекта на ошибки Eslint с автоматическим исправлением.</p>
<p><code v-pre>npm run test:unit</code>: Live Проверка unit тестов с выводом в терминале.</p>
<p><code v-pre>npm run coverage</code>: Проверка Components тестов с выводом в терминале.</p>
<p><code v-pre>npm run coverage:ui</code>: Live Проверка Components тестов с выводом на веб странице.</p>
<p><code v-pre>npm run docs:dev</code>: Запуск страницы документации в режиме разработчика.</p>
<p><code v-pre>npm run docs:build</code>: Сборка страниц документации проекта.</p>
<h2 id="полезные-ссылки" tabindex="-1"><a class="header-anchor" href="#полезные-ссылки"><span>Полезные ссылки</span></a></h2>
<p>Новая Админка: <a href="http://10.35.16.1" target="_blank" rel="noopener noreferrer">http://10.35.16.1</a> (Логин: web, Пароль: 12345)</p>
<p>Старая Админка: <a href="http://10.200.3.1" target="_blank" rel="noopener noreferrer">http://10.200.3.1</a> (Логин: touchon, Пароль: touchon)</p>
<p>Figma Дизайн: <a href="https://www.figma.com/design/pDt71g3yU58Wfw15lB7pMM/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%BA%D0%B0?node-id=15-22143&amp;node-type=frame&amp;t=ukB0bp3aVLw0wYd5-0" target="_blank" rel="noopener noreferrer">https://www.figma.com</a></p>
<p>Swagger:</p>
<ul>
<li>Translator <a href="http://10.35.16.1:8081/swagger/index.html" target="_blank" rel="noopener noreferrer">http://10.35.16.1:8081/swagger/index.html</a></li>
<li>Object manager <a href="http://10.35.16.1:8082/swagger/index.html" target="_blank" rel="noopener noreferrer">http://10.35.16.1:8082/swagger/index.html</a></li>
<li>Action router <a href="http://10.35.16.1:8083/swagger/index.html" target="_blank" rel="noopener noreferrer">http://10.35.16.1:8083/swagger/index.html</a></li>
</ul>
<p>Confluence: <a href="http://10.35.99.102:8090" target="_blank" rel="noopener noreferrer">http://10.35.99.102:8090</a></p>
<p>Jira Software: <a href="http://178.57.106.190:17171" target="_blank" rel="noopener noreferrer">http://178.57.106.190:17171</a></p>
<p>Github Repository: <a href="https://github.com/VladimirDronik/admin-panel" target="_blank" rel="noopener noreferrer">https://github.com/VladimirDronik/admin-panel</a></p>
<h2 id="стек" tabindex="-1"><a class="header-anchor" href="#стек"><span>Стек</span></a></h2>
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
<h2 id="конфигурация" tabindex="-1"><a class="header-anchor" href="#конфигурация"><span>Конфигурация</span></a></h2>
<p>Используется как SPA фреймворк.</p>
<p><a href="https://nuxt.com/" target="_blank" rel="noopener noreferrer">Nuxt</a>:</p>
<ul>
<li>ssr: <code v-pre>false</code></li>
<li>autoImport: <code v-pre>true</code> (Кроме autoImport Primevue)</li>
</ul>
<p><a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">Tailwind</a>:</p>
<ul>
<li>классы имеют prefix <code v-pre>tw-</code></li>
</ul>
<p><a href="https://primevue.org/setup/" target="_blank" rel="noopener noreferrer">PrimeVue</a>:</p>
<ul>
<li>Интегрирован Tailwind</li>
<li>список использующихся компонентов прописан в <span class="tw-text-primary">theme/Components.ts</span></li>
</ul>
<h2 id="icons" tabindex="-1"><a class="header-anchor" href="#icons"><span>Icons</span></a></h2>
<p>Используются готовые решения
<a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer">vue-tabler-icons</a>
и
<a href="https://primevue.org/icons/#list" target="_blank" rel="noopener noreferrer">primeicons</a>.</p>
</div></template>



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
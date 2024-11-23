<template><div><h1 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction"><span>Introduction</span></a></h1>
<p>Основаная информация для разработчиков о Frontend части Административной панели от Потрясающих для Лучших разработчиков в мире.😏</p>
<h2 id="полезные-ссылки" tabindex="-1"><a class="header-anchor" href="#полезные-ссылки"><span>Полезные ссылки</span></a></h2>
<p>Новая Админка: <a href="http://10.35.16.1" target="_blank" rel="noopener noreferrer">http://10.35.16.1</a> (Логин: web, Пароль: 12345)</p>
<p>Старая Админка: <a href="http://10.200.3.1" target="_blank" rel="noopener noreferrer">http://10.200.3.1</a> (Логин: touchon, Пароль: touchon)</p>
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
<div class="tw-flex tw-gap-2 tw-pt-2">
  <div class="tag tw-rounded-lg tw-text-primary">Nuxt v3</div>
  <div class="tag tw-rounded-lg tw-text-primary">PrimeVue v4</div>
  <div class="tag tw-rounded-lg tw-text-primary">Tailwind v3</div>
  <div class="tag tw-rounded-lg tw-text-primary">Pinia v2</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vue-i18n v10</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vite v5</div>
  <div class="tag tw-rounded-lg tw-text-primary">Vitest v2</div>
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
<a href="https://primevue.org/icons/#list" target="_blank" rel="noopener noreferrer">primeicons</a></p>
</div></template>



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
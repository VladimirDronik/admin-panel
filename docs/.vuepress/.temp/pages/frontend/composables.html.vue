<template><div><h1 id="composables" tabindex="-1"><a class="header-anchor" href="#composables"><span>Composables</span></a></h1>
<h2 id="main" tabindex="-1"><a class="header-anchor" href="#main"><span>Main</span></a></h2>
<p>Основные Сomposable функции, Утилиты.</p>
<h3 id="updatedata" tabindex="-1"><a class="header-anchor" href="#updatedata"><span>updateData</span></a></h3>
<p>Функция для api запросов. При объявлении создавать ее с приставкой <code v-pre>async</code>.</p>
<p><code v-pre>(params: Params) =&gt; void</code></p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">interface Params {</span>
<span class="line">  update: () => void,</span>
<span class="line">  success?: ()=> void</span>
<span class="line">  error?: ()=> void</span>
<span class="line">  successMessage?: string</span>
<span class="line">  errorMessage?: string</span>
<span class="line">  disableSuccessMessage?: boolean</span>
<span class="line">  disableErrorMessage?: boolean</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><span class="tw-text-primary">update</span>:
Функция с асинхронными api запросами.</p>
<p><span class="tw-text-primary">success</span>:
Функция, которая вызывается при успешном выполнении api запросов.</p>
<p><span class="tw-text-primary">error</span>:
Функция, которая вызывается при ошибке выполнении api запросов.</p>
<p><span class="tw-text-primary">successMessage</span>:
<code v-pre>String</code> Сообщение для success окна уведомлений Toast.</p>
<p><span class="tw-text-primary">errorMessage</span>:
<code v-pre>String</code> Сообщение для error окна уведомлений Toast.</p>
<p><span class="tw-text-primary">disableSuccessMessage</span>:
<code v-pre>Boolean</code> Отключение success окна уведомлений Toast.</p>
<p><span class="tw-text-primary">disableErrorMessage</span>:
<code v-pre>Boolean</code> Отключение error окна уведомлений Toast.</p>
<h2 id="api" tabindex="-1"><a class="header-anchor" href="#api"><span>Api</span></a></h2>
<h3 id="api-1" tabindex="-1"><a class="header-anchor" href="#api-1"><span>api</span></a></h3>
<p>Сomposable функции для работы с <code v-pre>api</code>. Создан на основе <code v-pre>axios</code>.</p>
<p>При возвращении <code v-pre>401</code> статус кода (ошибка авторизации), возвращает на страницу авторизации.</p>
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
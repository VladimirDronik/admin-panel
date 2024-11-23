<template><div><h1 id="helpers-functions" tabindex="-1"><a class="header-anchor" href="#helpers-functions"><span>Helpers Functions</span></a></h1>
<p>Простые функции для решения мелких задач. Находятся в папке <code v-pre>helpers</code>. Файл <code v-pre>main.ts</code> используется как общий файл для всех страниц.</p>
<h2 id="main" tabindex="-1"><a class="header-anchor" href="#main"><span>Main</span></a></h2>
<h3 id="checkstatuscolor" tabindex="-1"><a class="header-anchor" href="#checkstatuscolor"><span>checkStatusColor</span></a></h3>
<p><code v-pre>(item: string | undefined) =&gt; string</code></p>
<p>Функция получает данные от сервера поля <code v-pre>status</code>.</p>
<p>Возвращает название цвета для использования в компонентах <code v-pre>PrimeVue</code> в <code v-pre>severity</code>.</p>
<h3 id="checkstatustext" tabindex="-1"><a class="header-anchor" href="#checkstatustext"><span>checkStatusText</span></a></h3>
<p><code v-pre>(item: string | undefined) =&gt; string</code></p>
<p>Функция получает данные от сервера поля <code v-pre>status</code>.</p>
<p>Возвращает читаемое имя статуса для таблицы.</p>
<h3 id="checkstatustextsmall" tabindex="-1"><a class="header-anchor" href="#checkstatustextsmall"><span>checkStatusTextSmall</span></a></h3>
<p><code v-pre>(item: string | undefined) =&gt; string</code></p>
<p>Функция получает данные от сервера поля <code v-pre>status</code>.</p>
<p>Возвращает короткое читаемое имя статуса для таблицы.</p>
<h3 id="checkstatustextcolor" tabindex="-1"><a class="header-anchor" href="#checkstatustextcolor"><span>checkStatusTextColor</span></a></h3>
<p><code v-pre>(item: string | undefined) =&gt; string</code></p>
<p>Функция получает данные от сервера поля <code v-pre>status</code>.</p>
<p>Возвращает класс, который меняет <code v-pre>color</code>.</p>
<h3 id="checkstatusbackgroundcolor" tabindex="-1"><a class="header-anchor" href="#checkstatusbackgroundcolor"><span>checkStatusBackgroundColor</span></a></h3>
<p><code v-pre>(item: string | undefined) =&gt; string</code></p>
<p>Функция получает данные от сервера поля <code v-pre>status</code>.</p>
<p>Возвращает класс, который меняет <code v-pre>background-color</code>.</p>
<h2 id="devices" tabindex="-1"><a class="header-anchor" href="#devices"><span>Devices</span></a></h2>
<h3 id="getactionstitle" tabindex="-1"><a class="header-anchor" href="#getactionstitle"><span>getActionsTitle</span></a></h3>
<p><code v-pre>(type: string) =&gt; string</code></p>
<p>Функция получает данные от сервера поля action <code v-pre>type</code> о типе действия в событии.</p>
<p>Возвращает читаемое имя действия для таблицы.</p>
<h3 id="getactionscolor" tabindex="-1"><a class="header-anchor" href="#getactionscolor"><span>getActionsColor</span></a></h3>
<p><code v-pre>(type: string, args: any) =&gt; string</code></p>
<p>Функция получает данные от сервера поля action <code v-pre>type</code> о типе действия в событии  и <code v-pre>args</code> действия.</p>
<p>Возвращает название цвета для использования в компонентах <code v-pre>PrimeVue</code> в <code v-pre>severity</code>.</p>
<h2 id="rooms" tabindex="-1"><a class="header-anchor" href="#rooms"><span>Rooms</span></a></h2>
<h3 id="roomcolor" tabindex="-1"><a class="header-anchor" href="#roomcolor"><span>roomColor</span></a></h3>
<p><code v-pre>(color: string) =&gt; string</code></p>
<p>Функция получает данные от сервера <code v-pre>color</code>.</p>
<p>Возвращает цвет помещения в <code v-pre>hex</code> формате.</p>
<h3 id="getroomcolorbyvalue" tabindex="-1"><a class="header-anchor" href="#getroomcolorbyvalue"><span>getRoomColorByValue</span></a></h3>
<p><code v-pre>(value: string) =&gt; color</code></p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">interface color {</span>
<span class="line">  name: string,</span>
<span class="line">  code: string,</span>
<span class="line">  color: string,</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Функция получает данные о значении value <code v-pre>Select</code> из библиотеки <code v-pre>PrimeVue</code>.</p>
<p>Возвращает цвет value для корректного отображения в <code v-pre>Select</code>.</p>
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
<template><div><h1 id="components" tabindex="-1"><a class="header-anchor" href="#components"><span>Components</span></a></h1>
<h2 id="layout" tabindex="-1"><a class="header-anchor" href="#layout"><span>Layout</span></a></h2>
<p>Компоненты для использования их в <code v-pre>&lt;NuxtLayout/&gt;</code>.</p>
<h2 id="dialogs" tabindex="-1"><a class="header-anchor" href="#dialogs"><span>Dialogs</span></a></h2>
<p>Модальные окна для страниц.</p>
<h2 id="rightbar" tabindex="-1"><a class="header-anchor" href="#rightbar"><span>RightBar</span></a></h2>
<p>Выезжающие панели для страниц.</p>
<h2 id="ui-components" tabindex="-1"><a class="header-anchor" href="#ui-components"><span>UI Components</span></a></h2>
<p>UI Components имеют простую логику в основе имеют только <code v-pre>props</code> и <code v-pre>defineModel</code>. Распологаются в <code v-pre>components/shared</code> и имеют приставку <code v-pre>UI</code>, например <code v-pre>UIPanel</code>.</p>
<hr>
<h3 id="uipanel" tabindex="-1"><a class="header-anchor" href="#uipanel"><span>UIPanel</span></a></h3>
<p>Компонент для основной панели страницы с правой выезжающей панелью.</p>
<h4 id="slots" tabindex="-1"><a class="header-anchor" href="#slots"><span>Slots</span></a></h4>
<p><span class="tw-text-primary">default</span>:
Передается блок который в последствии будет скрываться и заменяться на спиннер.</p>
<hr>
<h3 id="uiloader" tabindex="-1"><a class="header-anchor" href="#uiloader"><span>UILoader</span></a></h3>
<p>Компонент заменяет блок который передан в <code v-pre>slot</code>, когда необходимо показать спиннер, при загрузке данных.</p>
<h4 id="props" tabindex="-1"><a class="header-anchor" href="#props"><span>Props</span></a></h4>
<p><span class="tw-text-primary">isUpdate</span>:
<code v-pre>Boolean</code> (Показывает или скрывает блок спиннера).</p>
<h4 id="slots-1" tabindex="-1"><a class="header-anchor" href="#slots-1"><span>Slots</span></a></h4>
<p><span class="tw-text-primary">default</span>:
Передается блок который в последствии будет скрываться и заменяться на спиннер.</p>
<hr>
<h3 id="uibreadcrumb" tabindex="-1"><a class="header-anchor" href="#uibreadcrumb"><span>UIBreadcrumb</span></a></h3>
<p>Компонент для оглавление страницы.</p>
<h4 id="props-1" tabindex="-1"><a class="header-anchor" href="#props-1"><span>Props</span></a></h4>
<p><span class="tw-text-primary">title</span>:
<code v-pre>String</code> (Текст оглавления).</p>
<p><span class="tw-text-primary">total</span>:
<code v-pre>Number</code> (Вывод цифру в степени у текста оглавления).</p>
<h4 id="slots-2" tabindex="-1"><a class="header-anchor" href="#slots-2"><span>Slots</span></a></h4>
<p><span class="tw-text-primary">default</span>:
Передается блок который вставляется с другой стороны от оглавления.</p>
<hr>
<h3 id="uilabel" tabindex="-1"><a class="header-anchor" href="#uilabel"><span>UILabel</span></a></h3>
<p>Компонент для форм, обертка полей ввода.</p>
<h4 id="props-2" tabindex="-1"><a class="header-anchor" href="#props-2"><span>Props</span></a></h4>
<p><span class="tw-text-primary">title</span>:
<code v-pre>String</code> (Текст оглавления поля ввода).</p>
<p><span class="tw-text-primary">required</span>:
<code v-pre>Boolean</code> (Звездочка для показа, что поле является обязательным).</p>
<h4 id="slots-3" tabindex="-1"><a class="header-anchor" href="#slots-3"><span>Slots</span></a></h4>
<p><span class="tw-text-primary">default</span>:
Передается блок поля ввода.</p>
<hr>
<h3 id="uiswitchfield" tabindex="-1"><a class="header-anchor" href="#uiswitchfield"><span>UISwitchField</span></a></h3>
<p>Компонент для форм с переключаемым <code v-pre>Switch</code>.</p>
<h4 id="models" tabindex="-1"><a class="header-anchor" href="#models"><span>Models</span></a></h4>
<p><span class="tw-text-primary">default</span>:
<code v-pre>Boolean</code> (Значение кнопки switch).</p>
<h4 id="props-3" tabindex="-1"><a class="header-anchor" href="#props-3"><span>Props</span></a></h4>
<p><span class="tw-text-primary">disabled</span>:
<code v-pre>Boolean</code> (Отключить изменение значения).</p>
<hr>
<h2 id="base-components" tabindex="-1"><a class="header-anchor" href="#base-components"><span>Base Components</span></a></h2>
<p>Base Components имеют сложную логику, могут производить сложные вычисления. Распологаются в <code v-pre>components/base</code> и имеют приставку <code v-pre>Base</code>, например <code v-pre>BaseTable</code>.</p>
<hr>
<h3 id="basetable" tabindex="-1"><a class="header-anchor" href="#basetable"><span>BaseTable</span></a></h3>
<p>Компонент для создания готовой таблицы с фильтрами, пагинацией.</p>
<h4 id="models-1" tabindex="-1"><a class="header-anchor" href="#models-1"><span>Models</span></a></h4>
<p><span class="tw-text-primary">page</span>:
<code v-pre>Number</code> (Значение данной страницы).</p>
<p><span class="tw-text-primary">filters</span>:
<code v-pre>Filter</code> (Описание фильтров для автоматической подгрузки данных с сервера).</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">interface Filter {</span>
<span class="line">  label: string,</span>
<span class="line">  key: string,</span>
<span class="line">  value: any,</span>
<span class="line">  show?: boolean</span>
<span class="line">  options?: (Options | string)[]</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">interface Options {</span>
<span class="line">  title: string,</span>
<span class="line">  props: {</span>
<span class="line">    value: any</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="props-4" tabindex="-1"><a class="header-anchor" href="#props-4"><span>Props</span></a></h4>
<p><span class="tw-text-primary">total</span>:
<code v-pre>Number</code> (Количество элементов для пагинации).</p>
<p><span class="tw-text-primary">items</span>:
<code v-pre>any[]</code> (Элементы для таблицы).</p>
<p><span class="tw-text-primary">perPage</span>:
<code v-pre>Number</code> (Количество элементов на странице).</p>
<p><span class="tw-text-primary">headers</span>:
<code v-pre>Header[]</code> (Оглавления таблицы).</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">interface Header {</span>
<span class="line">  label: string;</span>
<span class="line">  code: string;</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="emits" tabindex="-1"><a class="header-anchor" href="#emits"><span>Emits</span></a></h4>
<p><span class="tw-text-primary">created</span>:
<code v-pre>(params: any) =&gt; void</code></p>
<p>Функция для получения первых данных страницы. Вызывается при создании таблицы.</p>
<p><span class="tw-text-primary">update</span>:
<code v-pre>(params: getData: () =&gt; void) =&gt; void</code></p>
<p>Функция для обновления данных. getData функция для получения данных.</p>
<p><span class="tw-text-primary">click-row</span>:
<code v-pre>(params: any) =&gt; void</code></p>
<p>Функция, которая будет выполнена по нажатию на строку.</p>
<h4 id="slots-4" tabindex="-1"><a class="header-anchor" href="#slots-4"><span>Slots</span></a></h4>
<p><span class="tw-text-primary">default</span>:
Передаются данные в slot таблицы.</p>
<h4 id="expose" tabindex="-1"><a class="header-anchor" href="#expose"><span>Expose</span></a></h4>
<p><span class="tw-text-primary">filter</span>:
Функция для обновления отфильтрованных данных с учетом пагинации.</p>
<hr>
<h3 id="basetreetable" tabindex="-1"><a class="header-anchor" href="#basetreetable"><span>BaseTreeTable</span></a></h3>
<p>Компонент для создания готовой таблицы с вложенностью, с фильтрами и пагинацией.</p>
<h4 id="models-2" tabindex="-1"><a class="header-anchor" href="#models-2"><span>Models</span></a></h4>
<p><span class="tw-text-primary">page</span>:
<code v-pre>Number</code> (Значение данной страницы).</p>
<p><span class="tw-text-primary">filters</span>:
<code v-pre>Filter</code> (Описание фильтров для автоматической подгрузки данных с сервера).</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">interface Filter {</span>
<span class="line">  label: string,</span>
<span class="line">  key: string,</span>
<span class="line">  value: any,</span>
<span class="line">  show?: boolean</span>
<span class="line">  options?: (Options | string)[]</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">interface Options {</span>
<span class="line">  title: string,</span>
<span class="line">  props: {</span>
<span class="line">    value: any</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><span class="tw-text-primary">selectedKey</span>:
<code v-pre>String[]</code> (Ключи элементов, которые открыты в таблице).</p>
<h4 id="props-5" tabindex="-1"><a class="header-anchor" href="#props-5"><span>Props</span></a></h4>
<p><span class="tw-text-primary">total</span>:
<code v-pre>Number</code> (Количество элементов для пагинации).</p>
<p><span class="tw-text-primary">items</span>:
<code v-pre>any[]</code> (Элементы для таблицы).</p>
<p><span class="tw-text-primary">perPage</span>:
<code v-pre>Number</code> (Количество элементов на странице).</p>
<p><span class="tw-text-primary">headers</span>:
<code v-pre>Header[]</code> (Оглавления таблицы).</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre v-pre><code><span class="line">interface Header {</span>
<span class="line">  label: string;</span>
<span class="line">  code: string;</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="emits-1" tabindex="-1"><a class="header-anchor" href="#emits-1"><span>Emits</span></a></h4>
<p><span class="tw-text-primary">created</span>:
<code v-pre>(params: any) =&gt; void</code></p>
<p>Функция для получения первых данных страницы. Вызывается при создании таблицы.</p>
<p><span class="tw-text-primary">update</span>:
<code v-pre>(params: getData: () =&gt; void) =&gt; void</code></p>
<p>Функция для обновления данных. getData функция для получения данных.</p>
<p><span class="tw-text-primary">click-row</span>:
<code v-pre>(params: any) =&gt; void</code></p>
<p>Функция, которая будет выполнена по нажатию на строку.</p>
<h4 id="slots-5" tabindex="-1"><a class="header-anchor" href="#slots-5"><span>Slots</span></a></h4>
<p><span class="tw-text-primary">default</span>:
Передаются данные в slot таблицы.</p>
<h4 id="expose-1" tabindex="-1"><a class="header-anchor" href="#expose-1"><span>Expose</span></a></h4>
<p><span class="tw-text-primary">filter</span>:
Функция для обновления отфильтрованных данных с учетом пагинации.</p>
<hr>
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
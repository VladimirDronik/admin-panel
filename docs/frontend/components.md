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

# Components

## Layout

Компоненты для создания ``<NuxtLayout/>``.

## Dialogs

Модальные окна для страниц.

## RightBar

Выезжающие панели для страниц.

## UI Components

UI Components имеют простую логику в основе имеют только props и defineModel. находят в ``components/shared`` и имеют приставку ``UI``, например ``UIPanel``.

---

### UIPanel

Компонент создан как основная панель для создания страницы в правой панелью.

#### Slots

<span class="tw-text-primary">default</span>:
Передается блок который в последствии будет скрываться и заменяться на спиннер.

---

### UILoader

Компонент заменяет блок который передан в ``slot`` когда необходимо показать спиннер, что происходит загрузка.

#### Props

<span class="tw-text-primary">isUpdate</span>:
``Boolean`` (Показывает или скрывает блок).

#### Slots

<span class="tw-text-primary">default</span>:
Передается блок который в последствии будет скрываться и заменяться на спиннер.

---

### UIBreadcrumb

Компонент для оглавление страницы.

#### Props

<span class="tw-text-primary">title</span>:
``String`` (Текст оглавления).

<span class="tw-text-primary">total</span>:
``Number`` (Вывод цифру в степени у текста оглавления).

#### Slots

<span class="tw-text-primary">default</span>:
Передается блок который вставляется с другой стороны от оглавления.

---

### UILabel

Компонент для форм, обертка полей ввода.

#### Props

<span class="tw-text-primary">title</span>:
``String`` (Текст оглавления поля ввода).

<span class="tw-text-primary">required</span>:
``Boolean`` (Звездочка для показа, что поле является обязательным).

#### Slots

<span class="tw-text-primary">default</span>:
Передается блок поля ввода.

---

### UISwitchField

Компонент для форм с переключаемым ``Switch``.

#### Models

<span class="tw-text-primary">default</span>:
``Boolean`` (Значение кнопки switch).

#### Props

<span class="tw-text-primary">disabled</span>:
``Boolean`` (Отключить изменение значения).

---

## Base Components

Base Components имеют сложную логику могут производить сложные вычисления. находят в ``components/base`` и имеют приставку ``Base``, например ``BaseTable``.

---

### BaseTable

Компонент для создания готовой таблицы с фильтрами, пагинацией.

#### Models

<span class="tw-text-primary">page</span>:
``Number`` (Значение данной страницы).

<span class="tw-text-primary">filters</span>:
``Filter`` (Описание фильтров для автоматической подгрузки данных с сервера).

```
interface Filter {
  label: string,
  key: string,
  value: any,
  show?: boolean
  options?: (Options | string)[]
}

interface Options {
  title: string,
  props: {
    value: any
  }
}
```

#### Props

<span class="tw-text-primary">total</span>:
``Number`` (Количество элементов для пагинации).

<span class="tw-text-primary">items</span>:
``any[]`` (Элементы для таблицы).

<span class="tw-text-primary">perPage</span>:
``Number`` (Количество элементов на странице).

<span class="tw-text-primary">headers</span>:
``Header[]`` (Оглавления таблицы).

```
interface Header {
  label: string;
  code: string;
}
```

#### Emits

<span class="tw-text-primary">created</span>:
``(params: any) => void``

Функция для получения первых данных страницы. Вызывается при создании таблицы.

<span class="tw-text-primary">update</span>:
``(params: getData: () => void) => void``

Функция для обновления данных. getData функция для получения данных.

<span class="tw-text-primary">click-row</span>:
``(params: any) => void``

Функция, которая будет выполнена по нажатию на строку

#### Slots

<span class="tw-text-primary">default</span>:
Передаются данные в slot таблицы.

#### Expose

<span class="tw-text-primary">filter</span>:
Функция для обновления отфильтрованных данных с учетом пагинации

---

### BaseTreeTable

Компонент для создания готовой таблицы с вложенностью, с фильтрами и пагинацией.

#### Models

<span class="tw-text-primary">page</span>:
``Number`` (Значение данной страницы).

<span class="tw-text-primary">filters</span>:
``Filter`` (Описание фильтров для автоматической подгрузки данных с сервера).

```
interface Filter {
  label: string,
  key: string,
  value: any,
  show?: boolean
  options?: (Options | string)[]
}

interface Options {
  title: string,
  props: {
    value: any
  }
}
```

<span class="tw-text-primary">selectedKey</span>:
``String[]`` (Ключи элементов, которые открыты в таблице).

#### Props

<span class="tw-text-primary">total</span>:
``Number`` (Количество элементов для пагинации).

<span class="tw-text-primary">items</span>:
``any[]`` (Элементы для таблицы).

<span class="tw-text-primary">perPage</span>:
``Number`` (Количество элементов на странице).

<span class="tw-text-primary">headers</span>:
``Header[]`` (Оглавления таблицы).

```
interface Header {
  label: string;
  code: string;
}
```

#### Emits

<span class="tw-text-primary">created</span>:
``(params: any) => void``

Функция для получения первых данных страницы. Вызывается при создании таблицы.

<span class="tw-text-primary">update</span>:
``(params: getData: () => void) => void``

Функция для обновления данных. getData функция для получения данных.

<span class="tw-text-primary">click-row</span>:
``(params: any) => void``

Функция, которая будет выполнена по нажатию на строку

#### Slots

<span class="tw-text-primary">default</span>:
Передаются данные в slot таблицы.

#### Expose

<span class="tw-text-primary">filter</span>:
Функция для обновления отфильтрованных данных с учетом пагинации

---
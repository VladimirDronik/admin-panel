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

# Helpers Functions

Простые функции для решения мелких задач. Находятся в папке ``helpers``. Файл ``main.ts`` используется как общий файл для всех страниц.

## Main

### checkStatusColor

``(item: string | undefined) => string``

Функция получает данные от сервера поля ``status``.

Возвращает название цвета для использования в компонентах ``PrimeVue`` в параметре ``severity``.

### checkStatusText

``(item: string | undefined) => string``

Функция получает данные от сервера поля ``status``.

Возвращает читаемое имя статуса для человека.

### checkStatusTextSmall

``(item: string | undefined) => string``

Функция получает данные от сервера поля ``status``.

Возвращает короткое читаемое имя статуса для человека.

### checkStatusTextColor

``(item: string | undefined) => string``

Функция получает данные от сервера поля ``status``.

Возвращает класс, который меняет ``color``.

### checkStatusBackgroundColor

``(item: string | undefined) => string``

Функция получает данные от сервера поля ``status``.

Возвращает класс, который меняет ``background-color``.

## Devices

### getActionsTitle

``(type: string) => string``

Функция получает данные от сервера поля action ``type`` о типе действия в событии.

Возвращает читаемое имя действия для человека.

### getActionsColor

``(type: string, args: any) => string``

Функция получает данные от сервера поля action ``type`` о типе действия в событии  и ``args`` действия.

Возвращает название цвета для использования в компонентах ``PrimeVue`` в параметре ``severity``.

## Rooms

### roomColor

``(color: string) => string``

Функция получает данные от сервера ``color``.

Возвращает цвет помещения в ``hex`` формате.

### getRoomColorByValue

``(value: string) => color``

```
interface color {
  name: string,
  code: string,
  color: string,
}
```

Функция получает данные о значении value ``Select`` из библиотеки ``PrimeVue``.

Возвращает цвет value для корректного отображения в ``Select``.
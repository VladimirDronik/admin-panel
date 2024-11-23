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

# Composables

## Main

Основные composable функции, Утилиты.

### updateData

Функция для api запросов. При объявлении создавать ее с приставкой async

``(params: Params) => void``

```
interface Params {
  update: () => void,
  success?: ()=> void
  error?: ()=> void
  successMessage?: string
  errorMessage?: string
  disableSuccessMessage?: boolean
  disableErrorMessage?: boolean
}
```

<span class="tw-text-primary">update</span>:
Функция с асинхронными api запросами.

<span class="tw-text-primary">success</span>:
Функция, которая вызывается при успешном выполнении api запросов.

<span class="tw-text-primary">error</span>:
Функция, которая вызывается при ошибке выполнении api запросов.

<span class="tw-text-primary">successMessage</span>:
``String`` Сообщение для success окна уведомлений Toast.

<span class="tw-text-primary">errorMessage</span>:
``String`` Сообщение для error окна уведомлений Toast.

<span class="tw-text-primary">disableSuccessMessage</span>:
``Boolean`` Отключение success окна уведомлений Toast.

<span class="tw-text-primary">disableErrorMessage</span>:
``Boolean`` Отключение error окна уведомлений Toast.

## Api

### api

Сomposable функции для работы с api. Создан на основе axios.

При возвращении 401 статус кода (ошибка авторизации), возвращает на страницу авторизации


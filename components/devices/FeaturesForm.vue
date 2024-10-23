<script setup lang="ts">
const dialog = ref(false);
</script>

<template>
  <div>
    <div class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-px-4 tw-py-2">
      <div class="tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-lg tw-font-semibold">
          ON
        </p>
        <div class="tw-flex tw-items-center tw-justify-end">
          <v-btn
            @click="dialog = true"
            class="tw-mr-2"
            variant="text"
            size="small"
            prepend-icon="mdi-cog"
          >
            Настройка
          </v-btn>
          <v-switch hide-details color="primary" />
        </div>
      </div>
      <p class="tw-mb-2">
        Событие при включении
      </p>
      <p>
        <span class="text-primary tw-mr-2">
          Метод 1
        </span>
        <span class="text-warning tw-mr-2">
          Пауза 1
        </span>
        <span class="text-info tw-mr-2">
          Скрипт 1
        </span>
        <span class="text-error">
          Уведомление 1
        </span>
      </p>
    </div>
    <div class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-p-4">
      <div class="tw-mb-3 tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-lg tw-font-semibold">
          Toggle
        </p>
        <div class="tw-flex tw-items-center tw-justify-end">
          <v-btn color="primary" size="small" prepend-icon="mdi-plus">
            Добавить
          </v-btn>
        </div>
      </div>
      <p class="tw-mb-2">
        Событие при переключении
      </p>
      <p>
        Нет действий
      </p>
    </div>

    <DialogsDeviceFeaturesSettings v-model="dialog" />
  </div>
</template>

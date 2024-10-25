<script lang="ts" setup>

const storeDevices = useDevicesStore();

const dialog = defineModel({
  default: false,
});
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1000">
      <div class="tw-mb-1 tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-2xl tw-font-semibold">
          Выбор скрипта
        </p>
        <v-btn @click="dialog = false" icon size="small" variant="text">
          <XIcon class="white" />
        </v-btn>
      </div>
      <p class="tw-mb-7">
        Позволяет выбрать скрипт для выполнения
      </p>

      <div class="tw-min-h-60 tw-rounded tw-border">
        Script
      </div>

      <div class="tw-pt-4">
        <v-btn class="tw-mr-4" color="primary">
          Сохранить
        </v-btn>
        <v-btn color="primary" variant="outlined">
          Отменить
        </v-btn>
      </div>
    </BaseDialog>
  </div>
</template>

<script lang="ts" setup>

const storeDevices = useDevicesStore();

const dialog = defineModel({
  default: false,
});
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="550">
      <div class="tw-mb-1 tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-2xl tw-font-semibold">
          Добавление паузы
        </p>
        <v-btn @click="dialog = false" icon size="small" variant="text">
          <XIcon class="white" />
        </v-btn>
      </div>
      <p class="tw-mb-7">
        Позволяет добавить паузу при выполнении действий
      </p>

      <div>
        <p class="tw-mb-1.5  tw-text-lg tw-font-semibold">
          Секунд
        </p>
        <v-text-field type="number" />
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

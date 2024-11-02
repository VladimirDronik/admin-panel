<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const storeDevices = useDevicesStore();

const dialog = defineModel({
  default: false,
});
</script>

<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      :header="'Выбор скрипта'"
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissableMask
    >
      <p class="tw-mb-3">
        Позволяет выбрать скрипт для выполнения
      </p>

      <div class="tw-min-h-60 tw-rounded tw-border">
        Script
      </div>

      <div class="tw-pt-4">
        <Button class="tw-mr-2">
          {{ t('save') }}
        </Button>
        <Button variant="outlined" @click="dialog = false" outlined>
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

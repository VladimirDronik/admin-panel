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
      :header="'Добавление уведомления'"
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissableMask
    >
      <p class="tw-mb-7">
        Позволяет выбрать метод любого обьекта в системе
      </p>

      <div>
        Notifications
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

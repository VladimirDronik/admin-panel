<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const storeDevices = useDevicesStore();

const dialog = defineModel<boolean>({
  default: false,
});
</script>

<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="'Добавление уведомления'"
      modal
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
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
        <Button
          outlined
          variant="outlined"
          @click="dialog = false"
        >
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

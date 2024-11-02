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
      :header="'Добавление паузы'"
      :style="{
        'max-width': '550px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissableMask
    >
      <p class="tw-mb-3">
        Позволяет добавить паузу при выполнении действий
      </p>

      <SharedUILabel :title="'Секунд'" class="tw-mb-2">
        <InputText type="number" class="tw-w-full" />
      </SharedUILabel>

      <div class="tw-pt-3">
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

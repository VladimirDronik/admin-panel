<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const storeDevices = useDevicesStore();

const form = ref({
  name: '',
});

const loading = ref(false);

const dialog = defineModel({
  default: false,
});

const object = defineModel<any>('object', {
  default: false,
});

const event = defineModel<any>('event', {
  default: false,
});

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const createAction = async () => {
  loading.value = true;
  console.log(event.value);
  await storeDevices.createEventApi(event.value.target_type, event.value.id, event.value.name, {
    args: form.value,
    enabled: true,
    name: object.value.name,
    target_id: object.value.id,
    target_type: 'pause',
    type: 'pause',
    sort: 0,
    qos: 0,
  });
  loading.value = false;
};
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
        <InputText
          v-model="form.name"
          type="number"
          class="tw-w-full"
        />
      </SharedUILabel>

      <div class="tw-pt-3">
        <Button
          @click="createAction"
          :loading="loading"
          class="tw-mr-2"
        >
          {{ t('save') }}
        </Button>
        <Button
          variant="outlined"
          @click="dialog = false"
          outlined
        >
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

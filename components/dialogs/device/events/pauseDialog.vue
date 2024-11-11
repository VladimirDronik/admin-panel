<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const toast = useToast();

const storeDevices = useDevicesStore();

const form = ref({
  duration: '0',
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

const emit = defineEmits<{
  (e: 'updateActions'): void
}>();

const createAction = async () => {
  loading.value = true;
  try {
    await storeDevices.createEventApi(event.value.target_type, object.value.id, event.value.code, {
      args: {
        duration: `${Number(form.value.duration)}s`,
      },
      enabled: true,
      name: `${Number(form.value.duration)} секунд`,
      target_id: object.value.id,
      target_type: 'delay',
      type: 'delay',
      sort: 0,
      qos: 0,
    });
    emit('updateActions');
    toast.add({
      severity: 'success',
      summary: 'Действие успешно создано',
      life: 5000,
    });
    dialog.value = false;
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Ошибка добавления Паузы',
      life: 5000,
    });
  }
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
          v-model="form.duration"
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

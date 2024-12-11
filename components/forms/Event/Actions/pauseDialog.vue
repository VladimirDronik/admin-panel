<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
// Types Modules
import type { APIData } from '~/types/StoreTypes';
// Static Data modules
import { paths } from '~/utils/endpoints';
import type { Event } from '@/types/ModelEventTypes';

const { t } = useI18n();
const { updateData } = useUtils();

const dialog = defineModel({
  default: false,
});

const event = defineModel<Event>('event', {
  required: true,
});

const duration = ref('0');

const apiCreateMethod = ref<APIData<any>>();

const props = defineProps<{
  id?: number;
  edit: boolean;
  targetType: string;
}>();

const emit = defineEmits<{
  (e: 'updateActions'): void
}>();

const createAction = async () => {
  if (props.id) {
    await updateData({
      update: async () => {
        await apiCreateMethod.value?.execute();
        emit('updateActions');
      },
      success: () => {
        dialog.value = false;
      },
      successMessage: 'Пауза успешно сохранена',
      errorMessage: 'Ошибка добавления Паузы',
    });
  } else {
    event.value.actions.push({
      args: {
        duration: `${Number(duration.value)}s`,
      },
      enabled: true,
      name: `${Number(duration.value)} секунд`,
      target_id: props.id,
      target_type: 'delay',
      type: 'delay',
      sort: 0,
      qos: 0,
    });
    emit('updateActions');
    dialog.value = false;
  }
};

onBeforeMount(async () => {
  // Create Action
  const dataDevice: unknown = await useAPI(
    () => paths.eventsActions,
    {
      params: computed(() => ({
        target_type: props.targetType,
        target_id: props.id,
        event_name: event.value.code,
      })),
      body: computed(() => ({
        args: {
          duration: `${Number(duration.value)}s`,
        },
        enabled: true,
        name: `${Number(duration.value)} секунд`,
        target_id: props.id,
        target_type: 'delay',
        type: 'delay',
        sort: 0,
        qos: 0,
      })),
      method: 'POST',
      watch: false,
      immediate: false,
    },
  );
  apiCreateMethod.value = dataDevice as APIData<any>;
  //
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
        <InputText
          v-model="duration"
          type="number"
          class="tw-w-full"
        />
      </SharedUILabel>

      <div class="tw-pt-3">
        <Button
          @click="createAction"
          :loading="apiCreateMethod?.pending && apiCreateMethod.status !== 'idle'"
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

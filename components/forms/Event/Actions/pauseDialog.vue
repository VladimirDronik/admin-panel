<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
// Types Modules
import type { APIData } from '~/types/StoreTypes';
// Static Data modules
import { paths } from '~/utils/endpoints';
import type { Event } from '@/types/ModelEventTypes';

const { t } = useI18n();
const { updateData } = useUtils();

const dialog = defineModel<boolean>({
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
      dismissable-mask
      :header="'Добавление паузы'"
      modal
      :style="{
        'max-width': '550px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <p class="tw-mb-3">
        Позволяет добавить паузу при выполнении действий
      </p>

      <SharedUILabel
        class="tw-mb-2"
        :title="'Секунд'"
      >
        <InputText
          v-model="duration"
          class="tw-w-full"
          type="number"
        />
      </SharedUILabel>

      <div class="tw-pt-3">
        <Button
          class="tw-mr-2"
          :loading="apiCreateMethod?.pending && apiCreateMethod.status !== 'idle'"
          @click="createAction"
        >
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

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
// Types Modules
import type { APIData } from '~/types/StoreTypes';
// Static Data modules
import { paths } from '~/utils/endpoints';
import { type ScriptType } from '~/stores/script/scriptTypes';
import type { Event } from '@/types/ModelEventTypes';

const { t } = useI18n();
const { updateData } = useUtils();
const storeScript = useScriptStore();

const dialog = defineModel({
  default: false,
});

const event = defineModel<Event>('event', {
  required: true,
});

const props = defineProps<{
  id?: number;
  edit: boolean;
  targetType: string;
}>();

const emit = defineEmits<{
  (e: 'updateActions'): void
}>();

const apiCreateMethod = ref<APIData<any>>();

const deleteDialog = ref(false);

const selectedScript = ref<ScriptType | null>();

watch(dialog, () => {
  if (dialog.value) {
    selectedScript.value = null;
  }
});

const createAction = async () => {
  if (props.id) {
    updateData({
      update: async () => {
        await apiCreateMethod.value?.execute();
        emit('updateActions');
      },
      success: () => {
        dialog.value = false;
      },
      successMessage: 'Скрипт успешно добавлен',
      errorMessage: 'Ошибка добавления Скрипта',
    });
  } else {
    event.value.actions.push({
      args: selectedScript.value,
      enabled: true,
      name: selectedScript.value?.name,
      target_id: props.id,
      target_type: 'script',
      type: 'script',
      sort: 0,
      qos: 0,
    });
    emit('updateActions');
    dialog.value = false;
  }
};

const deleteScript = (script: ScriptType) => {
  selectedScript.value = script;
  deleteDialog.value = true;
};

storeScript.getScriptsApi({
  limit: 99,
});

const refScripts = computed(() => storeScript.scripts);

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
        args: selectedScript.value,
        enabled: true,
        name: selectedScript.value?.name,
        target_id: props.id,
        target_type: 'script',
        type: 'script',
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

      <div class="tw-min-h-60 tw-rounded tw-border tw-p-3">
        <div @click="selectedScript = script" @keydown="selectedScript = script" v-for="script in refScripts?.data?.response.list" :key="script.id" class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
          <div class="tw-text-left">
            <p :class="{ 'tw-text-green-500': selectedScript?.id === script.id }" class="tw-text-lg">
              {{ script.name }}
            </p>
            <p :class="{ 'tw-text-green-500': selectedScript?.id === script.id }" class="tw-text-sm">
              {{ script.description }}
            </p>
          </div>
          <div>
            <Button icon="pi pi-pencil" severity="info" rounded aria-label="Search" class="tw-mr-2" />
            <Button @click.stop="deleteScript(script)" icon="pi pi-trash" severity="danger" rounded aria-label="Cancel" />
          </div>
        </div>
      </div>

      <div class="tw-pt-4">
        <Button
          @click="createAction"
          :disabled="!selectedScript"
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

      <DialogsDeleteDialog
        :id="selectedScript?.id ?? -1"
        :showBtn="false"
        v-model="deleteDialog"
      />
    </Dialog>
  </div>
</template>

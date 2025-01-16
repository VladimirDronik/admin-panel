<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
// Static Data modules
import { paths } from '~/utils/endpoints';
// Types Modules
import type { Event } from '@/types/ModelEventTypes';
import type { APIData } from '~/types/StoreTypes';
import { type ScriptType } from '~/stores/script/scriptTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeScript = useScriptStore();

// Declare Options
const props = defineProps<{
  id?: number;
  edit: boolean;
  targetType: string;
}>();

const emit = defineEmits<{
  (e: 'updateActions'): void
}>();

const event = defineModel<Event>('event', {
  required: true,
});

const dialog = defineModel<boolean>({
  default: false,
});

// Variables
const deleteDialog = ref(false);

const selectedScript = ref<ScriptType | null>();

// Apis
const apiCreateMethod = ref<APIData<any>>();

// Computed Properties
const refScripts = computed(() => storeScript.scripts);

// Methods
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

// Watchers
watch(dialog, () => {
  if (dialog.value) {
    selectedScript.value = null;
  }
});

storeScript.getScriptsApi({
  limit: 99,
});

// Hooks
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
      dismissable-mask
      :header="'Выбор скрипта'"
      modal
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <p class="tw-mb-3">
        Позволяет выбрать скрипт для выполнения
      </p>

      <div class="tw-min-h-60 tw-rounded tw-border tw-p-3">
        <div
          v-for="script in refScripts?.data?.response.list"
          :key="script.id"
          class="tw-mb-2 tw-flex tw-cursor-pointer tw-items-center tw-justify-between"
          @click="selectedScript = script"
          @keydown="selectedScript = script"
        >
          <div class="tw-text-left">
            <p
              class="tw-text-lg"
              :class="{ 'tw-text-green-500': selectedScript?.id === script.id }"
            >
              {{ script.name }}
            </p>
            <p
              class="tw-text-sm"
              :class="{ 'tw-text-green-500': selectedScript?.id === script.id }"
            >
              {{ script.description }}
            </p>
          </div>
          <div>
            <Button
              aria-label="Search"
              class="tw-mr-2"
              icon="pi pi-pencil"
              rounded
              severity="info"
            />
            <Button
              aria-label="Cancel"
              icon="pi pi-trash"
              rounded
              severity="danger"
              @click.stop="deleteScript(script)"
            />
          </div>
        </div>
      </div>

      <div class="tw-pt-4">
        <Button
          class="tw-mr-2"
          :disabled="!selectedScript"
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

      <DialogsDeleteDialog
        :id="selectedScript?.id ?? -1"
        v-model="deleteDialog"
        :show-btn="false"
      />
    </Dialog>
  </div>
</template>

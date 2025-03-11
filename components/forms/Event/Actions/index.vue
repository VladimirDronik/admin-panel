<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Types and Schemes
import type { Event } from '@/types/ModelEventTypes';

// Composables
const { t } = useI18n();

// Declare Options
const props = defineProps<{
  id?: number,
  modelType: string,
  targetType: string,
  edit: boolean,
}>();

const emit = defineEmits<{
  (e: 'updateActions'): void
}>();

const dialog = defineModel<boolean>({
  default: false,
});

const event = defineModel<Event>('event', {
  required: true,
});

// Variables
const loading = ref(false);

const selectedId = ref(0);

const dialogs = ref({
  method: false,
  pause: false,
  script: false,
  notification: false,
  condition: false,
  delete: false,
});

// const editAction = ref(false);

await useChangeOrder();
const {
  deleteItem,
  statusDelete,
  confirmDelete,
} = await useDelete();

async function useDelete() {
  const {
    status: statusDelete,
    execute: executeDelete,
  } = await useAPI<any>(
    () => `${paths.eventsActions}/${selectedId.value}`,
    {
      method: 'DELETE',
      immediate: false,
      watch: false,
    },
  );

  const deleteItem = (id: number) => {
    selectedId.value = id;
    dialogs.value.delete = true;
  };

  const confirmDelete = async () => {
    await executeDelete();
    await updateActions();
  };

  return {
    deleteItem,
    statusDelete,
    confirmDelete,
  };
}

async function useChangeOrder() {
  const idList = computed(() => event.value?.actions?.map((item: any) => item.id));

  const {
    execute: executeChangeOrder,
  } = await useAPI<any>(
    () => paths.eventsActionsOrder,
    {
      body: idList,
      method: 'PUT',
      immediate: false,
      watch: false,
    },
  );

  // Watchers
  watch(idList, async (newValue, oldValue) => {
    if (!_.isEqual(oldValue, newValue) && props.id) {
      if (newValue?.length === oldValue?.length) {
        await executeChangeOrder();
        await updateActions();
      }
    }
  });
}

// Methods
const updateActions = () => {
  emit('updateActions');
};

const addCondition = () => {
  event.value.actions.push({
    enabled: true,
    target_id: props.id,
    target_type: 'condition',
    type: 'condition',
    sort: 0,
    qos: 0,
    actions: [],
    args: {
      isOpen: true,
    },
  });
};

// const openEdit = (event: any) => {
//   if (event.type === 'method') dialogMethod.value = true;
//   if (event.type === 'pause') dialogPause.value = true;
//   if (event.type === 'script') dialogScript.value = true;
//   if (event.type === 'notification') dialogNotification.value = true;
//   editAction.value = true;
// };

</script>

<template>
  <div v-if="event">
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="event.name"
      modal
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
      :width="1000"
    >
      <p class="tw-mb-3">
        {{ event.description }}
      </p>

      <SharedUILoader :update="loading">
        <div class="tw-mb-6 tw-flex tw-items-center">
          <Button
            class="tw-mr-4"
            icon="pi pi-plus"
            label="Метод"
            outlined
            @click="dialogs.method = true"
          />
          <Button
            class="tw-mr-4"
            icon="pi pi-plus"
            label="Пауза"
            outlined
            severity="warn"
            @click="dialogs.pause = true"
          />
          <Button
            class="tw-mr-4"
            icon="pi pi-plus"
            label="Скрипт"
            outlined
            severity="info"
            @click="dialogs.script = true"
          />
          <Button
            class="tw-mr-4"
            icon="pi pi-plus"
            label="Уведомление"
            outlined
            severity="danger"
            @click="dialogs.notification = true"
          />
          <Button
            icon="pi pi-plus"
            label="Сценарии"
            outlined
            severity="secondary"
            @click="dialogs.condition = true"
          />
        </div>

        <FormsEventActionsDialogMethod
          :id="id"
          v-model="dialogs.method"
          v-model:event="event"
          :edit="edit"
          :target-type="targetType"
          @update-actions="updateActions"
        />
        <FormsEventActionsDialogPause
          :id="id"
          v-model="dialogs.pause"
          v-model:event="event"
          :edit="edit"
          :target-type="targetType"
          @update-actions="updateActions"
        />
        <FormsEventActionsDialogScript
          :id="id"
          v-model="dialogs.script"
          v-model:event="event"
          :edit="edit"
          :target-type="targetType"
          @update-actions="updateActions"
        />
        <FormsEventActionsDialogNotification v-model="dialogs.notification" />
        <FormsEventActionsDialogCondition
          :id="id"
          v-model="dialogs.condition"
          v-model:event="event"
          :edit="edit"
          :target-type="targetType"
          @update-actions="updateActions"
        />
        <div>
          <FormsEventActionsListItem
            v-if="event.actions?.length"
            :items="event.actions"
            @delete="deleteItem"
          />
          <div v-else>
            Список событий пуст
          </div>
          <div class="tw-flex tw-justify-between tw-pt-3">
            <DialogNodeRed />
            <Button
              :label="t('save')"
              @click="dialog = false"
            />
          </div>
        </div>

        <DialogDelete
          :id="selectedId"
          v-model="dialogs.delete"
          :loading="statusDelete === 'pending'"
          :show-btn="false"
          @delete="confirmDelete"
        />
      </SharedUILoader>
    </Dialog>
  </div>
</template>

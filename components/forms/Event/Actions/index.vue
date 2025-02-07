<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Types and Schemes
import type { APIData } from '~/types/StoreTypes';
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

const dialogMethod = ref(false);
const dialogPause = ref(false);
const dialogScript = ref(false);
const dialogNotification = ref(false);
const dialogCondition = ref(false);

const dialogDelete = ref(false);

const selectedId = ref(0);

const editAction = ref(false);

// Apis
const apiOrderMethods = ref<APIData<any>>();
const apiDeleteMethods = ref<APIData<any>>();

// Computed Properties
const idList = computed(() => event.value?.actions?.map((item: any) => item.id));

// Methods
const updateActions = () => {
  emit('updateActions');
};

const deleteItem = (id: number) => {
  selectedId.value = id;
  dialogDelete.value = true;
};

const confirmDelete = async () => {
  await apiDeleteMethods.value?.execute();
  await updateActions();
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

const openEdit = (event: any) => {
  if (event.type === 'method') dialogMethod.value = true;
  if (event.type === 'pause') dialogPause.value = true;
  if (event.type === 'script') dialogScript.value = true;
  if (event.type === 'notification') dialogNotification.value = true;
  editAction.value = true;
};

// Watchers
watch(idList, async (newValue, oldValue) => {
  if (!_.isEqual(oldValue, newValue) && props.id) {
    if (newValue?.length === oldValue?.length) {
      await apiOrderMethods.value?.execute();
      await updateActions();
    }
  }
});

// Hooks
onBeforeMount(async () => {
  // Create Action
  const dataCreateDevice: unknown = await useAPI(
    () => paths.eventsActionsOrder,
    {
      body: idList,
      method: 'PUT',
      immediate: false,
      watch: false,
    },
  );
  apiOrderMethods.value = dataCreateDevice as APIData<any>;
  //

  // Delete Action
  const dataDeleteDevice: unknown = await useAPI(
    () => `${paths.eventsActions}/${selectedId.value}`,
    {
      body: idList,
      method: 'DELETE',
      immediate: false,
      watch: false,
    },
  );
  apiDeleteMethods.value = dataDeleteDevice as APIData<any>;
  //
});
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
            @click="dialogMethod = true"
          />
          <Button
            class="tw-mr-4"
            icon="pi pi-plus"
            label="Пауза"
            outlined
            severity="warn"
            @click="dialogPause = true"
          />
          <Button
            class="tw-mr-4"
            icon="pi pi-plus"
            label="Скрипт"
            outlined
            severity="info"
            @click="dialogScript = true"
          />
          <Button
            class="tw-mr-4"
            icon="pi pi-plus"
            label="Уведомление"
            outlined
            severity="danger"
            @click="dialogNotification = true"
          />
          <Button
            icon="pi pi-plus"
            label="Условия"
            outlined
            severity="secondary"
            @click="dialogCondition = true"
          />
        </div>

        <FormsEventActionsMethodDialog
          :id="id"
          v-model="dialogMethod"
          v-model:event="event"
          :edit="edit"
          :target-type="targetType"
          @update-actions="updateActions"
        />
        <FormsEventActionsPauseDialog
          :id="id"
          v-model="dialogPause"
          v-model:event="event"
          :edit="edit"
          :target-type="targetType"
          @update-actions="updateActions"
        />
        <FormsEventActionsScriptDialog
          :id="id"
          v-model="dialogScript"
          v-model:event="event"
          :edit="edit"
          :target-type="targetType"
          @update-actions="updateActions"
        />
        <FormsEventActionsNotificationDialog
          v-model="dialogNotification"
        />
        <FormsEventActionsConditionDialog
          :id="id"
          v-model="dialogCondition"
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
          <div class="tw-flex tw-justify-end tw-pt-3">
            <Button
              :label="t('save')"
              @click="dialog = false"
            />
          </div>
        </div>

        <DialogDelete
          :id="selectedId"
          v-model="dialogDelete"
          :loading="apiDeleteMethods?.pending && apiDeleteMethods.status !== 'idle'"
          :show-btn="false"
          @delete="confirmDelete"
        />
      </SharedUILoader>
    </Dialog>
  </div>
</template>

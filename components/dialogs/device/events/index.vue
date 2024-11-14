<script lang="ts" setup>
import _ from 'lodash';
import { VueDraggableNext } from 'vue-draggable-next';
import { getActionsColor, getActionsTitle } from '~/helpers/devices';

const storeDevice = useDevicesStore();

const dialog = defineModel({
  default: false,
});

const selectedObject = defineModel<any>('object', {
  required: true,
});

const form = defineModel<any>('form', {
  required: true,
});

defineProps({
  edit: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'updateActions'): void
}>();

const updateActions = () => {
  emit('updateActions');
};

const actionsList = ref<any[]>([]);

const loading = ref(false);

// const updateActions = async () => {
//   loading.value = true;
//   if (form.value) {
//     const data: any = await $fetch('http://10.35.16.1:8083/events/actions', {
//       params: {
//         target_id: selectedObject.value.id,
//         target_type: form.value.target_type,
//       },
//     });
//     actionsList.value = data.data[form.value.code];
//   }
//   loading.value = true;
// };

// watch(form, updateActions, { immediate: true });

const dialogMethod = ref(false);
const dialogPause = ref(false);
const dialogScript = ref(false);
const dialogNotification = ref(false);

const dialogDelete = ref(false);
const loadingDelete = ref(false);

const selectedId = ref(0);

const editAction = ref(false);

const deleteItem = (id: number) => {
  selectedId.value = id;
  dialogDelete.value = true;
};

const confirmDelete = async (id: number) => {
  loadingDelete.value = true;
  await storeDevice.deleteActionApi(id);
  await updateActions();
  loadingDelete.value = true;
};

watch(actionsList, async (newValue, oldValue) => {
  if (!_.isEqual(oldValue, newValue)) {
    if (oldValue && form.value) {
      const params = form.value?.actions?.map((item: any) => item.id);
      await storeDevice.changeActionOrderApi(params);
      await updateActions();
    }
  }
});

const openEdit = (event: any) => {
  if (event.type === 'method') dialogMethod.value = true;
  if (event.type === 'pause') dialogPause.value = true;
  if (event.type === 'script') dialogScript.value = true;
  if (event.type === 'notification') dialogNotification.value = true;
  editAction.value = true;
};
</script>

<template>
  <div v-if="form">

    <Dialog
      v-model:visible="dialog"
      :header="form.name"
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissableMask
      :width="1000"
    >
      <p class="tw-mb-3">
        {{ form.description }}
      </p>

      <BaseLoader :update="loading">
        <div class="tw-mb-6 tw-flex tw-items-center">
          <Button
            @click="dialogMethod = true"
            class="tw-mr-4"
            outlined
            label="Метод"
            icon="pi pi-plus"
          />
          <Button
            @click="dialogPause = true"
            label="Пауза"
            icon="pi pi-plus"
            severity="warn"
            class="tw-mr-4"
            outlined
          />
          <Button
            @click="dialogScript = true"
            label="Скрипт"
            icon="pi pi-plus"
            severity="info"
            class="tw-mr-4"
            outlined
          />
          <Button
            @click="dialogNotification = true"
            label="Уведомление"
            icon="pi pi-plus"
            severity="danger"
            outlined
          />
        </div>

        <DialogsDeviceEventsMethodDialog
          @update-actions="updateActions"
          v-model="dialogMethod"
          :edit="edit"
          v-model:object="selectedObject"
          v-model:event="form"
        />
        <DialogsDeviceEventsPauseDialog
          @update-actions="updateActions"
          v-model="dialogPause"
          :edit="editAction"
          v-model:object="selectedObject"
          v-model:event="form"
        />
        <DialogsDeviceEventsScriptDialog
          @update-actions="updateActions"
          v-model="dialogScript"
          :edit="editAction"
          v-model:object="selectedObject"
          v-model:event="form"
        />
        <DialogsDeviceEventsNotificationDialog
          v-model="dialogNotification"
        />

        <div v-if="storeDevice.item">
          <VueDraggableNext
            v-model="actionsList"
            handle=".handle-item"
            :animation="300"
          >
            <div
              v-for="event in form.actions"
              :key="event.id"
              @click="openEdit(event)"
              @keydown="openEdit(event)"
              class="tw-rounded tw-border-x tw-border-t [&:last-child]:tw-border-b"
            >
              <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-2">
                <div class="tw-mr-4 tw-flex tw-items-center tw-justify-between">
                  <Tag
                    :value="getActionsTitle(event.type, event.args)"
                    :severity="getActionsColor(event.type)"
                    class="tw-mr-3 !tw-w-32"
                  />
                  <p v-if="event.type === 'delay'">
                    {{ event.name ? event.name : '-'}}
                  </p>
                  <p v-else-if="event.type === 'script'">
                    {{ event.args.name ? event.args.name : '-'}}
                  </p>
                  <p v-else>
                    {{ event.args.description ? event.args.description : '-'}}
                  </p>
                </div>
                <div class="tw-flex tw-items-center">
                  <Button
                    @click.stop="deleteItem(event.id)"
                    class="tw-mr-2"
                    icon="pi pi-trash"
                    aria-label="Cancel"
                    text
                    rounded
                  />
                  <GripVerticalIcon class="handle-item tw-w-5 tw-cursor-pointer" />
                </div>
              </div>
            </div>
          </VueDraggableNext>
          <div v-if="!form.actions?.length">
            Список событий пуст
          </div>
        </div>

        <DialogsDeleteDialog
          @delete="confirmDelete"
          v-model="dialogDelete"
          :id="selectedId"
          :showBtn="false"
          :loading="loadingDelete"
        />

        <!-- <div class="tw-pt-4">
          <Button class="tw-mr-4">
            Сохранить
          </Button>
          <Button outlined>
            Отменить
          </Button>
        </div> -->
      </BaseLoader>
    </Dialog>
  </div>
</template>

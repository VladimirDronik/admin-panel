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
  loadingDelete.value = true;
};

const eventsList = computed(() => {
  if (form.value?.actions) {
    return Object.values(form.value?.actions);
  }
  return form.value;
});

watch(eventsList, (_newValue, oldValue) => {
  if (oldValue && form.value) {
    const params = form.value?.actions[form.value?.code]?.map((item: any) => item.id);
    storeDevice.changeActionOrderApi(params);
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

      <div class="tw-mb-6 tw-flex tw-items-center">
        <Button
          @click="dialogMethod = true"
          prepend-icon="mdi-plus"
          class="tw-mr-4"
          outlined
        >
          Метод
        </Button>
        <Button
          @click="dialogPause = true"
          prepend-icon="mdi-plus"
          severity="warn"
          class="tw-mr-4"
          outlined
        >
          Пауза
        </Button>
        <Button
          @click="dialogScript = true"
          prepend-icon="mdi-plus"
          severity="info"
          class="tw-mr-4"
          outlined
        >
          Скрипт
        </Button>
        <Button
          @click="dialogNotification = true"
          prepend-icon="mdi-plus"
          severity="danger"
          outlined
        >
          Уведомление
        </Button>
      </div>

      <DialogsDeviceEventsMethodDialog
        v-model="dialogMethod"
        :edit="edit"
        v-model:object="selectedObject"
        v-model:event="form"
      />
      <DialogsDeviceEventsPauseDialog
        v-model="dialogPause"
        :edit="editAction"
        v-model:object="selectedObject"
        v-model:event="form"
      />
      <DialogsDeviceEventsScriptDialog
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
          v-model="form.actions[form.code]"
          handle=".handle-item"
          :animation="300"
        >
          <div
            v-for="event in form.actions[form.code]"
            :key="event.id"
            @click="openEdit(event)"
            @keydown="openEdit(event)"
            class="tw-rounded tw-border-x tw-border-t [&:last-child]:tw-border-b"
          >
            <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-2">
              <div class="tw-mr-4 tw-flex tw-items-center tw-justify-between">
                <Tag
                  :value="getActionsTitle(event.type)"
                  :severity="getActionsColor(event.type)"
                  class="tw-mr-3 !tw-w-32"
                />
                <p>
                  {{ event.name ? event.name : '-'}}
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
        <div v-if="!form?.actions[form.code]?.length">
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

      <div class="tw-pt-4">
        <Button class="tw-mr-4">
          Сохранить
        </Button>
        <Button outlined>
          Отменить
        </Button>
      </div>
    </Dialog>
  </div>
</template>

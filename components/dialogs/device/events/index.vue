<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next';

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

</script>

<template>
  <div>
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

      <DialogsDeviceEventsMethodDialog v-model="dialogMethod" v-model:object="selectedObject" />
      <DialogsDeviceEventsPauseDialog v-model="dialogPause" v-model:object="selectedObject" />
      <DialogsDeviceEventsScriptDialog v-model="dialogScript" v-model:object="selectedObject" />
      <DialogsDeviceEventsNotificationDialog v-model="dialogNotification" />

      <div v-if="storeDevice.item">
        <VueDraggableNext v-model="form.actions" handle=".handle-item" :animation="300">
          <div v-for="event in form.actions[form.code]" :key="event.id" class="tw-rounded tw-border-x tw-border-t [&:last-child]:tw-border-b">
            <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-3">
              <div class="tw-mr-4 tw-flex tw-items-center tw-justify-between">
                <Tag value="Метод On" class="tw-mr-3" />
                <p>
                  {{ event.name }}
                </p>
              </div>
              <div class="tw-flex tw-items-center">
                <Button class="tw-mr-2" icon="pi pi-trash" severity="secondary" rounded aria-label="Cancel" />
                <GripVerticalIcon class="handle-item tw-w-5 tw-cursor-pointer" />
              </div>
            </div>
          </div>
        </VueDraggableNext>
        <div v-if="!form.actions.length">
          Список событий пуст
        </div>
      </div>

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

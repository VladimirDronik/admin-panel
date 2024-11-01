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
    <BaseDialog v-model="dialog" :width="1000">
      <div class="tw-mb-1 tw-flex tw-items-center tw-justify-between">
        <p class="tw-text-2xl tw-font-semibold">
          {{ form.name }}
        </p>
        <v-btn @click="dialog = false" icon size="small" variant="text">
          <XIcon class="white" />
        </v-btn>
      </div>
      <p class="tw-mb-7">
        {{ form.description }}
      </p>

      <div class="tw-mb-6 tw-flex tw-items-center">
        <v-btn
          @click="dialogMethod = true"
          prepend-icon="mdi-plus"
          color="success"
          variant="outlined"
          class="tw-mr-4"
        >
          Метод
        </v-btn>
        <v-btn
          @click="dialogPause = true"
          prepend-icon="mdi-plus"
          color="warning"
          variant="outlined"
          class="tw-mr-4"
        >
          Пауза
        </v-btn>
        <v-btn
          @click="dialogScript = true"
          prepend-icon="mdi-plus"
          color="info"
          variant="outlined"
          class="tw-mr-4"
        >
          Скрипт
        </v-btn>
        <v-btn
          @click="dialogNotification = true"
          prepend-icon="mdi-plus"
          color="error"
          variant="outlined"
        >
          Уведомление
        </v-btn>
      </div>

      <DialogsDeviceFeaturesMethodDialog v-model="dialogMethod" />
      <DialogsDeviceFeaturesPauseDialog v-model="dialogPause" />
      <DialogsDeviceFeaturesScriptDialog v-model="dialogScript" />
      <DialogsDeviceFeaturesNotificationDialog v-model="dialogNotification" />

      <div v-if="storeDevice.item">
        <VueDraggableNext v-model="form.actions" handle=".handle-item" :animation="300">
          <div v-for="event in form.actions" :key="event.code" class="tw-rounded tw-border-x tw-border-t [&:last-child]:tw-border-b">
            <div class="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-3">
              <div class="tw-mr-4 tw-flex tw-items-center tw-justify-between">
                <v-chip class="tw-mr-3" color="success" variant="flat">
                  Метод On
                </v-chip>
                <p>
                  {{ event.name }}
                </p>
              </div>
              <div class="tw-flex tw-items-center">
                <v-btn class="tw-mr-2" icon variant="text" size="x-small">
                  <TrashIcon class="handle-item tw-w-5" />
                </v-btn>
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
        <v-btn class="tw-mr-4" color="primary">
          Сохранить
        </v-btn>
        <v-btn color="primary" variant="outlined">
          Отменить
        </v-btn>
      </div>
    </BaseDialog>
  </div>
</template>

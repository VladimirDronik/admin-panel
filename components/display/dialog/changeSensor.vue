<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Types and Schemes modules
import type { Request } from '~/types/StoreTypes';
import type { roomSensorTypes } from '~/types/DisplayTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeUser = useUserStore();

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const { sensors } = defineProps<{
  sensors: roomSensorTypes[] | undefined,
}>();

const dialog = defineModel<boolean>({
  default: false,
});

const selectedSensor = ref<roomSensorTypes>();

const selectSensor = (sensor: roomSensorTypes) => {
  selectedSensor.value = sensor;
  dialog.value = true;
};

const {
  form,
  changeSensor,
  statusChangeItem,
} = await useChangeItem();

const {
  dialogDelete,
  statusDeleteSensor,
  confirmDelete,
} = await useDeleteItem();

async function useDeleteItem() {
  const {
    status: statusDeleteSensor,
    execute: executeDeleteSensor,
  } = await useAPI<Request<any>>(paths.privateItemsSensor, {
    query: computed(() => ({
      id: selectedSensor.value?.item_id,
    })),
    method: 'DELETE',
    immediate: false,
  });

  const dialogDelete = ref(false);

  const confirmDelete = async () => {
    await updateData({
      update: async () => {
        await executeDeleteSensor();
        await emit('update');
      },
      success: () => {
        dialogDelete.value = false;
        dialog.value = false;
        emit('update');
      },
      successMessage: 'Устройство удалено',
      errorMessage: 'Ошибка удаления устройства',
    });
  };

  return {
    dialogDelete,
    statusDeleteSensor,
    confirmDelete,
  };
}

async function useChangeItem() {
  const {
    status: statusChangeItem,
    execute: executeChangeItem,
  } = await useAPI<Request<any>>(paths.privateSensor, {
    query: computed(() => ({
      itemId: selectedSensor.value?.item_id,
    })),
    immediate: false,
  });

  const form = ref({
    min: '',
    max: '',
  });

  const changeSensor = async () => {
  };

  return {
    form,
    changeSensor,
    statusChangeItem,
  };
}
</script>

<template>
  <div class="tw-flex tw-items-center">
    <button
      v-for="sensor in sensors"
      :key="sensor.item_id"
      class="tw-mr-2 tw-flex tw-items-center"
      type="button"
      @click="selectSensor(sensor)"
    >
      <img
        alt=""
        class="tw-mr-0.5 tw-w-4"
        :class="{
          'tw-invert': storeUser.isDark,
        }"
        :src="`items/${sensor.icon}.png`"
      >
      {{ sensor.current }}
      <span v-if="sensor.type === 'temperature'">
        °
      </span>
      <span v-else-if="sensor.type === 'humidity'">
        %
      </span>
    </button>
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="'Изменить параметра датчика на панель управления'"
      modal
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <div
        v-if="selectedSensor"
        class="tw-mb-3"
      >
        <div>
          <p class="tw-mb-4 tw-text-xl">
            Текущее значение: {{ selectedSensor.name ? selectedSensor.name : '-' }}
            <span v-if="selectedSensor.type === 'temperature'">
              °
            </span>
            <span v-else-if="selectedSensor.type === 'humidity'">
              %
            </span>
          </p>
          <div class="tw-mb-5">
            <SharedUILabel
              class="tw-mb-2"
              colomn
              required
              :title="'Минимальное значение'"
            >
              <InputText
                v-model="form.min"
                class="tw-w-full"
              />
            </SharedUILabel>
            <SharedUILabel
              colomn
              required
              :title="'Максимальное значение'"
            >
              <InputText
                v-model="form.max"
                class="tw-w-full"
              />
            </SharedUILabel>
          </div>
        </div>
      </div>

      <div class="tw-flex tw-justify-end">
        <Button
          class="tw-mr-2"
          :label="t('save')"
          :loading="statusChangeItem === 'pending'"
          @click="changeSensor"
        />
        <DialogDelete
          v-if="selectedSensor?.item_id"
          :id="selectedSensor.item_id ?? -1"
          v-model="dialogDelete"
          class="tw-mr-2"
          :loading="statusDeleteSensor === 'pending'"
          :subtitle="`Вы уверены, что хотите удалить «${selectedSensor.name}»?`"
          title="Удалить устройство"
          @delete="confirmDelete"
        />
      </div>
    </Dialog>
  </div>
</template>

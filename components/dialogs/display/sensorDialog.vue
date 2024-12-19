<script setup lang="ts">
import { useI18n } from 'vue-i18n';
// Static data modules
import type { roomSensorTypes } from '~/types/DisplayTypes';

const { t } = useI18n();

const dialog = defineModel({
  default: false,
});

defineProps<{
  sensors: roomSensorTypes[] | undefined,
}>();

// Methods
const createRoom = async () => {
};

const form = ref({
  name: '',
  color: null,
});

const selectedSensor = ref<string>();
const selectedParamSensor = ref<string>();

const selectSensor = (sensor: string) => {
  selectedSensor.value = sensor;
};
const selectParamSensor = (param: string) => {
  selectedSensor.value = param;
};

const checked = ref(false);
</script>

<template>
  <div>
    <Button
      @click="dialog = true"
      class="tw-aspect-square tw-w-8"
      outlined
      icon="pi pi-plus"
      size="small"
    />
    <Dialog
      v-model:visible="dialog"
      :header="'Добавление датчика на панель управления'"
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissableMask
    >

      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h5 class="tw-text-lg">
          Доступные Датчики
        </h5>

        <div class="tw-flex tw-items-center tw-gap-2">
          <label for="ingredient1">
            Все
          </label>
          <Checkbox v-model="checked" binary name="Все" />
        </div>
      </div>
      <div class="tw-mb-3 tw-grid tw-grid-cols-2 tw-grid-rows-1 tw-gap-2">
        <div class="tw-h-full">
          <div class="tw-h-full tw-rounded-md tw-border tw-p-3">
            <button
              v-for="sensor in sensors"
              @click="selectSensor(sensor.type)"
              :key="sensor.id"
              type="button"
              class="tw-flex tw-w-full tw-items-center tw-py-1"
            >
              <div class="tw-flex tw-items-center">
                <img
                  :src="`scenario_items/${sensor.icon}.png`"
                  alt=""
                  class="tw-mr-1"
                >
                {{ sensor.type }}
              </div>
            </button>
          </div>
        </div>
        <div>
          <div class="tw-mb-4 tw-rounded-md tw-border tw-p-3">
            <button
              v-for="sensor in sensors"
              @click="selectSensor(sensor.type)"
              :key="sensor.id"
              type="button"
              class="tw-flex tw-w-full tw-items-center tw-py-1"
            >
              <div class="tw-flex tw-items-center">
                <img
                  :src="`scenario_items/${sensor.icon}.png`"
                  alt=""
                  class="tw-mr-1"
                >
                {{ sensor.type }}
              </div>
            </button>
          </div>
          <p class="tw-mb-4 tw-text-xl">
            Текущее значение: -
          </p>
          <div class="tw-mb-5">
            <SharedUILabel
              :title="'Минимальное значение'"
              class="tw-mb-2"
              colomn
              required
            >
              <InputText v-model="form.name" class="tw-w-full" />
            </SharedUILabel>
            <SharedUILabel
              :title="'Максимальное значение'"
              colomn
              required
            >
              <InputText v-model="form.name" class="tw-w-full" />
            </SharedUILabel>
          </div>
          <div class="tw-flex tw-items-center tw-gap-2">
            <Checkbox v-model="checked" binary />
            <label for="ingredient1">
              Регулировка
            </label>
          </div>
        </div>
      </div>

      <div class="tw-flex tw-justify-end">
        <Button class="tw-mr-2" @click="createRoom">
          {{ t('save') }}
        </Button>
        <Button variant="outlined" @click="dialog = false" outlined>
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Static data modules
import { paths } from '~/utils/endpoints';
// Types and Schemes modules
import type { APIData } from '~/types/StoreTypes';
import type { roomSensorTypes } from '~/types/DisplayTypes';

// Composables
const { t } = useI18n();

// Declare Options
const props = defineProps<{
  sensors: roomSensorTypes[] | undefined,
}>();

const dialog = defineModel<boolean>({
  default: false,
});

// Variables
const isAllSensors = ref(false);
const isRegulator = ref(false);

const selectedSensor = ref<string>();
const selectedParamSensor = ref<string>();

const apiGetSensor = ref<APIData<any>>();
const apiGetModel = ref<APIData<any>>();

const form = ref({
  min: '',
  max: '',
});

const allSensor = [
  'co2',
  'humidity',
  'pressure',
  'temperature',
  'illumination',
];

// Computed Properties
const sensorList = computed(() => {
  if (isAllSensors.value) {
    return allSensor;
  }
  return _.uniq(props.sensors?.map((item) => item.type));
});

// Methods
const selectSensor = (sensor: string) => {
  selectedSensor.value = sensor;
  selectedParamSensor.value = undefined;
};
const selectParamSensor = (param: string) => {
  selectedParamSensor.value = param;
};

const createRoom = async () => {
};

const selectedModelSensor = computed(() => apiGetModel.value?.data?.response.children.find((item: any) => item.type === selectedSensor.value)?.props);

// Watchers
watch(selectedModelSensor, () => {
  if (!selectedParamSensor.value) {
    form.value.min = '';
    form.value.max = '';
    return;
  }
  form.value.min = selectedModelSensor.value?.min_threshold?.value ?? '';
  form.value.max = selectedModelSensor.value?.max_threshold?.value ?? '';
}, {
  immediate: false,
});

// Hooks
onBeforeMount(async () => {
  // Get Sensor
  const dataGetSensor: unknown = await useAPI(paths.objectsTypes, {
    query: computed(() => ({
      tags: selectedSensor.value,
    })),
    immediate: false,
  });

  apiGetSensor.value = dataGetSensor as APIData<any>;

  // Get Model
  const dataGetModel: unknown = await useAPI(paths.objectModel, {
    query: computed(() => ({
      category: 'sensor',
      type: selectedParamSensor.value,
    })),
    immediate: false,
  });

  apiGetModel.value = dataGetModel as APIData<any>;
});
</script>

<template>
  <div>
    <Button
      class="tw-aspect-square tw-w-8"
      icon="pi pi-plus"
      outlined
      size="small"
      @click="dialog = true"
    />
    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="'Добавление параметра датчика на панель управления'"
      modal
      :style="{
        'max-width': '1000px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h5 class="tw-text-lg">
          Доступные Датчики
        </h5>

        <div class="tw-flex tw-items-center tw-gap-2">
          <label for="ingredient1">
            Все
          </label>
          <Checkbox
            v-model="isAllSensors"
            binary
            name="Все"
          />
        </div>
      </div>
      <div class="tw-mb-3 tw-grid tw-grid-cols-2 tw-grid-rows-1 tw-gap-2">
        <div class="tw-h-full">
          <div class="tw-h-full tw-rounded-md tw-border tw-p-3">
            {{ isAllSensors }}
            <InputText
              class="tw-mb-2 tw-w-full"
            />
            <button
              v-for="sensor in sensorList"
              :key="sensor"
              class="tw-flex tw-w-full tw-items-center tw-py-1"
              type="button"
              @click="selectSensor(sensor)"
            >
              <div class="tw-flex tw-items-center">
                -
                {{ sensor }}
              </div>
            </button>
          </div>
        </div>
        <div>
          <div class="tw-mb-4 tw-rounded-md tw-border tw-p-3">
            <button
              v-for="sensor in apiGetSensor?.data?.response"
              :key="sensor.id"
              class="tw-flex tw-w-full tw-items-center tw-py-1"
              type="button"
              @click="selectParamSensor(sensor.type)"
            >
              <div class="tw-flex tw-items-center">
                -
                {{ sensor.type }}
              </div>
            </button>
          </div>
          <p class="tw-mb-4 tw-text-xl">
            Текущее значение: {{ selectedParamSensor ? selectedModelSensor?.value?.value : '-' }}
            <span v-if="selectedSensor === 'temperature'">
              °
            </span>
            <span v-else-if="selectedSensor === 'humidity'">
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
          <div class="tw-flex tw-items-center tw-gap-2">
            <Checkbox
              v-model="isRegulator"
              binary
            />
            <label for="ingredient1">
              Регулировка
            </label>
          </div>
        </div>
      </div>

      <div class="tw-flex tw-justify-end">
        <Button
          class="tw-mr-2"
          @click="createRoom"
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
    </Dialog>
  </div>
</template>

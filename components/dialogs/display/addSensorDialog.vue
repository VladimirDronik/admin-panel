<script setup lang="ts">
// Builtin modules
import _, { method } from 'lodash';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// Static data modules
import { paths } from '~/utils/endpoints';
// Types and Schemes modules
import type { APIData } from '~/types/StoreTypes';
import type { roomSensorTypes } from '~/types/DisplayTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeUser = useUserStore();

// Declare Options
const props = defineProps<{
  sensors: roomSensorTypes[] | undefined,
  zoneId: number,
}>();

const emit = defineEmits<{
  (e: 'update'): void
}>();

const dialog = defineModel<boolean>({
  default: false,
});

// Variables
const isAllSensors = ref(false);

const filter = ref('');

const selectedSensor = ref<string>();
const selectedParamSensor = ref<string>();

// Apis
const apiGetSensor = ref<APIData<any>>();
const apiGetSensorType = ref<APIData<any>>();
const apiCreateSensor = ref<APIData<any>>();

const form = ref<{
  name: string | null,
  zone_id: number | null,
  icon: string | null,
  object_id: number | null,
  type: string | null,
}>({
  name: null,
  zone_id: null,
  icon: null,
  object_id: null,
  type: null,
});

const resolver = ref(zodResolver(
  z.object({
    name: z.string().min(1),
    zone_id: z.number(),
    object_id: z.number(),
    type: z.string().min(1),
  }),
));

const allSensor = [
  'co2',
  'humidity',
  'pressure',
  'temperature',
  'illumination',
];

// Computed Properties
const filteredSensorList = computed(() => apiGetSensor?.value?.data?.response.list.filter((item: any) => item.name.toLowerCase().includes(filter.value.toLowerCase())));

// Methods
const selectSensor = (sensor: string, id: number) => {
  form.value.object_id = id
  selectedSensor.value = sensor;
  form.value.type = null;
};

const selectParamSensor = (type: string) => {
  form.value.type = type;
};

const createSensor = async () => {
  await updateData({
    update: async () => {
      await apiCreateSensor.value?.execute();
      await emit('update');
    },
    success: () => {
      form.value = {
        name: null,
        zone_id: null,
        icon: null,
        object_id: null,
        type: null,
      };
      dialog.value = false;
    },
    successMessage: 'Датчик был успешно создана',
    errorMessage: 'Датчик не был создан',
  });
};

// const selectedModelSensor = computed(() => apiGetModel.value?.data?.response.children.find((item: any) => item.type === selectedSensor.value)?.props);

// Watchers
// watch(selectedModelSensor, () => {
//   if (!selectedParamSensor.value) {
//     form.value.min = '';
//     form.value.max = '';
//     return;
//   }
//   form.value.min = selectedModelSensor.value?.min_threshold?.value ?? '';
//   form.value.max = selectedModelSensor.value?.max_threshold?.value ?? '';
// }, {
//   immediate: false,
// });

// Hooks
onBeforeMount(async () => {
  // Get Sensor Values
  const dataValues: unknown = await useAPI(paths.objects, {
    query: computed(() => ({
      filter_by_category: 'sensor',
      limit: 9999,
      type_struct: 'easy',
      children: '1',
    })),
    watch: false,
  });

  apiGetSensor.value = dataValues as APIData<any>;

  // Get Sensor Types
  const dataGetModel: unknown = await useAPI(paths.objectModel, {
    query: computed(() => ({
      category: 'sensor',
      type: selectedSensor.value,
    })),
    immediate: false,
  });

  apiGetSensorType.value = dataGetModel as APIData<any>;

  // Create Sensors
  const dataCreateSensor: unknown = await useAPI(paths.privateItemsSensor, {
    body: computed(() => ({
      ...form.value
    })),
    method: 'POST',
    immediate: false,
    watch: false,
  });

  apiCreateSensor.value = dataCreateSensor as APIData<any>;
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
      <Form
        :resolver
        @submit="({ valid }) => { if (valid) createSensor() }"
      >
        <div class="tw-mb-2 tw-grid tw-grid-cols-2 tw-items-center tw-justify-between">
          <SharedUILabel
            colomn
            required
            title="Доступные Датчики"
          />
          <SharedUILabel
            colomn
            required
            title="Тип Датчика"
          />
        </div>
        <div class="tw-mb-3 tw-grid tw-grid-cols-2 tw-grid-rows-1 tw-gap-2">
          <div class="tw-h-full">
            <div class="border-base tw-h-full tw-rounded-md tw-border tw-p-3">
              <InputText
                v-model="filter"
                class="tw-mb-2 tw-w-full"
              />
              <Button
                v-for="sensor in filteredSensorList"
                :key="sensor.id"
                class="tw-mb-1 tw-flex tw-w-full tw-items-center tw-py-0.5"
                text
                @click="selectSensor(sensor.type, sensor.id)"
              >
                <div
                  class="tw-flex tw-w-full tw-items-center tw-text-black"
                  :class="{
                    '!tw-text-primary': sensor.type === selectedSensor,
                    '!tw-text-white': storeUser.isDark
                  }"
                >
                  <p class="tw-truncate tw-text-left">
                    {{ sensor.name }}
                    <span class="tw-block tw-text-sm tw-text-gray-500">
                      {{ sensor.type }}
                    </span>
                  </p>
                </div>
              </Button>
            </div>
          </div>
          <div>
            <div class="border-base tw-mb-4 tw-min-h-12 tw-rounded-md tw-border tw-p-3">
              <Button
                v-for="sensor in apiGetSensorType?.data?.response.children"
                :key="sensor.type"
                class="tw-flex tw-w-full tw-py-1"
                text
                type="button"
                @click="selectParamSensor(sensor.type)"
              >
                <div
                  class="tw-w-full tw-text-left tw-text-black"
                  
                  :class="{
                    '!tw-text-primary': sensor.type === form.type,
                    '!tw-text-white': storeUser.isDark
                  }"
                >
                  {{ sensor.type }}
                </div>
              </Button>
            </div>
            <div>
              <SharedUILabel
                class="tw-mb-2"
                name="name"
                required
                :title="'Название'"
                :value="form.name"
              >
                <InputText
                  v-model="form.name"
                  class="tw-w-full"
                />
              </SharedUILabel>
              <SharedUILabel
                class="tw-mb-2"
                name="zone_id"
                required
                :title="'Помещение'"
                :value="form.zone_id"
              >
                <SharedUIRoomSelect v-model="form.zone_id" />
              </SharedUILabel>
              <SharedUILabel
                class="tw-mb-2"
                :title="'Иконка'"
              >
                <SharedUIIconSelect v-model:icon="form.icon" />
              </SharedUILabel>
            </div>
          <!-- <p class="tw-mb-4 tw-text-xl">
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
          </div> -->
          <!-- <div class="tw-flex tw-items-center tw-gap-2">
            <Checkbox
              v-model="isRegulator"
              binary
            />
            <label for="ingredient1">
              Регулировка
            </label>
          </div> -->
          </div>
        </div>

        <div class="tw-flex tw-justify-end">
          <Button
            class="tw-mr-2"
            :disabled="!(form.object_id && form.type)"
            type="submit"
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
      </Form>
    </Dialog>
  </div>
</template>

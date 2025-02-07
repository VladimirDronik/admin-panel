<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { filterInListRoom } from '~/helpers/rooms';
// Types and Schemes modules
import type { Request } from '~/types/StoreTypes';

const emit = defineEmits<{
  (e: 'update'): void
}>();

const { rooms } = defineProps<{
  rooms: RoomItem[] | undefined,
}>();

const dialog = defineModel<boolean>({
  default: false,
});

const options = computed(() => filterInListRoom(rooms ?? []));

// Composables
const { t } = useI18n();
const storeUser = useUserStore();
const { updateData } = useUtils();

// Variables
const selectedSensor = ref<string>();

const {
  dataSensors,
  dataSensorTypes,
} = await useCreatedApi();

const {
  form,
  resolver,
  createSensor,
  selectSensor,
  selectParamSensor,
  statusCreateSensor,
} = await useCreateSensor();

const {
  filter,
  filteredSensorList,
} = useFilter();

function useFilter() {
  const filter = ref('');

  const filteredSensorList = computed(() => dataSensors.value?.response.list.filter((item: any) => item.name.toLowerCase().includes(filter.value.toLowerCase())));
  return {
    filter,
    filteredSensorList,
  };
}

async function useCreateSensor() {
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

  const {
    status: statusCreateSensor,
    execute: executeCreateSensor,
  } = await useAPI<Request<any>>(paths.privateItemsSensor, {
    body: computed(() => ({
      ...form.value,
    })),
    method: 'POST',
    immediate: false,
    watch: false,
  });

  const selectSensor = (sensor: string, id: number) => {
    form.value.object_id = id;
    selectedSensor.value = sensor;
    form.value.type = null;
  };

  const selectParamSensor = (type: string) => {
    form.value.type = type;
  };

  const createSensor = async () => {
    await updateData({
      update: async () => {
        await executeCreateSensor();
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

  return {
    form,
    resolver,
    selectedSensor,
    createSensor,
    selectSensor,
    selectParamSensor,
    statusCreateSensor,
    executeCreateSensor,
  };
}

async function useCreatedApi() {
  const data = await Promise.all([
    useAPI<Request<any>>(paths.objects, {
      query: computed(() => ({
        filter_by_category: 'sensor',
        limit: 9999,
        type_struct: 'easy',
        children: '1',
      })),
      watch: false,
    }),
    useAPI<Request<any>>(paths.objectModel, {
      query: computed(() => ({
        category: 'sensor',
        type: selectedSensor.value,
      })),
      immediate: false,
    }),
  ]);

  const [
    {
      data: dataSensors,
    },
    {
      data: dataSensorTypes,
    },
  ] = data;

  return {
    dataSensors,
    dataSensorTypes,
  };
}
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
                    '!tw-text-white': storeUser.isDark,
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
            <div class="border-base tw-mb-4 tw-min-h-40 tw-rounded-md tw-border tw-p-3">
              <Button
                v-for="sensor in dataSensorTypes?.response.children"
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
                    '!tw-text-white': storeUser.isDark,
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
                <SharedUIRoomSelect
                  v-model="form.zone_id"
                  :options
                />
              </SharedUILabel>
              <SharedUILabel
                class="tw-mb-2"
                :title="'Иконка'"
              >
                <SharedUIIconSelect v-model:icon="form.icon" />
              </SharedUILabel>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-justify-end">
          <Button
            class="tw-mr-2"
            :disabled="!(form.object_id && form.type)"
            :label="t('save')"
            :loading="statusCreateSensor === 'pending'"
            type="submit"
          />
          <Button
            :label="t('cancel')"
            outlined
            variant="outlined"
            @click="dialog = false"
          />
        </div>
      </Form>
    </Dialog>
  </div>
</template>

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
const { updateData } = useUtils();
const storeUser = useUserStore()

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const { sensor, id } = defineProps<{
  sensor: roomSensorTypes,
  id: number,
}>();

const dialog = defineModel<boolean>({
  default: false,
});

// Variables
const isRegulator = ref(false);

const dialogDelete = ref(false)

// Apis
const apiGetSensor = ref<APIData<any>>();
const apiDeleteSensor = ref<APIData<any>>();

const form = ref({
  min: '',
  max: '',
});

// Methods
const changeSensor = async () => {
};

const confirmDelete = async () => {
  await updateData({
      update: async () => {
        await apiDeleteSensor.value?.execute();
        await apiGetSensor.value?.refresh()
      },
      success: () => {
        dialogDelete.value = false;
        dialog.value = false;
        emit('update')
      },
      successMessage: 'Устройство удалено',
      errorMessage: 'Ошибка удаления устройства',
    });
}

// Hooks
onBeforeMount(async () => {
  // Get Sensor
  const dataGetSensor: unknown = await useAPI(paths.privateSensor, {
    query: computed(() => ({
      itemId: id,
    })),
    immediate: false,
  });

  apiGetSensor.value = dataGetSensor as APIData<any>;

  // Delete Sensor
  const dataDeleteSensor: unknown = await useAPI(paths.privateItemsSensor, {
    query: computed(() => ({
      id,
    })),
    method: 'DELETE',
    immediate: false,
  });

  apiDeleteSensor.value = dataDeleteSensor as APIData<any>;
});

watch(() => id, () => {
  apiGetSensor.value?.execute();
});
</script>

<template>
  <div>
    <button
      class="tw-mr-2 tw-flex tw-items-center"
      type="button"
      @click="dialog = true"
    >
      <img
        alt=""
        class="tw-mr-0.5 tw-w-4"
        :class="{
          'tw-invert': storeUser.isDark
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
      <div class="tw-mb-3">
        <div>
          <p class="tw-mb-4 tw-text-xl">
            Текущее значение: {{ sensor.name ? sensor.name : '-' }}
            <span v-if="sensor.type === 'temperature'">
              °
            </span>
            <span v-else-if="sensor.type === 'humidity'">
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
          @click="changeSensor"
        >
          {{ t('save') }}
        </Button>
        <DialogsDeleteDialog
          :id="id ?? -1"
          v-model="dialogDelete"
          class="tw-mr-2"
          :loading="apiDeleteSensor?.pending && apiDeleteSensor.status !== 'idle'"
          :subtitle="`Вы уверены, что хотите удалить «${sensor.name}»?`"
          title="Удалить устройство"
          @delete="confirmDelete"
        />
      </div>
    </Dialog>
  </div>
</template>

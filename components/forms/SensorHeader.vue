<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const storeRooms = useRoomsStore();

interface SensorHeaderProps {
  data: { value: string | number; unit: string; label: string }[];
  lastUpdate: string;
  form: {
    title: string;
    room?: string;
    pollInterval: number;
  }
}
const props = defineProps<SensorHeaderProps>();
const emit = defineEmits<{
  (event: 'update:model-value', value: string | number | undefined): void;
}>();

let formSensorHeader = reactive({
  ...props.form,
});

watch(
  () => props.form,
  (newValue) => {
    formSensorHeader = newValue;
  },
  { deep: true },
);

const updateTitle = (value: string | undefined) => {
  formSensorHeader.title = value || '';
  emit('update:model-value', value);
};

const updateRoomSelection = (value: string | undefined) => {
  formSensorHeader.room = value || '';
  emit('update:model-value', value);
};

const updatePollInterval = (value: number) => {
  formSensorHeader.pollInterval = value;
  emit('update:model-value', value);
};

</script>

<template>
  <!-- Данные -->
  <div class="tw-mt-4 tw-grid tw-grid-cols-3 tw-gap-4 tw-text-center">
    <div v-for="(item, index) in props.data" :key="index">
      <p class="tw-text-2xl tw-font-bold">
        {{ item.value }} {{ item.unit }}
      </p>
      <span class="tw-text-sm tw-text-gray-500">
        {{ item.label }}
      </span>
    </div>
  </div>

  <!-- Дата обновления -->
  <div class="tw-mt-4"> {{ t('devices.dataUpdated') }}:
    <span>
      {{ props.lastUpdate }}
    </span>
  </div>

  <Divider class="tw-mt-0 tw-pb-3" />

  <SharedUILabel class="tw-mb-2" :title="t('devices.title')" required name="title">
    <InputText
      :value="formSensorHeader.title"
      @update:modelValue="updateTitle"
      required
      class="tw-w-3/4" />
  </SharedUILabel>

  <SharedUILabel class="tw-mb-2" :title="t('devices.room')" name="room">
    <Select
      :value="formSensorHeader.room"
      @update:modelValue="updateRoomSelection"
      :options="storeRooms.getRoomsSelect"
      optionLabel="name"
      optionValue="code"
      class="tw-w-3/4"
    />
  </SharedUILabel>

  <SharedUILabel class="tw-mb-2" :title="t('devices.polling')" required name="pollInterval">
    <InputNumber
      :value="formSensorHeader.pollInterval"
      @update:modelValue="updatePollInterval"
      suffix=" sec"
      id="pollInterval"
      class="tw-mr-10 tw-w-1/4"
    />
  </SharedUILabel>
</template>

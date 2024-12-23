<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { type DeviceZoneId } from '@/types/DevicesTypes';

const { t } = useI18n();
const storeRooms = useRoomsStore();

interface SensorHeaderProps {
  data: { value: string | number; unit: string; label: string }[];
  lastUpdate: string;
}

const updateInterval = defineModel<number>('update-interval');
const zoneId = defineModel<DeviceZoneId>('zone-id');
const name = defineModel<string>('name');

const props = defineProps<SensorHeaderProps>();
</script>

<template>
  <!-- Данные -->
  <div class="tw-mt-4 tw-grid tw-grid-cols-3 tw-gap-4 tw-text-center">
    <div
      v-for="(item, index) in props.data"
      :key="index"
    >
      <p class="tw-text-2xl tw-font-bold">
        {{ item.value }} {{ item.unit }}
      </p>
      <span class="tw-text-sm tw-text-gray-500">
        {{ item.label }}
      </span>
    </div>
  </div>

  <!-- Дата обновления -->
  <div class="tw-mt-4">
    {{ t('devices.dataUpdated') }}:
    <span>
      {{ props.lastUpdate }}
    </span>
  </div>

  <Divider class="tw-mt-0 tw-pb-3" />

  <SharedUILabel
    class="tw-mb-2"
    name="title"
    required
    :title="t('devices.title')"
  >
    <InputText
      v-model="name"
      class="tw-w-3/4"
      required
    />
  </SharedUILabel>

  <SharedUILabel
    class="tw-mb-2"
    name="room"
    :title="t('devices.room')"
  >
    <Select
      v-model="zoneId"
      class="tw-w-3/4"
      option-label="name"
      option-value="code"
      :options="storeRooms.getRoomsSelect"
      :show-clear="true"
    />
  </SharedUILabel>

  <SharedUILabel
    class="tw-mb-2"
    name="update_interval"
    required
    :title="t('devices.polling')"
  >
    <InputNumber
      id="update_interval"
      v-model="updateInterval"
      class="tw-mr-10 tw-w-1/4"
      suffix=" sec"
    />
  </SharedUILabel>

  <Divider class="tw-mt-0 tw-pb-3" />
</template>

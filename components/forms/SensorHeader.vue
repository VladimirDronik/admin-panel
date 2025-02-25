<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types modules
import { type DeviceZoneId } from '@/types/DevicesTypes';
import { updateIntervals } from '~/staticData/updateIntervalOptions';

// Types
interface SensorHeaderProps {
  data: { value: string | number; unit: string; label: string }[];
  lastUpdate: string;
}

// Composables
const { t } = useI18n();
const storeRooms = useRoomsStore();

// Declare Options
const props = defineProps<SensorHeaderProps>();

const updateInterval = defineModel<string>('update-interval');
const zoneId = defineModel<DeviceZoneId>('zone-id');
const name = defineModel<string>('name');

</script>

<template>
  <!-- Данные -->
  <div class="tw-grid tw-grid-cols-4 tw-gap-4">
    <div
      v-for="(item, index) in props.data"
      :key="index"
    >
      <span class="text-primary-custom tw-text-[12px]">
        {{ item.label }}
      </span>
      <p class="tw-text-xl">
        {{ item.value }} {{ item.unit }}
      </p>
    </div>
  </div>

  <!-- Дата обновления -->
  <div class="text-primary-custom tw-my-4 tw-text-[12px]">
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
      class="tw-w-full"
      required
    />
  </SharedUILabel>

  <div class="tw-mb-4 tw-flex tw-items-center tw-gap-4">
    <SharedUILabel
      class="tw-w-1/2"
      name="room"
      :title="t('devices.room')"
    >
      <Select
        v-model="zoneId"
        class="tw-w-full"
        option-label="name"
        option-value="code"
        :options="storeRooms.getRoomsSelect"
        :show-clear="true"
      />
    </SharedUILabel>

    <SharedUILabel
      class="tw-w-1/2"
      name="update_interval"
      required
      :title="t('devices.polling')"
    >
      <Select
        id="update_interval"
        v-model="updateInterval"
        class="tw-w-full"
        option-label="label"
        option-value="value"
        :options="updateIntervals"
      />
    </SharedUILabel>
  </div>

  <Divider class="tw-mt-0 tw-pb-3" />
</template>

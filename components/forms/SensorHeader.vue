<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types modules
import { type DeviceZoneId } from '@/types/DevicesTypes';
import { units } from '~/staticData/updateIntervalOptions';

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

const numericValue = defineModel<number>('numeric-value');
const selectedUnit = defineModel<string>('selected-unit');
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
      required
      :title="t('devices.polling')"
    >
      <div class="p-inputgroup tw-w-full">
        <InputNumber
          v-model="numericValue"
          class="tw-w-1/2"
        />
        <Select
          v-model="selectedUnit"
          class="tw-w-1/2"
          option-label="label"
          option-value="value"
          :options="units"
        />
      </div>
    </SharedUILabel>
  </div>

  <Divider class="tw-mt-0 tw-pb-3" />
</template>

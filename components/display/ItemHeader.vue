<script lang="ts" setup>
// Helpers modules
import { itemColor } from '~/helpers/rooms';
// Types
import type { roomSensorTypes } from '~/types/DisplayTypes';

// Declare Options
defineProps<{
  name: string,
  style: string,
  sensors: roomSensorTypes[] | undefined,
}>();
</script>

<template>
  <div class="tw-flex tw-w-full tw-items-center tw-justify-between tw-pl-1.5 tw-pt-1">
    <div class=" tw-flex tw-items-center">
      <h4
        class="tw-mr-2 tw-text-xl"
        :style="{ color: itemColor(style) }"
      >
        {{ name }}
      </h4>
      <DialogsDisplayChangeSensorDialog
        v-for="sensor in sensors"
        :id="sensor.item_id"
        :key="sensor.item_id"
        :sensor
      />
      <DialogsDisplayAddSensorDialog :sensors />
    </div>
  </div>
</template>

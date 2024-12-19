<script lang="ts" setup>
// Helpers modules
import { itemColor } from '~/helpers/rooms';
// Types
import type { roomSensorTypes } from '~/types/DisplayTypes';

defineProps<{
  name: string,
  style: string,
  sensors: roomSensorTypes[] | undefined,
}>();
</script>

<template>
  <div class="tw-flex tw-w-full tw-items-center tw-justify-between tw-pl-1.5 tw-pt-1">
    <div class=" tw-flex tw-items-center">
      <h4 class="tw-mr-2 tw-text-xl" :style="{ color: itemColor(style) }">
        {{ name }}
      </h4>
      <div
        v-for="sensor in sensors"
        :key="sensor.id_item"
        class="tw-mr-2 tw-flex tw-items-center"
      >
        <img
          :src="`scenario_items/${sensor.icon}.png`"
          alt=""
          class="tw-mr-0.5"
        >
        {{sensor.current}}
        <span v-if="sensor.type === 'temperature'">
          °
        </span>
        <span v-else-if="sensor.type === 'humidity'">
          %
        </span>
      </div>
      <DialogsDisplaySensorDialog :sensors />
    </div>
  </div>
</template>

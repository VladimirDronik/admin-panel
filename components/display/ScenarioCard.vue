<script lang="ts" setup>
// Helpers modules
import { roomTextColor } from '~/helpers/rooms';

defineProps<{
  icon: string,
  title: string,
  color: string,
}>();
</script>

<template>
  <button
    type="button"
    class="tw-relative tw-aspect-square tw-w-32 tw-min-w-32 tw-rounded-md tw-border-2 tw-p-1"
  >
    <div class="tw-flex tw-h-full tw-w-full tw-items-center tw-justify-between tw-pt-1">
      <div class="tw-h-full tw-pt-2">
        <img
          :src="`scenario_items/${icon}.png`"
          alt=""
          class="tw-aspect-square tw-w-12"
        >
        <h4
          class="tw-absolute tw-bottom-2 tw-left-1.5 tw-right-0 tw-mr-2 tw-truncate tw-text-left tw-text-primary"
          :style="{ color: roomTextColor(color) }"
        >
          {{ title }}
        </h4>
        <!-- <Button class="tw-aspect-square tw-w-8" outlined icon="pi pi-plus" size="small" /> -->
      </div>
    </div>
  </button>
</template>

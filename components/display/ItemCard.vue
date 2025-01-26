<script lang="ts" setup>
// Helpers modules
import { itemColor } from '~/helpers/rooms';

// Composables
const storeUser = useUserStore()

// Declare Options
defineProps<{
  icon: string,
  status: string,
  title: string,
  color: string | undefined,
  style: string,
  groupElements: any[] | undefined,
}>();
</script>

<template>
  <button
    class="tw-m-1.5"
    type="button"
  >
    <div
      class="border-base tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3"
      :class="{ 'item': !(status === 'on') }"
      :style="{ borderColor: itemColor(style, color) }"
    >
      <img
        alt=""
        class="tw-w-20"
        :class="{
          '!tw-opacity-60': !(status === 'on'),
          'tw-invert': storeUser.isDark
        }"
        :src="`items/${icon}.png`"
      >
      <Badge
        v-if="groupElements"
        class="tw-absolute -tw-right-2.5 -tw-top-2.5 tw-rounded-full tw-text-white"
        :class="{ '!tw-bg-gray-400': !(status === 'on') }"
        rounded
        :style="{ backgroundColor: itemColor(style, color) }"
      >
        {{ groupElements.length }}
      </Badge>
    </div>
    <h5 class="tw-w-28 tw-truncate tw-text-center">
      {{ title }}
    </h5>
  </button>
</template>

<style lang="scss" scoped>
  .item {
    border-color: inherit !important;
    
    .p-dark & {
      border-color: var(--p-surface-800) !important;
    }
  }
</style>
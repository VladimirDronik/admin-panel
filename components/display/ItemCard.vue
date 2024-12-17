<script lang="ts" setup>
// Helpers modules
import { itemColor } from '~/helpers/rooms';

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
    type="button"
    class="tw-m-1.5"
  >
    <div
      class="tw tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3"
      :class="{ '!tw-border-inherit': !(status === 'on') }"
      :style="{ borderColor: itemColor(style, color) }"
    >
      <img
        :src="`items/${icon}.png`"
        alt=""
        class="tw-w-20"
        :class="{ '!tw-opacity-60': !(status === 'on') }"
      >
      <Badge
        v-if="groupElements"
        :style="{ backgroundColor: itemColor(style, color) }"
        :class="{ '!tw-bg-gray-400': !(status === 'on') }"
        class="tw-absolute -tw-right-2.5 -tw-top-2.5 tw-rounded-full"
        rounded
      >
        {{ groupElements.length }}
      </Badge>
    </div>
    <h5 class="tw-w-28 tw-truncate tw-text-center">
      {{ title }}
    </h5>
  </button>
</template>

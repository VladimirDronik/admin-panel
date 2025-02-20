<script lang="ts" setup>
// Helpers modules
import { roomTextColor } from '~/helpers/rooms';

// Composables
const storeUser = useUserStore();

// Declare Options
const props = defineProps<{
  icon: string,
  title: string,
  color: string,
}>();

const computedFilter = computed(() => {
  const filters: Record<string, string> = {
    blue: 'brightness(0) saturate(100%) invert(66%) sepia(50%) saturate(5712%) hue-rotate(197deg) brightness(103%) contrast(102%)',
    green: 'brightness(0) saturate(100%) invert(52%) sepia(94%) saturate(3201%) hue-rotate(135deg) brightness(105%) contrast(80%)',
    yellow: 'brightness(0) saturate(100%) invert(81%) sepia(31%) saturate(844%) hue-rotate(345deg) brightness(103%) contrast(101%)',
    orange: 'brightness(0) saturate(100%) invert(78%) sepia(56%) saturate(1570%) hue-rotate(318deg) brightness(101%) contrast(101%)',
    red: 'brightness(0) saturate(100%) invert(46%) sepia(69%) saturate(1120%) hue-rotate(329deg) brightness(101%) contrast(101%)',
  };

  return filters[props.color as keyof typeof filters] || filters.green;
});
</script>

<template>
  <div class="tw-m-1.5 tw-flex tw-flex-col tw-items-center">
    <button
      class="border-base tw-aspect-square tw-rounded-[15%] tw-border-2 tw-p-3.5"
      type="button"
    >
      <div class="tw-flex tw-size-full tw-items-center tw-justify-between">
        <div
          class="border-base tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md"
          :style="{
            borderRadius: '15px',
          }"
        >
          <img
            alt="scenario"
            class="tw-aspect-square"
            height="70"
            :src="`items/${icon}.png`"
            :style="{ filter: computedFilter }"
            width="70"
          >
        </div>
      </div>
    </button>
    <h4
      class="tw-w-28 tw-truncate tw-text-center tw-text-primary"
      :style="{ color: roomTextColor(color) }"
    >
      {{ title }}
    </h4>
  </div>
</template>

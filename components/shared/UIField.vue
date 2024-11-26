<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    v-if="$slots.label || $slots.input"
    class="tw-flex tw-flex-col tw-gap-4 tw-w-full"
  >
    <div class="tw-flex tw-items-center tw-w-full tw-mb-4">
      <div class="tw-flex-1 tw-text-right tw-pr-2">
        <slot name="label" />
      </div>
      <div class="tw-flex-1 tw-text-left">
        <slot name="input" />
      </div>
    </div>
    <slot />
  </div>
</template>

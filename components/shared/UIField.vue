<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
  },
});
</script>

<template>
  <div v-if="$slots.label || $slots.input" class="tw-flex tw-w-full tw-flex-col tw-gap-4">
    <div class="tw-mb-4 tw-flex tw-w-full tw-items-center">
      <div class="tw-flex-1 tw-pr-2 tw-text-right">
        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
          <slot name="label" />
          <span v-if="required" class="tw-text-primary"> *</span>
        </p>
      </div>
      <div class="tw-flex-1 tw-text-left">
        <slot name="input" />
      </div>
    </div>
    <slot />
  </div>
</template>

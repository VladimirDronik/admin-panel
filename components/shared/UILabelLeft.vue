<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="tw-mb-4 tw-flex tw-items-center">
    <p v-if="title" class="tw-pr-4 tw-text-lg tw-font-semibold">
      {{ title }}
      <span v-if="required" class="tw-text-primary">*</span>
    </p>
    <div>
      <slot />
    </div>
  </div>
</template>

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
  <div class="tw-w-full">
    <p v-if="title" class="tw-mb-1.5 tw-text-lg tw-font-semibold">
      {{ title }} <span v-if="required" class="tw-text-primary">*</span>
    </p>
    <slot />
  </div>
</template>

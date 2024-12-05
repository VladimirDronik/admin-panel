<script lang="ts" setup>
import { FormField } from '@primevue/forms';

defineProps({
  value: {},
  title: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 200,
  },
  required: {
    type: Boolean,
    default: false,
  },
  colomn: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <FormField
    v-slot="$field"
    :name
    :initialValue="value"
    :class="{ 'tw-flex': !colomn }"
    class="tw-w-full tw-items-center"
  >
    <p
      v-if="title"
      class="tw-mb-1.5 tw-whitespace-nowrap tw-pr-2 tw-text-lg tw-font-semibold"
      :style="{ width: `${width}px` }"
    >
      <span>
        {{ title }}
      </span>
      <span v-if="required" class="tw-text-primary"> *</span>
    </p>
    <div class="tw-w-full">
      <slot />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </div>
  </FormField>
</template>

<script lang="ts" setup>
import { FormField } from '@primevue/forms';

withDefaults(defineProps<{
  name?: string,
  width?: number,
  title?: string,
  colomn?: boolean,
  required?: boolean,
  value?: any,
  tooltip?: any,
}
>(), {
  name: '',
  title: '',
  width: 200,
  colomn: false,
  required: false,
  value: {},
  tooltip: {},
})
</script>

<template>
  <FormField
    v-slot="$field"
    class="tw-w-full tw-items-center"
    :class="{ 'tw-flex': !colomn }"
    :initial-value="value"
    :name
  >
    <p
      v-if="title"
      class="tw-mb-1.5 tw-whitespace-nowrap tw-pr-2 tw-text-lg"
      :style="{ width: `${width}px` }"
    >
      <span v-tooltip="tooltip">
        {{ title }}
      </span>
      <span
        v-if="required"
        class="tw-text-primary"
      > *</span>
    </p>
    <div class="tw-w-full">
      <slot />
      <Message
        v-if="$field?.invalid"
        class="tw-text-danger tw-text-sm"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </div>
  </FormField>
</template>

<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

// Declare Options
const value = defineModel<boolean>({
  default: false,
});

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="tw-mb-3 tw-flex tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-black tw-px-3"
    style="border-color: var(--p-inputtext-border-color);"
  >
    <p class="tw-py-2 tw-text-base">
      {{ value ? t('enabled') : t('disabled') }}
    </p>
    <ToggleSwitch
      v-model="value"
      color="primary"
      :disabled="disabled"
    />
  </div>
</template>

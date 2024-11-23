<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { GenerateFunction } from '~/types/DevicesTypes';

// Composables
const { t } = useI18n();

const item = defineModel<boolean>({
  required: true,
});

defineProps<{
  disabled: boolean
}>();
</script>

<template>
  <div style="border-color: var(--p-inputtext-border-color);" class="tw-mb-3 tw-flex tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-black tw-px-3">
    <p class="tw-py-2 tw-text-base">
      {{ item ? t('enabled') : t('disabled')}}
    </p>
    <ToggleSwitch
      v-model="item"
      color="primary"
      :disabled="disabled"
    />
  </div>
</template>

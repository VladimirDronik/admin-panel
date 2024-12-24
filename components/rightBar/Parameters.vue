<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

// Declare Options
const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const selectedParameter = defineModel<any>('selectedParameter', {
  default: false,
});

</script>

<template>
  <LayoutFullRightbar :is-open="isOpen">
    <div
      class="tw-min-h-80 tw-p-7"
      elevation="0"
    >
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
          {{ t('parameters.addRoom') }}
        </h3>
        <Button
          icon="pi pi-times"
          rounded
          severity="secondary"
          size="small"
          text
          @click="isOpen = false"
        />
      </div>
      <div>
        <SharedUILabel
          class="tw-mb-3"
          required
          :title="t('parameters.name')"
        >
          <InputText
            v-model="selectedParameter.name"
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          :title="t('parameters.value')"
        >
          <InputText
            v-model="selectedParameter.value"
            class="tw-w-full"
            required
          />
        </SharedUILabel>
        <SharedUILabel
          class="tw-mb-3"
          required
          :title="t('parameters.description')"
        >
          <InputText
            v-model="selectedParameter.description"
            class="tw-w-full"
            required
          />
        </SharedUILabel>
      </div>
      <Button :label="t('save')" />
    </div>
  </LayoutFullRightbar>
</template>

<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const selectedParameter = defineModel<any>('selectedParameter', {
  default: false,
});

</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen">
    <div elevation="0" class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
          {{ t('parameters.addRoom') }}
        </h3>
        <Button
          @click="isOpen = false"
          icon="pi pi-times"
          size="small"
          severity="secondary"
          rounded
          text
        />
      </div>
      <div>
        <SharedUILabel class="tw-mb-3" :title="t('parameters.name')" required>
          <InputText
            class="tw-w-full"
            v-model="selectedParameter.name"
            required
          />
        </SharedUILabel>
        <SharedUILabel class="tw-mb-3" :title="t('parameters.value')" required>
          <InputText
            class="tw-w-full"
            v-model="selectedParameter.value"
            required
          />
        </SharedUILabel>
        <SharedUILabel class="tw-mb-3" :title="t('parameters.description')" required>
          <InputText
            class="tw-w-full"
            v-model="selectedParameter.description"
            required
          />
        </SharedUILabel>
      </div>
      <Button :label="t('save')" />
    </div>
  </LayoutFullRightbar>
</template>

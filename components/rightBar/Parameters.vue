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
  <LayoutRightbar
    :is-open="isOpen"
    :title="t('parameters.addRoom')"
  >
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
  </LayoutRightbar>
</template>

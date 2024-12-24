<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.logging')),
});

// Variables
const headers = [
  {
    label: 'Дата',
    code: 'date',
  },
  {
    label: 'Тип',
    code: 'type',
  },
  {
    label: 'Описание',
    code: 'description',
  },
];
</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.logging">
      <Button
        class="text-capitalize"
        label="Настройки"
      />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      :headers="headers"
      :items="[]"
    />
  </SharedUIPanel>
</template>

<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.scenario')),
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
    <SharedUIBreadcrumb title="pages.scenario">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавление сценария"
      />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      :headers="headers"
      :items="[]"
    />
  </SharedUIPanel>
</template>

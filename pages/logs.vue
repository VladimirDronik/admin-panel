<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.logging')),
});

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
  <BasePanel>
    <BaseBreadcrumb title="pages.logging">
      <Button
        class="text-capitalize"
        label="Настройки"
      />
    </BaseBreadcrumb>
    <BaseNewTable
      class="data-table"
      :headers="headers"
      :items="[]"
    />
  </BasePanel>
</template>

<style>

</style>

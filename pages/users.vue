<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.users')),
});

const headers = [
  {
    label: 'ID',
    code: 'id',
  },
  {
    label: 'Имя',
    code: 'name',
  },
  {
    label: 'Статус',
    code: 'script',
  },
  {
    label: 'Доступ',
    code: 'count',
  },
  {
    label: 'Действия',
    code: 'actions',
  },
];
</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.users">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить Пользователя"
      />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      :headers="headers"
      :items="[]"
    />
  </SharedUIPanel>
</template>

<style>

</style>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.display')),
});

const page = ref(1);
const filters = ref([]);

const headers = [
  {
    label: 'ID',
    code: 'id',
  },
  {
    label: 'Тип',
    code: 'type',
  },
  {
    label: 'Статус',
    code: 'status',
  },
  {
    label: 'Надпись',
    code: 'Inscription',
  },
  {
    label: 'Обьект',
    code: 'object',
  },
  {
    label: 'Помещение',
    code: 'room',
  },
  {
    label: 'Активно',
    code: 'active',
  },
  {
    label: 'Действия',
    code: 'actions',
  },
];

</script>

<template>
  <div>
    <BaseBreadcrumb title="pages.display">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить отображение"
      />
    </BaseBreadcrumb>
    <BaseNewTable
      class="data-table"
      :headers="headers"
      :items="[]"
    />
  </div>
</template>

<style>

</style>

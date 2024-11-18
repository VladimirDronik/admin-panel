<script lang="ts" setup>

const headers = [
  {
    label: 'ID',
    code: 'id',
  },
  {
    label: 'Название',
    code: 'name',
  },
  {
    label: 'Скрипт',
    code: 'script',
  },
  {
    label: 'Выполнений',
    code: 'count',
  },
  {
    label: 'Системный',
    code: 'system',
  },
  {
    label: 'Действия',
    code: 'actions',
  },
];
</script>

<template>
  <div>
    <BaseBreadcrumb title="pages.scripts">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить Скрипт"
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

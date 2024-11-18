<script lang="ts" setup>

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
  <div>
    <BaseBreadcrumb title="pages.users">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить Пользователя"
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

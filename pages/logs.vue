<script lang="ts" setup>

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
  <div>
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
  </div>
</template>

<style>

</style>

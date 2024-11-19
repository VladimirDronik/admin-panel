<script lang="ts" setup>

const storeDevices = useDevicesStore();

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
    code: 'code',
  },
  {
    label: 'Выполнений',
    code: 'count',
  },
  {
    label: 'Системный',
    code: 'system',
  },
];

storeDevices.getScriptsApi();
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
      :items="storeDevices.scripts"
    >
      <Column field="actions" style="width: 200px">
        <template #header>
          <p class="tw-font-semibold">
            Действия
          </p>
        </template>
        <template #body="{ node }">
          <div>
            <Button
              outlined
              icon="pi pi-pencil"
              severity="info"
              rounded
              aria-label="Search"
              class="tw-mr-2"
            />
            <Button
              outlined
              icon="pi pi-trash"
              severity="danger"
              rounded
              aria-label="Cancel"
            />
          </div>
        </template>
      </Column>
    </BaseNewTable>
  </div>
</template>

<style>

</style>

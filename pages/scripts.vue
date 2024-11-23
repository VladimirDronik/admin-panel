<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.scripts')),
});

const storeScript = useScriptStore();

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

storeScript.getScriptsApi();
</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.scripts">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить Скрипт"
      />
    </SharedUIBreadcrumb>
    <BaseTable
      class="data-table"
      :headers="headers"
      :items="storeScript.list"
    >
      <Column field="actions" style="width: 200px">
        <template #header>
          <p class="tw-font-semibold">
            Действия
          </p>
        </template>
        <template>
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
    </BaseTable>
  </SharedUIPanel>
</template>

<style>

</style>

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
    label: t('script.name'),
    code: 'name',
  },
  {
    label: t('script.code'),
    code: 'code',
  },
  {
    label: t('script.count'),
    code: 'count',
  },
  {
    label: t('script.system'),
    code: 'system',
  },
];

storeScript.getScriptsApi({
  limit: 99,
});

const data = computed(() => storeScript.scripts);
</script>

<template>
  <SharedUIPanel :is-update="data?.pending">
    <SharedUIBreadcrumb title="pages.scripts">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить Скрипт"
      />
    </SharedUIBreadcrumb>
    <div v-if="data">
      <BaseTable
        class="data-table"
        :headers="headers"
        :items="data.data?.response.list"
      >
        <Column field="actions" style="width: 200px">
          <template #header>
            <p class="tw-font-semibold">
              {{ t('scripts.action') }}
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
    </div>
  </SharedUIPanel>
</template>

<style>

</style>

<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();
const storeScript = useScriptStore();

useHead({
  titleTemplate: computed(() => t('pages.scripts')),
});

// Variables
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

// Computed Properties
const data = computed(() => storeScript.scripts);

onBeforeMount(() => {
  storeScript.getScriptsApi({
    limit: 99,
  });
});

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
        <Column
          field="actions"
          style="width: 200px"
        >
          <template #header>
            <p class="tw-font-semibold">
              {{ t('scripts.action') }}
            </p>
          </template>
          <template #body>
            <div>
              <Button
                aria-label="Search"
                class="tw-mr-2"
                icon="pi pi-pencil"
                outlined
                rounded
                severity="info"
              />
              <Button
                aria-label="Cancel"
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
              />
            </div>
          </template>
        </Column>
      </BaseTable>
    </div>
  </SharedUIPanel>
</template>

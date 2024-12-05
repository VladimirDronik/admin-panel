<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.networkSettings')),
});

const items = [
  {
    name: 'eco_mode',
    value: 'false',
    description: 'Режим экономии',
  },
  {
    name: 'graphdate',
    value: '365',
    description: 'Сколько дней хранить информацию в графиках',
  },
  {
    name: 'guard_mode',
    value: 'false',
    description: 'Режим охраны',
  },
  {
    name: 'heating_mode',
    value: 'eco',
    description: 'План отопления дома: eco, night, normal',
  },
];

const isOpen = ref(false);

const selectedParameter = ref();

const editParameter = (item: any) => {
  isOpen.value = true;
  selectedParameter.value = item;
};
</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.parameters" />
    <DataTable
      :value="items"
      class="params-table"
      tableStyle="min-width: 50rem"
    >
      <Column field="name" header="Name" />
      <Column field="value" header="Value" />
      <Column field="description" header="Description" />
      <Column field="actions" header="Actions" style="width: 150px">
        <template #body="{ data }">
          <div class="tags">
            <Button
              @click="editParameter(data)"
              icon="pi pi-pencil"
              severity="info"
              outlined
              rounded
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <template #rightbar>
      <RightBarParameters
        v-model:is-open="isOpen"
        v-model:selectedParameter="selectedParameter"
      />
    </template>
  </SharedUIPanel>
</template>

<style lang="scss">
.params-table {
  & .p-datatable-header-cell {
    background-color: inherit !important;
    border-right: none !important;
    border-top: 1px solid var(--p-treetable-body-cell-border-color);
  }
}
</style>

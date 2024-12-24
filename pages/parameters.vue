<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.networkSettings')),
});

// Variables
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

// Methods
const editParameter = (item: any) => {
  isOpen.value = true;
  selectedParameter.value = item;
};
</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.parameters" />
    <DataTable
      class="params-table"
      table-style="min-width: 50rem"
      :value="items"
    >
      <Column
        field="name"
        header="Name"
      />
      <Column
        field="value"
        header="Value"
      />
      <Column
        field="description"
        header="Description"
      />
      <Column
        field="actions"
        header="Actions"
        style="width: 150px"
      >
        <template #body="{ data }">
          <div class="tags">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              severity="info"
              @click="editParameter(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <template #rightbar>
      <RightBarParameters
        v-model:is-open="isOpen"
        v-model:selected-parameter="selectedParameter"
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

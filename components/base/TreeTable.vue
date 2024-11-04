<script setup lang="ts">
// Builtin modules
import {
  type PropType, ref, watch, computed,
} from 'vue';
import { useRoute } from 'vue-router';
// External modules
import moment from 'moment';
import _, { isArray } from 'lodash';
// Components
import TreeTable from 'primevue/treetable';
// Types
import type { Header } from 'vue3-easy-data-table';
import type { Filter } from '@/types/MainTypes';

// Composables
const route = useRoute();

// Declare Options
const page = defineModel<number>('page', {
  required: true,
});

const selectedKey = defineModel('selectedKey', {
  default: [],
});

const filters = defineModel<Filter[]>('filters', {
  required: true,
});

const props = defineProps({
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  items: {
    type: Object as PropType<any[]>,
    required: true,
    default() {
      return [];
    },
  },
  perPage: {
    type: Number,
    required: true,
    default: 0,
  },
  headers: {
    type: Object as PropType<Header[]>,
    required: true,
    default() {
      return [];
    },
  },
});

const emit = defineEmits<{
  (e: 'update', params: any): void
  (e: 'created', getData: () => void): void
  (e: 'click-row', item: any): void
}>();

// Variables
const nodes = ref(null);

const isUpdate = ref(false);
const isActiveFilters = ref(false);

const expandedKeys = ref<any>({});

// Computed Properties
const filterValueList = computed(() => filters.value.map((item) => (item.value)));

// Methods
const filter = _.debounce(async () => {
  isUpdate.value = true;

  const params: any = {};
  filters.value.forEach((item) => {
    if (item.key === 'time' && item.value) {
      if (isArray(item.value)) [params.dateFrom, params.dateTo] = [moment(item.value[0]).valueOf(), moment(item.value[1]).valueOf()];
    } else if (item.value) params[item.key] = item.value;
  });
  page.value = 1;
  await emit('update', params);

  isUpdate.value = false;
}, 700);

const pagination = async () => {
  isUpdate.value = true;

  const params: any = {};
  filters.value.forEach((item) => {
    if (item.key === 'time' && item.value) {
      if (isArray(item.value)) [params.dateFrom, params.dateTo] = [moment(item.value[0]).valueOf(), moment(item.value[1]).valueOf()];
    } else if (item.value) params[item.key] = item.value;
  });
  if (page.value > 1) params.offset = props.perPage * (page.value - 1);
  await emit('update', params);

  isUpdate.value = false;
};

// Watchers
watch(page, pagination);
watch(filterValueList, (newValue, oldValue) => {
  if (!_.isEqual(newValue, oldValue)) filter();
});

// Created
const paramsKeys = Object.keys(route.query);
filters.value = filters.value.map((item) => {
  if (paramsKeys.includes(item.key)) {
    const value = route.query[item.key] as number | string | [] | null;
    return {
      ...item,
      value,
    };
  }
  return item;
});

// Created
emit('created', filter);

defineExpose({
  filter,
});

watch(() => props.total, () => {
  Array.from(Array(props.total).keys()).forEach((key) => expandedKeys.value[key] = true);
}, {
  immediate: true,
});

</script>

<template>
  <div class="custom-table">
    <Paginator
      v-if="total > perPage"
      :rows="1"
      :totalRecords="Math.ceil(total / perPage)"
      v-model:first="page"
      data-test="pagination"
    />

    <BaseLoader :isUpdate="isUpdate">
      <TreeTable
        @nodeSelect="(item: any) => emit('click-row', item)"
        v-model:selectionKeys="selectedKey"
        v-model:expandedKeys="expandedKeys"
        :value="items"
        class="tree-table"
        selectionMode="single"
        tableStyle="min-width: 50rem"
      >
        <slot />
      </TreeTable>
    </BaseLoader>
  </div>
</template>

<style lang="scss">
.filter-input .v-field__input {
  min-height: 56px;
}

.base-table {
  border: 1px solid rgb(var(--v-theme-borderColor)) !important;
}

.custom-table {
  & .v-pagination__list {
    justify-content: end !important;
  }
}

.tree-table {
  border: 1px solid var(--p-treetable-body-cell-border-color);
  border-bottom: none;
  border-radius: 8px;
  overflow: hidden;
}

.p-treetable-header-cell {
  &:not(:last-child) {
    border-right: 1px solid var(--p-treetable-body-cell-border-color);
  }
  background-color: #E0ECE9 !important;
}

.p-treetable-row-selected {
  background-color: rgb(var(--v-theme-lightprimary)) !important;
  color: black !important;
}

.p-treetable-tbody tr {
  cursor: pointer;
}

.custom-table .p-paginator {
  justify-content: end;
}
</style>

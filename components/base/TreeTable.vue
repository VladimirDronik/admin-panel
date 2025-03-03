<script setup lang="ts">
// Builtin modules
import { ref, watch, computed } from 'vue';
import moment from 'moment';
import _, { isArray } from 'lodash';
import { useRoute } from 'vue-router';
// Types
import type { TreeTableSelectionKeys } from 'primevue';
import type { Filter, Header } from '@/types/MainTypes';

// Composables
const route = useRoute();

// Declare Options

const props = withDefaults(defineProps<{
  total?: number,
  items?: any[],
  perPage?: number,
  headers?: Header[],
}>(), {
  total: 0,
  perPage: 0,
  items: undefined,
  headers: undefined,
});

const emit = defineEmits<{
  (e: 'update', params: any): void
  (e: 'created', getData: () => void): void
  (e: 'click-row', item: any): void
}>();

const page = defineModel<number>('page', {
  required: true,
});

const selectedKey = defineModel<TreeTableSelectionKeys | undefined>('selectedKey', {
  default: [],
});

const filters = defineModel<Filter[]>('filters', {
  required: true,
});

// Variables
const isUpdate = ref(false);

// const expandedKeys = ref<TreeTableSelectionKeys | undefined>({});

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

// watch(() => props.total, () => {
//   Array.from(Array(props.total).keys()).forEach((key) => {
//     if (expandedKeys.value) expandedKeys.value[key] = true;
//   });
// }, {
//   immediate: true,
// });

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

emit('created', filter);

defineExpose({
  filter,
});

</script>

<template>
  <div class="custom-table">
    <Paginator
      v-if="total > perPage"
      v-model:first="page"
      data-test="pagination"
      :rows="1"
      :total-records="Math.ceil(total / perPage)"
    />

    <SharedUILoader :is-update="isUpdate">
      <TreeTable
        v-model:filters="filters"
        v-model:page="page"
        class="tree-table"
        data-key="key"
        selection-keys="selectedKey"
        selection-mode="single"
        :value="items"
        @node-select="(item: any) => emit('click-row', item)"
      >
        <slot />
        <template #empty>
          <div class="tw-flex tw-justify-center">
            Нет данных
          </div>
        </template>
      </TreeTable>
    </SharedUILoader>
  </div>
</template>

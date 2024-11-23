<script lang="ts" setup>
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
import type { Filter } from '@/types/MainTypes';

interface Header {
  label: string;
  code: string;
}

// Composables
const route = useRoute();

// Declare Options
const page = defineModel<number>('page', {
  default: 1,
});

const filters = defineModel<Filter[]>('filters', {
  default: [],
});

const props = defineProps({
  total: {
    type: Number,
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
const isUpdate = ref(false);
const isActiveFilters = ref(false);

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
watch(filterValueList, filter);

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

</script>

<template>
  <div>
    <Paginator
      v-if="total > perPage"
      :rows="1"
      :totalRecords="Math.ceil(total / perPage)"
      v-model:first="page"
      data-test="pagination"
    />
    <SharedUILoader :isUpdate="isUpdate">
      <DataTable
        @nodeSelect="(item: any) => emit('click-row', item)"
        :value="items"
        :headers="headers"
      >
        <Column
          v-for="item in headers"
          :field="item.code"
          :header="item.label"
          :key="item.code"
        />
        <slot />
        <template #empty>
          <div class="tw-flex tw-justify-center">
            Нет данных
          </div>
        </template>
      </DataTable>
    </SharedUILoader>
  </div>
</template>

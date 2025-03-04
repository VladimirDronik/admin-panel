<script lang="ts" setup>
// Builtin modules
import { useRoute } from 'vue-router';
import moment from 'moment';
import _, { isArray } from 'lodash';
// Types modules
import type { Filter } from '@/types/MainTypes';

// Types
interface Header {
  label: string;
  code: string;
}

// Composables
const route = useRoute();

// Declare Options
const props = withDefaults(defineProps<{
  total?: number,
  items?: any[],
  perPage?: number,
  isClickable?: boolean,
  headers?: Header[],
}>(), {
  total: 0,
  perPage: 0,
  items: undefined,
  isClickable: false,
  headers: undefined,
});

const emit = defineEmits<{
  (e: 'update', params: any): void
  (e: 'created', getData: () => void): void
  (e: 'click-row', item: any): void
}>();

const page = defineModel<number>('page', {
  default: 1,
});

const filters = defineModel<Filter[]>('filters', {
  default: [],
});

// Variables
const isUpdate = ref(false);

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

emit('created', filter);

defineExpose({
  filter,
});

</script>

<template>
  <div>
    <Paginator
      v-if="total > perPage"
      v-model:first="page"
      data-test="pagination"
      :rows="1"
      :total-records="Math.ceil(total / perPage)"
    />
    <SharedUILoader :is-update="isUpdate">
      <DataTable
        :class="{ clickable: isClickable }"
        :headers="headers"
        :value="items"
        @row-click="(item: any) => emit('click-row', item)"
      >
        <Column
          v-for="item in headers"
          :key="item.code"
          :field="item.code"
          :header="item.label"
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

<style>
.clickable tr {
  transition: background-color .2s linear;
  cursor: pointer;
}

.clickable tr:hover {
  background-color: var(--p-primary-100);
}

.p-dark .clickable tr:hover {
  background-color: #1b362f;
}

</style>

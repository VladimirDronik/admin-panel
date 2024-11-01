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
    <v-row class="!tw-mb-1" v-if="false" data-test="bar">
      <v-col
        v-if="filters.length || total > perPage"
        cols="12"
        lg="6"
      >
        <v-btn
          v-if="filters.length"
          @click="isActiveFilters = !isActiveFilters"
          icon="mdi-filter"
          color="primary"
          variant="outlined"
          data-test="filter-btn"
        />
      </v-col>
      <v-col
        v-if="total > perPage"
        cols="12"
        lg="6"
      >
        <v-pagination
          v-model="page"
          :length="Math.ceil(total / perPage)"
          color="primary"
          class="tw-w-full"
          rounded="circle"
          data-test="pagination"
        />
      </v-col>
    </v-row>

    <AnimationTransitionHeight :duration="400">
      <div
        v-if="isActiveFilters"
        class="tw-mb-3"
        data-test="filters"
      >
        <v-card
          class="tw-relative !tw-z-40 !tw-hidden !tw-overflow-visible !tw-p-3 md:!tw-block"
          elevation="10"
        >
          <v-row class="!tw-pb-3 !tw-pr-3">
            <v-col
              v-for="filter in filters"
              :key="filter.key"
              md="6"
              lg="4"
              cols="12"
              class="!tw-pb-0 !tw-pr-0"
              data-test="filter"
            >
              <VueEasyDatePicker
                v-if="filter.key === 'time'"
                v-model="filter.value"
                :max-date="new Date()"
                class="tw-w-full"
                range
                time-picker-inline
              />
              <v-autocomplete
                v-else-if="filter.options"
                v-model="filter.value"
                :items="filter.options"
                :label="filter.label"
                color="primary"
                variant="outlined"
                chips
                multiple
                clearable
                hide-details
                closable-chips
              />
              <v-text-field
                v-else
                v-model="filter.value"
                :label="filter.label"
                class="filter-input tw-h-full"
                variant="outlined"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card>
        <div class="tw-block md:tw-hidden">
          <v-row class="!tw-pb-3 !tw-pr-3">
            <v-col
              v-for="filter in filters"
              :key="filter.key"
              cols="12"
              lg="4"
              md="6"
              class="!tw-pb-0 !tw-pr-0"
            >
              <VueEasyDatePicker
                v-if="filter.key === 'time'"
                v-model="filter.value"
                :max-date="new Date()"
                class="tw-w-full"
                range
                time-picker-inline
              />
              <v-autocomplete
                v-else-if="filter.options"
                v-model="filter.value"
                :items="filter.options"
                :label="filter.label"
                color="primary"
                variant="outlined"
                chips
                multiple
                clearable
                hide-details
                closable-chips
              />
              <v-text-field
                v-else
                v-model="filter.value"
                :label="filter.label"
                class="filter-input tw-h-full"
                hide-details
              />
            </v-col>
          </v-row>
        </div>
      </div>
    </AnimationTransitionHeight>

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
</style>

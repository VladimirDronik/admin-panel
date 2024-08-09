<script setup lang="ts">
// Builtin modules
import {
  type PropType, ref, watch, computed,
} from 'vue';
import { useRoute } from 'vue-router';
// External modules
import moment from 'moment';
import _, { isArray } from 'lodash';
// Types
import type { Header } from 'vue3-easy-data-table';
import type { Filter } from '@/types/MainTypes';
// Components
import BaseLoader from '@/components/base/BaseLoader.vue';
import TransitionHeight from '@/components/animation/TransitionHeight.vue';

// Composables
const route = useRoute();

// Declare Options
const page = defineModel<number>('page', {
  required: true,
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
const isUpdate = ref(false);
const isActiveFilters = ref(false);

// Computed Properties
const filterValueList = computed(() => filters.value.map((item) => (item.value)));

// Methods
const filter = _.debounce(() => {
  isUpdate.value = true;

  const params: any = {};
  filters.value.forEach((item) => {
    if (item.key === 'time' && item.value) {
      if (isArray(item.value) && item.value.length > 2) [params.dateFrom, params.dateTo] = [moment(item.value[0]).unix(), moment(item.value[1]).unix()];
    } else if (item.value) params[item.key] = item.value;
  });
  page.value = 1;
  emit('update', params);

  isUpdate.value = false;
}, 700);

const pagination = () => {
  isUpdate.value = true;

  const params: any = {};
  filters.value.forEach((item) => {
    if (item.key === 'time' && item.value) {
      if (isArray(item.value)) [params.dateFrom, params.dateTo] = [moment(item.value[0]).unix(), moment(item.value[1]).unix()];
    } else if (item.value) params[item.key] = item.value;
  });
  if (page.value > 1) params.offset = props.perPage * (page.value - 1);
  emit('update', params);

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

defineExpose({
  filter,
  pagination
});

// Created
emit('created', filter);
</script>

<template>
  <div>
    <v-row class="!tw-mb-1">
      <v-col
        cols="12"
        lg="6"
      >
        <v-btn
          @click="isActiveFilters = !isActiveFilters"
          icon="mdi-filter"
          color="primary"
          variant="outlined"
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
        />
      </v-col>
    </v-row>

    <TransitionHeight :duration="400">
      <div
        v-if="isActiveFilters"
        class="tw-mb-3"
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
    </TransitionHeight>

    <BaseLoader :isUpdate="isUpdate">
      <EasyDataTable
        @click-row="(item: any) => emit('click-row', item)"
        :items="items"
        :headers="headers"
        class="tw-shadow"
        table-class-name="customize-table"
        hide-footer
      >
        <template
          v-for="slot of Object.keys($slots)"
          #[slot]="scope"
        >
          <slot
            v-bind="scope"
            :name="slot"
          />
        </template>
      </EasyDataTable>
    </BaseLoader>
  </div>
</template>

<style>
.filter-input .v-field__input {
  min-height: 56px;
}
</style>

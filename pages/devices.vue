<script setup lang="ts">
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { IconFilterFilled, IconSearch } from '@tabler/icons-vue';
// Helpers
import { checkStatusText, checkStatusBackgroundColor } from '~/helpers/rooms';
// Types
import type { Room } from '~/types/RoomsTypes';

// Composables
const { t } = useI18n();
const storeUser = useAuthStore();
const storeRooms = useRoomsStore();
const storeDevices = useDevicesStore();

useHead({
  titleTemplate: computed(() => t('pages.devices')),
});

// Declare Options
definePageMeta({
  middleware: ['auth'],
});

// Variables
const perPage = 10000;

const page = ref(1);

const isUpdate = ref(true);
const isUpdateRightBar = ref(false);
const isActiveRightSidebar = ref(false);

const popoverId = ref();
const popoverTags = ref();
const popoverName = ref();
const popoverType = ref();
const popoverRoom = ref();
const popoverStatus = ref();

const selectedDevice = ref();

// Computed Properties
const headers = computed(() => [
  { text: t('Название'), value: 'name' },
  { text: t('Тип'), value: 'type' },
  { text: t('Протокол'), value: 'protocol' },
  { text: t('IP адрес устройства'), value: 'address' },
  { text: t('Статус'), value: 'state' },
]);

const getTypes = computed(() => storeDevices.types
  .filter((item) => getCategoriesOption.value.includes(item.category))
  .map((item) => ({
    title: item.name,
    props: {
      value: item.type,
    },
  })));

const props = computed(() => {
  if (storeDevices.item?.props) {
    return storeDevices.item.props.map((item) => item.value);
  }
});
const childrenProps = computed(() => {
  if (storeDevices.item?.children) {
    return storeDevices.item?.children.map((item) => item?.props.map((item) => item.value))[0];
  }
});

const tags = computed(() => Object.keys(storeDevices.tags).map((item) => item));

const filters = ref<any[]>([
  {
    label: 'Теги',
    key: 'tags',
    value: [],
    options: tags,
  },
  {
    label: 'ID обьекта',
    key: 'filter_by_id',
    value: null,
  },
  {
    label: 'ID родительского объекта',
    key: 'filter_by_parent_id',
    value: null,
  },
  {
    label: 'Название',
    key: 'filter_by_name',
    value: null,
  },
  {
    label: 'Тип',
    key: 'filter_by_type',
    value: null,
    options: getTypes,
  },
  {
    label: 'Помещения',
    key: 'id',
    value: null,
    options: ['Гостинная', 'Двор'],
  },
  {
    label: 'Статус',
    key: 'filter_by_status',
    value: null,
    options: ['ON', 'OFF', 'Enable', 'N/A'],
  },
]);

const getCategoriesOption: any = computed(() => filters.value.find((item) => item.key === 'filter_by_category')?.value ?? []);

// Methods
const checkRoom = (item: Room | undefined) => {
  if (item) return item.name;
  return '-';
};

const toggleTags = (event: any) => {
  popoverTags.value.toggle(event);
};
const toggleStatus = (event: any) => {
  popoverStatus.value.toggle(event);
};
const toggleId = (event: any) => {
  popoverId.value.toggle(event);
};
const toggleName = (event: any) => {
  popoverName.value.toggle(event);
};
const toggleType = (event: any) => {
  popoverType.value.toggle(event);
};
const toggleRoom = (event: any) => {
  popoverRoom.value.toggle(event);
};

const update = async (params: any = {}) => {
  isUpdate.value = true;
  await storeDevices.getDevicesApi({
    limit: perPage,
    offset: 0,
    ...params,
  });
  isUpdate.value = false;
};

const clickRow = async (item: any) => {
  isUpdateRightBar.value = true;
  isActiveRightSidebar.value = true;
  const data = await storeDevices.getControllerDetailsApi(item.data.id);
  selectedDevice.value = data;
  isUpdateRightBar.value = false;
};

const created = async () => {
  await Promise.all([
    storeDevices.getTypesApi(),
    storeDevices.getTagsApi(),
    storeDevices.getDevicesApi({
      limit: perPage,
      offset: 0,
    }),
  ]);
  isUpdate.value = false;
};

const propsModel = (props: any[] | undefined) => {
  if (!props) return [];
  const result = props.map((item) => ({
    ...item,
    required: {
      func: item.required.func,
      funcText: String(item.required.func),
      value: item.required.func(storeDevices.userAccessLevel, props),
    },
    editable: {
      func: item.editable.func,
      funcText: String(item.editable.func),
      value: item.editable.func(storeDevices.userAccessLevel, props),
    },
    visible: {
      func: item.visible.func,
      funcText: String(item.visible.func),
      value: item.visible.func(storeDevices.userAccessLevel, props),
    },
  }));
  return result;
};

const findRoom = (list: Room[], id: number) => {
  let result = list.find((item) => item.id === id);
  if (result) return result;
  list.forEach((item) => {
    if (item.rooms_in_group) {
      const resultGroups = findRoom(item.rooms_in_group, id);
      if (resultGroups) {
        result = resultGroups;
      }
    }
  });
  if (result) return result;
};

const updateFields = () => {
  if (storeDevices.item) {
    storeDevices.item = {
      ...storeDevices.item,
      props: propsModel(storeDevices.item.props),
      children: storeDevices.item.children?.map((item) => ({
        ...item,
        props: propsModel(item.props) ?? [],
      })),
    };
  }
};

// Watchers
watch([props, childrenProps], (newValue, oldValue) => {
  if (!_.isEqual(newValue, oldValue)) {
    updateFields();
  }
});

</script>

<template>
  <div>
    <BaseBreadcrumb title="pages.devices" :total="storeDevices.total">
      <DialogsDeviceCreateDialog />
    </BaseBreadcrumb>
    <BaseTreeTable
      @update="update"
      @created="created"
      @click-row="clickRow"
      v-model:page="page"
      v-model:filters="filters"
      :total="storeDevices.total"
      :items="storeDevices.getDevices"
      :perPage="perPage"
      :headers="headers"
    >
      <Column field="id" expander style="width: 100px">
        <template #header>
          <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
            <p class="tw-font-semibold">
              {{ t('devices.id') }}
            </p>
            <button @click="toggleId" type="button" class="tree-table__header-filter tw-bg-white">
              <IconSearch class="tw-h-4 tw-w-4 tw-text-slate-400" />
            </button>
            <Popover ref="popoverId">
              <div class="category tw-flex tw-flex-col tw-gap-2 tw-p-2">
                <InputText
                  v-model.number="filters[1].value"
                  :placeholder="filters[1].label"
                  hide-details
                  class="tw-mb-1 tw-min-w-80"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  compact
                  type="number"
                />
                <InputText
                  v-model.number="filters[2].value"
                  :placeholder="filters[2].label"
                  hide-details
                  class="tw-min-w-80"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  type="number"
                />
              </div>
            </Popover>
          </div>
        </template>
      </Column>
      <Column field="name">
        <template #header>
          <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
            <p class="tw-font-semibold">
              {{ t('devices.title') }}
            </p>
            <button @click="toggleName" type="button" class="tree-table__header-filter tw-bg-white">
              <IconSearch class="tw-h-4 tw-w-4 tw-text-slate-400" />
            </button>

            <Popover ref="popoverName">
              <div class="flex flex-col gap-4 category tw-p-2">
                <InputText
                  v-model.number="filters[3].value"
                  :placeholder="filters[3].label"
                  hide-details
                  class="tw-min-w-96"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </div>
            </Popover>
          </div>
        </template>
      </Column>
      <Column field="type">
        <template #header>
          <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
            <p class="tw-font-semibold">
              {{ t('devices.type') }}
            </p>
            <button @click="toggleType" type="button" class="tree-table__header-filter tw-bg-white">
              <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
            </button>

            <Popover ref="popoverType">
              <div class="flex flex-col gap-4 category tw-p-2">
                <InputText
                  v-model.number="filters[4].value"
                  :placeholder="filters[4].label"
                  hide-details
                  class="tw-min-w-80"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </div>
            </Popover>
          </div>
        </template>
      </Column>
      <Column field="address">
        <template #header>
          <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
            <p class="tw-font-semibold">
              {{ t('devices.room') }}
            </p>
            <button @click="toggleRoom" type="button" class="tree-table__header-filter tw-bg-white">
              <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
            </button>

            <Popover ref="popoverRoom">
              <div class="flex flex-col gap-4 category tw-p-2">
                <Select
                  v-model.number="filters[5].value"
                  :placeholder="filters[5].label"
                  :options="filters[5].options"
                  hide-details
                  class="tw-min-w-80"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </div>
            </Popover>
          </div>
        </template>
        <template #body="{ node }">
          {{ checkRoom(findRoom(storeRooms.list, node.data.address)) }}
        </template>
      </Column>
      <Column field="status">
        <template #header>
          <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
            <p class="tw-font-semibold">
              {{ t('devices.status') }}
            </p>
            <button @click="toggleStatus" type="button" class="tree-table__header-filter tw-bg-white">
              <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
            </button>
            <Popover :dismissable="false" ref="popoverStatus">
              <div class="flex flex-col gap-4 category tw-p-2">
                <Select
                  v-model="filters[6].value"
                  :options="filters[6].options"
                  :placeholder="filters[6].label"
                  class="tw-min-w-80"
                  color="primary"
                  hide-details
                />
              </div>
            </Popover>
          </div>
        </template>
        <template #body="{ node }">
          <div
            class="tw-h-2.5 tw-w-2.5 tw-rounded-full"
            :class="checkStatusBackgroundColor(node.data.status)"
          />
          {{ checkStatusText(node.data.status)}}
        </template>
      </Column>
      <Column field="tags" style="width: 200px">
        <template #header>
          <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
            <p class="tw-font-semibold">
              {{ t('devices.tags') }}
            </p>
            <button @click="toggleTags" type="button" class="tree-table__header-filter tw-bg-white">
              <IconFilterFilled class="tw-h-4 tw-w-4" />
            </button>
            <Popover :dismissable="false" ref="popoverTags">
              <div class="flex flex-col gap-4 category tw-p-2">
                <Select
                  v-model="filters[0].value"
                  :options="filters[0].options"
                  :placeholder="filters[0].label"
                  class="tw-min-w-80"
                  color="primary"
                  chips
                  multiple
                  hide-details
                />
              </div>
            </Popover>
          </div>
        </template>
        <template #body="{ node }">
          <div class="tags">
            <ScrollPanel class="tw-max-w-96" aria-orientation="horizontal">
              <div class="tw-flex">
                <Tag
                  v-for="item in node.data.tags"
                  :key="item"
                  severity="warn"
                  class="tw-mr-2 tw-flex"
                >
                  {{ item }}
                </Tag>
              </div>
            </ScrollPanel>
          </div>
        </template>
      </Column>
    </BaseTreeTable>

    <RightSidebarDevices
      v-model:is-update="isUpdateRightBar"
      v-model:is-open="isActiveRightSidebar"
      v-model:form="selectedDevice"
    />
  </div>
</template>

<style>
.tags .ps__rail-x {
  display: none;
}

.tree-table__header-filter {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background .1s linear;
  & svg {
    color: rgb(148 163 184 / var(--tw-text-opacity));
    --tw-text-opacity: 1;
    transition: color .1s linear;
  }

  &:hover, &:focus {
    background-color: rgb(var(--v-theme-primary));
    color: white;

    svg {
      color: white;
    }
  }
}

.p-popover-content {
  padding: 2px !important;
}

.category .v-checkbox-btn {
  max-height: 32px !important;
  min-height: 32px !important;
}

.p-scrollpanel-bar-x {
  display: none !important;
}

.p-scrollpanel-content {
  padding-bottom: 0 !important;
}

</style>

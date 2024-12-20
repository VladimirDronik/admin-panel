<script setup lang="ts">
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import {
  IconCpu2, IconSun, IconHome, IconPlugConnected, IconPlug, IconBolt, IconCloudRain, IconTemperatureSun, IconAlertSquareRounded, IconRun, IconCloudPlus,
} from '@tabler/icons-vue';
// Helpers
import { checkStatusText, checkStatusBackgroundColor } from '~/helpers/main';
// Types
import type { RoomItem } from '~/stores/rooms/roomsTypes';
import type { FullDevice } from '~/stores/devices/devicesTypes';
import type { Filter, Options } from '~/types/MainTypes';

// Composables
const { t } = useI18n();
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

const iconMap = {
  mega_d: IconCpu2,
  bh1750: IconSun,
  outdoor: IconHome,
  generic_input: IconPlugConnected,
  relay: IconPlug,
  cs: IconBolt,
  bme280: IconCloudRain,
  ds18b20: IconTemperatureSun,
  scd4x: IconAlertSquareRounded,
  motion: IconRun,
  htu21d: IconCloudPlus,
} as const;

type IconMapKey = keyof typeof iconMap;

const perPage = 10000;

const page = ref(1);

const typeOptions = ref<Options[]>([]);

const isUpdate = ref(true);
const isOpen = ref(false);

const selectedObject = ref<FullDevice>();

// Computed Properties
const props = computed(() => {
  if (selectedObject.value?.props) {
    return selectedObject.value.props.map((item) => item.value);
  }
});
const childrenProps = computed(() => {
  if (selectedObject.value?.children) {
    return selectedObject.value?.children.map((item) => item?.props?.map((item) => item.value))[0];
  }
});

const tags = computed<(Options | string)[]>(() => {
  if (storeDevices.tags?.data?.response) return Object.keys(storeDevices.tags?.data?.response).map((item) => item);
  return [];
});

const filters = ref<Filter[]>([
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
    options: typeOptions.value,
  },
  {
    label: 'Помещения',
    key: 'id',
    value: null,
  },
  {
    label: 'Статус',
    key: 'filter_by_status',
    value: null,
    options: ['ON', 'OFF', 'Enable', 'N/A'],
  },
  {
    label: 'Теги',
    key: 'tags',
    value: null,
    options: tags.value,
  },
]);

const getCategoriesOption: any = computed(() => filters.value.find((item) => item.key === 'filter_by_category')?.value ?? []);

// Methods
const checkRoom = (item: RoomItem | undefined) => {
  if (item) return item.name;
  return '-';
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
  if (selectedObject.value?.id === item.data.id && isOpen.value) return;
  isOpen.value = true;
  selectedObject.value = item.data;
};

const created = async () => {
  storeRooms.getRoomsApi();
  storeDevices.getTypesApi();
  storeDevices.getTagsApi();
  await Promise.all([
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

const findRoom = (list: RoomItem[] | undefined, id: number) => {
  if (!list) return;
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
  if (selectedObject.value) {
    selectedObject.value = {
      ...selectedObject.value,
      props: propsModel(selectedObject.value.props),
      children: selectedObject.value.children?.map((item) => ({
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

watchEffect(() => {
  typeOptions.value = storeDevices.types?.data?.response
    .filter((item) => getCategoriesOption.value.includes(item.category))
    .map((item) => ({
      title: item.name,
      props: {
        value: item.type,
      },
    })) ?? [];
});

</script>

<template>
  <SharedUIPanel :is-update="isUpdate">
    <SharedUIBreadcrumb title="pages.devices" :total="storeDevices.total">
      <DialogsDeviceCreateDialog />
    </SharedUIBreadcrumb>
    <BaseTreeTable
      @update="update"
      @created="created"
      @click-row="clickRow"
      v-model:page="page"
      v-model:filters="filters"
      :total="storeDevices.total"
      :items="storeDevices.getDevices"
      :perPage="perPage"
    >
      <Column expander>
        <!-- <template #header>
          <DevicesTableHeader title="devices.id">
            <InputText
              v-model.number="filters[0].value"
              :placeholder="filters[0].label"
              hide-details
              class="tw-mb-1 tw-min-w-80"
              prepend-inner-icon="mdi-magnify"
              clearable
              compact
              type="number"
            />
            <InputText
              v-model.number="filters[1].value"
              :placeholder="filters[1].label"
              hide-details
              class="tw-min-w-80"
              prepend-inner-icon="mdi-magnify"
              clearable
              type="number"
            />
          </DevicesTableHeader>
        </template> -->
      </Column>
      <Column field="name">
        <template #header>
          <DevicesTableHeader title="devices.title">
            <InputText
              v-model.number="filters[2].value"
              :placeholder="filters[2].label"
              hide-details
              class="tw-min-w-96"
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </DevicesTableHeader>
        </template>
        <template #body="{ node }">
          <component
            :is="iconMap[node.data.type as IconMapKey]"
            size="24"
            stroke-width="1.5"
            color="#555"
          />
          <p class="tw-max-w-48 tw-truncate">
            {{ node.data.name }}
          </p>
        </template>
      </Column>
      <Column field="type">
        <template #header>
          <DevicesTableHeader title="devices.type">
            <InputText
              v-model.number="filters[3].value"
              :placeholder="filters[3].label"
              hide-details
              class="tw-min-w-80"
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </DevicesTableHeader>
        </template>
      </Column>
      <Column v-if="!isOpen" field="address">
        <template #header>
          <DevicesTableHeader title="devices.room">
            <Select
              v-model.number="filters[4].value"
              :placeholder="filters[4].label"
              :options="storeRooms.getRoomsSelect"
              optionLabel="name"
              optionValue="code"
              class="tw-min-w-80"
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
            />
          </DevicesTableHeader>
        </template>
        <template #body="{ node }">
          {{ checkRoom(findRoom(storeRooms.apiRooms?.data?.response, node.data.address)) }}
        </template>
      </Column>
      <Column v-if="!isOpen" field="status">
        <template #header>
          <DevicesTableHeader title="devices.status">
            <Select
              v-model="filters[5].value"
              :options="filters[5].options"
              :placeholder="filters[5].label"
              class="tw-min-w-80"
              color="primary"
              hide-details
            />
          </DevicesTableHeader>
        </template>
        <template #body="{ node }">
          <div
            class="tw-h-2.5 tw-w-2.5 tw-rounded-full"
            :class="checkStatusBackgroundColor(node.data.status)"
          />
          {{ checkStatusText(node.data.status)}}
        </template>
      </Column>
      <Column v-if="!isOpen" field="tags" style="width: 200px">
        <template #header>
          <DevicesTableHeader title="devices.tags">
            <Select
              v-model="filters[6].value"
              :options="filters[6].options"
              :placeholder="filters[6].label"
              class="tw-min-w-80"
              color="primary"
              chips
              multiple
              hide-details
            />
          </DevicesTableHeader>
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
                  <p class="tw-font-normal">
                    {{ item }}
                  </p>
                </Tag>
              </div>
            </ScrollPanel>
          </div>
        </template>
      </Column>
    </BaseTreeTable>

    <template #rightbar>
      <RightBarDevices
        v-model:is-open="isOpen"
        v-model:selectedObject="selectedObject"
      />
    </template>
  </SharedUIPanel>
</template>

<style lang="scss">
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
    background-color: var(--p-primary-color);
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

.p-treetable-body-cell-content.p-treetable-body-cell-content-expander {
  margin-right: -20px !important;
}

[data-level="1"] .p-treetable-toggler {
  margin-left: 20px;
}

[data-level="2"] .p-treetable-toggler {
  margin-left: 20px;
}

</style>

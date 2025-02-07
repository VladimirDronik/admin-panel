<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import {
  IconCpu2, IconCpu, IconSun, IconHome, IconPlugConnected, IconPlug, IconBolt, IconCloudRain, IconTemperatureSun, IconAlertSquareRounded, IconRun, IconCloudPlus, IconToggleRightFilled, IconCurrency, IconAirConditioning,
} from '@tabler/icons-vue';
// Helpers modules
import { checkStatusText, checkStatusSymbol } from '~/helpers/main';
// Types modules
import type { RoomItem } from '~/stores/rooms/roomsTypes';
import type { FullDevice } from '~/stores/devices/devicesTypes';
import type { Filter, Options } from '~/types/MainTypes';
import type { TreeTableDevices } from '~/types/DevicesTypes';
import { Conditioner } from '~/types/DevicesEnums';

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
  regulator: IconToggleRightFilled,
  modbus: IconCpu,
  wb_mrm2_mini: IconCurrency,
  ...Object.fromEntries(
    Object.values(Conditioner)
      .filter((value) => typeof value === 'string')
      .map((type) => [type, IconAirConditioning]),
  ),
} as const;

type IconMapKey = keyof typeof iconMap;

const perPage = 10000;

const page = ref(1);

const isUpdate = ref(true);
const isOpen = ref(false);

provide('isOpen', isOpen);

const selectedObject = ref<FullDevice>();

// Computed Properties
const typeOptions = computed(() => {
  if (!storeDevices.tags?.data?.response) return [];
  return Object.keys(storeDevices.tags?.data?.response) ?? [];
});

const props = computed(() => {
  if (selectedObject.value?.props) {
    return selectedObject.value.props.map((item) => item.value);
  }
  return [];
});

const childrenProps = computed(() => {
  if (selectedObject.value?.children) {
    return selectedObject.value?.children.map((item) => item?.props?.map((item) => item.value))[0];
  }
  return [];
});

const tags = computed<(Options | string)[]>(() => {
  if (storeDevices.tags?.data?.response) return Object.keys(storeDevices.tags?.data?.response).map((item) => item);
  return [];
});

const filters = ref<Filter[]>([
  { label: 'ID обьекта', key: 'filter_by_id', value: null },
  { label: 'ID родительского объекта', key: 'filter_by_parent_id', value: null },
  { label: 'Название', key: 'filter_by_name', value: null },
  { label: 'Тип', key: 'filter_by_type', value: null },
  { label: 'Помещения', key: 'filter_by_zone_id', value: null },
  {
    label: 'Статус',
    key: 'filter_by_status',
    value: null,
    options: [
      { title: 'Доступен', value: 'available' },
      { title: 'Недоступен', value: 'unavailable' },
      { title: 'Неопределён', value: 'N/A' },
      { title: 'Отключен', value: 'disabled' },
    ],
  },
  {
    label: 'Теги', key: 'tags', value: null, options: tags.value,
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

function processDevices(arr: TreeTableDevices[], depth = 1): TreeTableDevices[] {
  return arr.map((obj) => {
    if (obj.children) {
      obj.children = processDevices(obj.children, depth + 1);

      if (depth === 3 && obj.children.length > 0) {
        return obj.children.map((child) => ({
          ...child,
          data: {
            ...child.data,
            name: `${child.data.name} (${obj.data.name})`,
            paddingLeft: `${depth * 20}px`,
          },
        }));
      }
      // if (depth >= 3) {
      //   obj.data.hidden = true;
      // }
    }
    obj.data = {
      ...obj.data,
      ...(depth > 1 && { paddingLeft: `${depth * 20}px` }),
    };

    return obj;
  }).flat();
}

const processedDevices = computed(() => {
  const result = processDevices(storeDevices.getDevices ?? []);
  return result;
});

</script>

<template>
  <SharedUIPanel :is-update="isUpdate">
    <SharedUIBreadcrumb
      title="pages.devices"
      :total="storeDevices.total"
    >
      <DeviceDialogCreate />
    </SharedUIBreadcrumb>
    <BaseTreeTable
      v-model:filters="filters"
      v-model:page="page"
      :items="processedDevices"
      :per-page="perPage"
      :total="storeDevices.total"
      @click-row="clickRow"
      @created="created"
      @update="update"
    >
      <Column
        expander
        style="width: 15px;"
      >
        <!-- <template #header>
          <DeviceTableHeader title="devices.id">
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
          </DeviceTableHeader>
        </template> -->
      </Column>
      <Column field="name">
        <template #header>
          <DeviceTableHeader title="devices.title">
            <InputText
              v-model.number="filters[2].value"
              class="tw-min-w-96"
              hide-details
              :placeholder="filters[2].label"
              prepend-inner-icon="mdi-magnify"
            />
          </DeviceTableHeader>
        </template>
        <template #body="{ node }">
          <span :style="{ paddingLeft: node.data.paddingLeft }" />
          <component
            :is="iconMap[node.data.type as IconMapKey]"
            color="#555"
            size="24"
            stroke-width="1.5"
          />
          <p class="tw-max-w-48 tw-truncate">
            {{ node.data.name }}
          </p>
        </template>
      </Column>
      <Column field="type">
        <template #header>
          <DeviceTableHeader title="devices.type">
            <InputText
              v-model.number="filters[3].value"
              class="tw-min-w-80"
              hide-details
              :placeholder="filters[3].label"
              prepend-inner-icon="mdi-magnify"
            />
          </DeviceTableHeader>
        </template>
      </Column>
      <Column
        v-if="!isOpen"
        field="address"
      >
        <template #header>
          <DeviceTableHeader title="devices.room">
            <Select
              v-model.number="filters[4].value"
              class="tw-min-w-80"
              option-label="name"
              option-value="code"
              :options="storeRooms.getRoomsSelect"
              :placeholder="filters[4].label"
              prepend-inner-icon="mdi-magnify"
              show-clear
            />
          </DeviceTableHeader>
        </template>
        <template #body="{ node }">
          {{ checkRoom(findRoom(storeRooms.apiRooms?.data?.response, node.data.address)) }}
        </template>
      </Column>
      <Column
        v-if="!isOpen"
        field="status"
      >
        <template #header>
          <DeviceTableHeader title="devices.status">
            <Select
              v-model="filters[5].value"
              class="tw-min-w-80"
              color="primary"
              :option-label="'title'"
              :option-value="'value'"
              :options="filters[5].options"
              :placeholder="filters[5].label"
              show-clear
            />
          </DeviceTableHeader>
        </template>
        <template #body="{ node }">
          <div :class="checkStatusSymbol(node.data.status).class">
            {{ checkStatusSymbol(node.data.status).symbol }}
          </div>
          {{ checkStatusText(node.data.status) }}
        </template>
      </Column>
      <Column
        v-if="!isOpen"
        field="tags"
        style="width: 200px"
      >
        <template #header>
          <DeviceTableHeader title="devices.tags">
            <Select
              v-model="filters[6].value"
              chips
              class="tw-min-w-80"
              color="primary"
              multiple
              :options="typeOptions"
              :placeholder="filters[6].label"
              show-clear
            />
          </DeviceTableHeader>
        </template>
        <template #body="{ node }">
          <div class="tags">
            <ScrollPanel
              aria-orientation="horizontal"
              class="tw-max-w-96"
            >
              <div class="tw-flex">
                <Tag
                  v-for="item in node.data.tags"
                  :key="item"
                  class="tw-mr-2 tw-flex"
                  severity="warn"
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
        v-model:selected-object="selectedObject"
      />
    </template>
  </SharedUIPanel>
</template>

<style lang="scss">
.tags .ps__rail-x {
  display: none;
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
  margin-right: -80px !important;
}

.hidden {
  display: none;
}

tr[aria-level="2"] .p-treetable-node-toggle-button {
  margin-left: 50px !important;
}

tr[aria-level="1"] .p-treetable-node-toggle-button {
  margin-left: 5px !important;
}

// tr[aria-level="1"]:not([aria-expanded]) td:nth-child(2) .p-treetable-body-cell-content {
//   margin-left: -33px;
// }

</style>

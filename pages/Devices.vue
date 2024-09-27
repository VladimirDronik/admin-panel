<script setup lang="ts">
// Builtin modules
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
// Types
import { IconFilterFilled } from '@tabler/icons-vue';
import type { Filter, Options } from '@/types/MainTypes';

// Composables
const { t } = useI18n();
const storeUser = useAuthStore();
const storeRooms = useRoomsStore();
const storeDevices = useDevicesStore();

interface Room {
  id: number
  is_group: boolean
  rooms_in_group?: Room[]
  sort: number
  style: string
  name: string
}

definePageMeta({
  middleware: ['auth'],
});

const { width } = useDisplay();

// Variables
const perPage = 10000;

const page = ref(1);
const tab = ref(true);
const isUpdate = ref(true);
const isUpdateRightBar = ref(false);

const popoverCategory = ref();
const popoverId = ref();
const popoverName = ref();
const popoverType = ref();
const popoverRoom = ref();
const popoverStatus = ref();

const selectedItemId = ref(null);

// Computed Properties
const headers = computed(() => [
  { text: t('Название'), value: 'name' },
  { text: t('Тип'), value: 'type' },
  { text: t('Протокол'), value: 'protocol' },
  { text: t('IP адрес устройства'), value: 'address' },
  { text: t('Статус'), value: 'state' },
]);

const getTypes = computed<Options>(() => storeDevices.types
  .filter((item) => getCategoriesOption.value.includes(item.category))
  .map((item) => ({
    title: item.name,
    props: {
      value: item.type,
    },
  })));

const filters = ref<Filter[]>([
  {
    label: 'Категории',
    key: 'filter_by_category',
    value: ['controller', 'sensor'],
    options: ['controller', 'sensor'],
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
]);

const checkRoom = (item: Room | undefined) => {
  if (item) return item.name;
  return '-';
};

const toggleCategory = (event: any) => {
  popoverCategory.value.toggle(event);
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

const getCategoriesOption = computed<any[]>(() => filters.value.find((item) => item.key === 'filter_by_category')?.value ?? []);

// Methods
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
  storeUser.isActiveRightSidebar = true;
  selectedItemId.value = item.data.id;
  await storeDevices.getControllerDetailsApi(item.data.id);
  isUpdateRightBar.value = false;
};

const created = async () => {
  await Promise.all([
    storeDevices.getTypesApi(),
    storeDevices.getDevicesApi({
      limit: perPage,
      offset: 0,
    }),
  ]);
  isUpdate.value = false;
};
</script>

<template>
  <BaseBreadcrumb title="pages.devices" :total="storeDevices.total">
    <div>
      <v-btn color="primary" class="text-capitalize">
        Добавить устройство
      </v-btn>
    </div>
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
    <Column field="category" expander style="width: 200px">
      <template #header>
        <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
          <p class="tw-font-semibold">
            Категория
          </p>
          <button @click="toggleCategory" type="button" class="tree-table__header-filter tw-bg-slate-200">
            <IconFilterFilled class="tw-h-4 tw-w-4" />
          </button>
          <Popover ref="popoverCategory">
            <div class="flex flex-col gap-4 category tw-pr-3">
              <v-checkbox
                v-model="filters[0].value"
                label="Controller"
                value="controller"
                color="primary"
                hide-details
              />
              <v-checkbox
                v-model="filters[0].value"
                label="Sensor"
                value="sensor"
                color="primary"
                hide-details
              />
            </div>
          </Popover>
        </div>
      </template>
    </Column>
    <Column field="id" style="width: 100px">
      <template #header>
        <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
          <p class="tw-font-semibold">
            ID
          </p>
          <button @click="toggleId" type="button" class="tree-table__header-filter tw-bg-slate-200">
            <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
          </button>
          <Popover ref="popoverId">
            <div class="flex flex-col gap-4 category tw-p-2">
              <v-text-field
                v-model.number="filters[1].value"
                :label="filters[1].label"
                hide-details
                class="tw-mb-1 tw-min-w-80"
                prepend-inner-icon="mdi-magnify"
                clearable
                compact
                type="number"
              />
              <v-text-field
                v-model.number="filters[2].value"
                :label="filters[2].label"
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
            Название
          </p>
          <button @click="toggleName" type="button" class="tree-table__header-filter tw-bg-slate-200">
            <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
          </button>

          <Popover ref="popoverName">
            <div class="flex flex-col gap-4 category tw-p-2">
              <v-text-field
                v-model.number="filters[3].value"
                :label="filters[3].label"
                hide-details
                class="tw-min-w-96"
                prepend-inner-icon="mdi-magnify"
                clearable
                compact
                type="number"
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
            Тип
          </p>
          <button @click="toggleType" type="button" class="tree-table__header-filter tw-bg-slate-200">
            <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
          </button>

          <Popover ref="popoverType">
            <div class="flex flex-col gap-4 category tw-p-2">
              <v-text-field
                v-model.number="filters[4].value"
                :label="filters[4].label"
                hide-details
                class="tw-min-w-80"
                prepend-inner-icon="mdi-magnify"
                clearable
                compact
                type="number"
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
            Помещение
          </p>
          <button @click="toggleRoom" type="button" class="tree-table__header-filter tw-bg-slate-200">
            <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
          </button>

          <Popover ref="popoverRoom">
            <div class="flex flex-col gap-4 category tw-p-2">
              <v-select
                v-model.number="filters[5].value"
                :label="filters[5].label"
                :items="filters[5].options"
                hide-details
                class="tw-min-w-80"
                prepend-inner-icon="mdi-magnify"
                clearable
                compact
                type="number"
              />
            </div>
          </Popover>
        </div>
      </template>
      <template #body="{ node }">
        {{ checkRoom(storeRooms.findRoom(storeRooms.list, node.data.address)) }}
      </template>
    </Column>
    <Column field="status">
      <template #header>
        <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
          <p class="tw-font-semibold">
            Статус
          </p>
          <!-- <button type="button" class="tree-table__header-filter tw-bg-slate-200">
            <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
          </button> -->
        </div>
      </template>
      <template #body="{ node }">
        <div
          class="tw-h-2.5 tw-w-2.5 tw-rounded-full"
          :class="{ 'bg-success': node.data.status === 'ON', 'bg-error': node.data.status !== 'ON' }"
        />
        {{ node.data.status === 'ON' ? 'Вкл' : 'Выкл'}}
      </template>
    </Column>
  </BaseTreeTable>

  <v-navigation-drawer
    v-model="storeUser.isActiveRightSidebar"
    location="right"
    app
    elevation="10"
    :width="width / 3"
  >
    <BaseLoader :isUpdate="isUpdateRightBar">
      <v-card elevation="0" class="tw-min-h-80 tw-p-7">
        <div class="tw-flex tw-items-center tw-justify-between">
          <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
            {{ storeDevices.item?.name }}
          </h3>
          <v-btn @click="storeUser.isActiveRightSidebar = false" icon size="small" variant="text">
            <XIcon class="white" />
          </v-btn>
        </div>
        <v-chip
          class="ma-2 !tw-rounded-lg !tw-px-2 !tw-py-1"
          label
          variant="outlined"
          :color="storeDevices.item?.status === 'ON' ? 'success' : 'error'"
          :class="{ 'bg-lightsuccess': storeDevices.item?.status === 'ON', 'bg-lighterror': storeDevices.item?.status !== 'ON' }"
        >
          <div class="tw-flex tw-items-center">
            <div
              class="tw-mr-4 tw-h-2.5 tw-w-2.5 tw-rounded-full"
              :class="{ 'bg-success': storeDevices.item?.status === 'ON', 'bg-error': storeDevices.item?.status !== 'ON' }"
            />
            <p class="tw-text-black">
              Вкл
            </p>
          </div>
        </v-chip>

        <v-card-text class="!tw-px-0">

          <v-tabs
            v-model="tab"
            color="primary"
          >
            <v-tab value="one">Свойства</v-tab>
            <v-tab value="two" v-if="storeDevices.item?.category === 'controller'">События</v-tab>
            <v-tab value="ports" v-if="storeDevices.item?.category === 'controller'">Порты</v-tab>
            <v-tab value="four" v-if="storeDevices.item?.category === 'controller'">Статистика</v-tab>
          </v-tabs>
          <v-tabs-window v-model="tab">
            <div class="tw-pt-4">
              <v-tabs-window-item value="one">
                <div v-for="item in storeDevices.item?.props" :key="item.code">
                  <div v-if="item.data_type === 'bool'">
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }}
                    </p>
                    <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-rounded tw-border tw-border-black tw-px-4">
                      <p class="tw-py-3 tw-text-base">
                        {{ item.value ? 'Включено' : 'Выключено'}}
                      </p>
                      <!-- <ToggleSwitch v-model="item.value" /> -->
                      <v-switch v-model="item.value" color="primary" hide-details />
                    </div>
                  </div>
                  <div v-else-if="item.data_type === 'enum'">
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }}
                    </p>
                    <v-select v-model="item.value" :items="Object.keys(item.values)" />
                  </div>
                  <div v-else>
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }}
                    </p>
                    <v-text-field v-model="item.value" />
                  </div>
                </div>
                <div v-if="storeDevices.item?.category === 'sensor'">
                  <div class="tw-mb-4" v-for="port in storeDevices.item?.children" :key="port.id">
                    <p class="text-primary tw-mb-2 tw-pt-3 tw-text-2xl tw-font-semibold">
                      {{port.name}}
                    </p>
                    <div class="tw-mb-1" v-for="item in port.props" :key="item.code">
                      <div v-if="item.data_type === 'bool'">
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }}
                        </p>
                        <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-rounded tw-border tw-border-black tw-px-4">
                          <p class="tw-py-3 tw-text-base">
                            {{ item.value ? 'Включено' : 'Выключено'}}
                          </p>
                          <!-- <ToggleSwitch v-model="item.value" /> -->
                          <v-switch v-model="item.value" color="primary" hide-details />
                        </div>
                      </div>
                      <div v-else-if="item.data_type === 'enum'">
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }}
                        </p>
                        <v-select v-model="item.value" :items="Object.keys(item.values)" />
                      </div>
                      <div v-else>
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }}
                        </p>
                        <v-text-field v-model="item.value" :type="item.data_type === 'int' || item.data_type === 'float' ? 'number' : 'text'" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tw-flex tw-justify-end">
                  <v-btn color="success" variant="flat" class="tw-mr-2">
                    Сохранить
                  </v-btn>
                </div>
              </v-tabs-window-item>

              <!-- <v-tabs-window-item value="two">
                <div>
                  <p class="tw-text-lg tw-font-semibold">
                    Изменение статуса объекта
                  </p>
                  <v-checkbox label="вызов метода объекта 2" />
                </div>
                <div>
                  <p class="tw-text-lg tw-font-semibold">
                    Изменение конфига устройства
                  </p>
                  <v-checkbox label="вызов метода объекта 2" />
                </div>
                <div>
                  <p class="tw-text-lg tw-font-semibold">
                    Загрузка устройства после включения
                  </p>
                  <v-checkbox label="вызов метода объекта 2" />
                </div>
              </v-tabs-window-item> -->
            </div>
          </v-tabs-window>

        </v-card-text>
      </v-card>
    </BaseLoader>
  </v-navigation-drawer>
</template>

<style>
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

</style>

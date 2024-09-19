<script setup lang="ts">
// Builtin modules
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
// Types
import type { Filter, Options } from '@/types/MainTypes';

// Composables
const { t } = useI18n();
const storeUser = useAuthStore();
const storeDevices = useDevicesStore();

const { width } = useDisplay();

// Variables
const perPage = 10000;

const page = ref(1);
const tab = ref(true);
const isUpdate = ref(true);
const isUpdateRightBar = ref(false);

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
    label: 'Категории',
    key: 'filter_by_category',
    value: ['controller', 'sensor'],
    options: ['controller', 'sensor'],
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
  <BaseBreadcrumb title="pages.devices" />
  <BaseCard>
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
      <Column field="id" header="ID" expander />
      <Column field="category" header="Категория" />
      <Column field="name" header="Название" />
      <Column field="type" header="Тип" />
      <Column field="address" header="Помещение" />
      <Column field="status" header="Статус" />
    </BaseTreeTable>
  </BaseCard>

  <v-navigation-drawer
    v-model="storeUser.isActiveRightSidebar"
    location="right"
    app
    elevation="10"
    :width="width / 3"
  >
    <BaseLoader :isUpdate="isUpdateRightBar">
      <v-card elevation="0" class="tw-min-h-80">
        <v-card-title class="bg-primary">
          <div class="tw-flex tw-items-center tw-justify-between">
            <p>
              {{ storeDevices.item?.name }}
            </p>
            <div class="tw-flex tw-items-center">
              <p class="tw-text-base">
                {{ storeDevices.item?.category }}
              </p>
              <v-btn @click="storeUser.isActiveRightSidebar = false" icon size="small" variant="text">
                <XIcon class="white" />
              </v-btn>
            </div>
          </div>
        </v-card-title>

        <v-card-text class="!tw-px-0">

          <v-tabs
            v-model="tab"
            bg-color="lightprimary"
          >
            <v-tab value="one">Свойства</v-tab>
            <v-tab value="two" v-if="storeDevices.item?.category === 'controller'">События</v-tab>
            <v-tab value="ports" v-if="storeDevices.item?.category === 'controller'">Порты</v-tab>
            <v-tab value="four" v-if="storeDevices.item?.category === 'controller'">Статистика</v-tab>
          </v-tabs>
          <v-tabs-window v-model="tab">
            <div class="tw-px-4 tw-pt-4">
              <v-tabs-window-item value="one">
                <div v-for="item in storeDevices.item?.props" :key="item.code">
                  <div v-if="item.data_type === 'bool'">
                    <v-switch :label="item.name" color="primary">
                      <template v-slot:label>
                        <p class="tw-text-lg tw-font-semibold">
                          {{item.name}}
                        </p>
                      </template>
                    </v-switch>
                  </div>
                  <div v-else-if="item.data_type === 'enum'">
                    <p class="tw-text-xl tw-font-semibold">
                      {{ item.name }}
                    </p>
                    <v-select :value="item.value" :items="Object.keys(item.values)" />
                  </div>
                  <div v-else>
                    <p class="tw-text-xl tw-font-semibold">
                      {{ item.name }}
                    </p>
                    <v-text-field :value="item.value" />
                  </div>
                </div>
                <div v-if="storeDevices.item?.category === 'sensor'">
                  <div class="tw-mb-4" v-for="port in storeDevices.item?.children" :key="port.id">
                    <p class="tw-mb-2 tw-text-xl tw-font-semibold">
                      {{port.name}}
                    </p>
                    <div class="tw-mb-1" v-for="item in port.props" :key="item.code">
                      <div v-if="item.data_type === 'bool'">
                        <v-switch v-model="item.value" :label="item.name" color="primary">
                          <template v-slot:label>
                            <p class="tw-text-lg tw-font-semibold">
                              {{item.name}}
                            </p>
                          </template>
                        </v-switch>
                      </div>
                      <div v-else-if="item.data_type === 'enum'">
                        <p class="tw-text-lg tw-font-semibold">
                          {{ item.name }}
                        </p>
                        <v-select v-model="item.value" :items="Object.keys(item.values)" />
                      </div>
                      <div v-else>
                        <p class="tw-text-lg tw-font-semibold">
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

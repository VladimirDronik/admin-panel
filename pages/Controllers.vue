<script setup lang="ts">
// Builtin modules
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
// Types
import type { Filter } from '@/types/MainTypes';

// Composables
const { t } = useI18n();
const storeUser = useAuthStore();
const storeControllers = useControllersStore();

const { width } = useDisplay();

// Variables
const perPage = 10;

const page = ref(1);
const tab = ref(true);
const isUpdate = ref(true);
const selectedKey = ref(null);

const filters = ref<Filter[]>([
  {
    label: 'Название',
    key: 'name',
    value: null,
  },
]);

// Computed Properties
const headers = computed(() => [
  { text: t('Название'), value: 'name' },
  { text: t('Тип'), value: 'type' },
  { text: t('Протокол'), value: 'protocol' },
  { text: t('IP адрес устройства'), value: 'address' },
  { text: t('Статус'), value: 'state' },
]);

// Methods
const update = async () => {
  isUpdate.value = true;
  await storeControllers.getControllersApi();
  isUpdate.value = false;
};

const clickRow = async (item: any) => {
  console.log(item.key.length);
  if (item.key.length > 1) storeUser.isActiveRightSidebar = true;
};

const created = async () => {
  await storeControllers.getControllersApi();
  isUpdate.value = false;
};

</script>

<template>
  <BaseBreadcrumb title="pages.controllers" />
  <BaseCard>
    <BaseTreeTable
      @update="update"
      @created="created"
      @click-row="clickRow"
      v-model:page="page"
      v-model:filters="filters"
      :total="storeControllers.total"
      :items="storeControllers.getControllers"
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
    temporary
    elevation="10"
    :width="width / 3"
  >
    <v-card elevation="0">
      <v-card-title class="bg-primary">
        <div class="tw-flex tw-items-center tw-justify-between">
          <p>
            Редактировать Mega 1
          </p>
          <p class="tw-text-base">
            Контроллер
          </p>
        </div>
      </v-card-title>

      <v-card-text class="!tw-px-0">

        <v-tabs
          v-model="tab"
          bg-color="lightprimary"
        >
          <v-tab value="one">Свойства</v-tab>
          <v-tab value="two">События</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <div class="tw-px-4 tw-pt-4">
            <v-tabs-window-item value="one">
              <div>
                <p class="tw-text-lg tw-font-semibold">
                  Название
                </p>
                <v-text-field />
              </div>
              <div>
                <p class="tw-text-lg tw-font-semibold">
                  Тип
                </p>
                <v-text-field />
              </div>
              <div>
                <p class="tw-text-lg tw-font-semibold">
                  Адрес
                </p>
                <v-text-field />
              </div>
              <div>
                <p class="tw-text-lg tw-font-semibold">
                  Пароль
                </p>
                <v-text-field />
              </div>
              <div>
                <p class="tw-text-lg tw-font-semibold">
                  Режим
                </p>
                <v-text-field />
              </div>
              <div class="tw-mb-2">
                <v-btn color="primary" block>
                  Настройка Портов
                </v-btn>
              </div>
              <div class="tw-mb-2">
                <v-btn color="primary" block>
                  Скачать Конфиг
                </v-btn>
              </div>
              <div class="tw-mb-2">
                <v-btn color="primary" block>
                  Загрузить Конфиг
                </v-btn>
              </div>
              <div class="tw-flex tw-justify-end">
                <v-btn color="success" variant="flat" class="tw-mr-2">
                  Сохранить
                </v-btn>
                <v-btn color="error" variant="outlined">
                  Закрыть
                </v-btn>
              </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
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
            </v-tabs-window-item>
          </div>
        </v-tabs-window>

      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

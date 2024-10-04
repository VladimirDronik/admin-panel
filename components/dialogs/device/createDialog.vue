<script setup lang="ts">
import _ from 'lodash';

const dialog = defineModel({
  default: false,
});

// Composables
const storeDevices = useDevicesStore();

// Computed properties
const types = computed(() => _.uniq(_.map(_.filter(storeDevices.types, ['category', category.value]), 'type')));
const categories = computed(() => _.uniq(_.map(storeDevices.types, 'category')));

// Variables
const type = ref<string | null>(null);
const category = ref('controller');
const loading = ref(false);

const form = ref({});

// Methods
const createDevice = async () => {
  loading.value = true;
  await storeDevices.createDeviceApi(form.value);
  loading.value = false;
};

// Watchers
watch(type, async () => {
  if (type.value && category.value) {
    loading.value = true;
    await storeDevices.getModelApi({
      type: type.value,
      category: category.value,
    });
    loading.value = false;
  }
});
watch(category, async () => {
  type.value = null;
  if (type.value && category.value) {
    loading.value = true;
    await storeDevices.getModelApi({
      type: type.value,
      category: category.value,
    });
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1200">
      <template v-slot:button>
        <v-btn color="primary" class="text-capitalize" @click="dialog = true">
          Добавить устройство
        </v-btn>
      </template>

      <p class="tw-mb-4  tw-text-center tw-text-2xl">
        Добавление нового устройства
      </p>

      <div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Название
          </p>
          <v-text-field />
        </div>
        <div>
          <p class="tw-mb-1.5 tw-text-lg">
            Категория
          </p>
          <v-select :items="categories" v-model="category" />
        </div>
        <div class="tw-mb-2">
          <p class="tw-mb-1.5 tw-text-lg">
            Тип
          </p>
          <v-select :items="types" v-model="type" />
        </div>
        <v-divider class="border-opacity-100 tw-mb-3 !tw-border-black" />
        <div v-if="storeDevices.model">
          <div v-for="item in storeDevices.model.props" :key="item.code">
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
        </div>
        <div v-else>
          <p class="tw-text-center tw-text-xl">
            Выберите Категорию и Тип
          </p>
        </div>
        <div class="tw-flex tw-justify-end">
          <v-btn color="error" class="tw-mr-2" variant="text" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="success" @click="createDevice">
            Создать
          </v-btn>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

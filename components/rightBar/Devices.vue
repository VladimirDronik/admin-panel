<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { checkStatusTextSmall, checkStatusBackgroundColor, checkStatusColor } from '~/helpers/main';
// Types
import { TablePortListSchema, type TablePortData, FullDevice } from '~/stores/devices/devicesTypes';
import type { APIData } from '~/types/StoreTypes';

// Static Data modules
import { objectManager, paths } from '~/staticData/endpoints';

import type {
  ModelProps, Devices,
} from '~/types/DevicesTypes';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeDevices = useDevicesStore();

// Variables
const name = ref('');

const tabs = ref('features');

const dialog = ref(false);

const active = ref(false);

const loading = ref(false);
const loadingDelete = ref(false);

const apiPorts = ref<APIData<TablePortData[]>>();
const apiDevice = ref<APIData<any>>();

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const selectedObject = defineModel<FullDevice | undefined>('selectedObject', {
  required: true,
});

const createFunction = (functionBody: string, props = {}) => {
  const func = new Function('userAccessLevel', 'props', functionBody);
  return {
    func,
    funcText: String(func),
    value: func(4, props),
  };
};

const propsModel = (props: ModelProps | undefined): ModelProps[] => {
  if (!props) return [];
  const result = Object.values(props).map((item) => ({
    ...item,
    required: item.required ? createFunction(item.required, props) : false,
    editable: item.editable ? createFunction(item.editable, props) : false,
    visible: item.visible ? createFunction(item.visible, props) : false,
  }));
  return result;
};

const form = ref();

watchEffect(() => {
  const result = {
    ...apiDevice.value?.data?.response,
    props: propsModel(apiDevice.value?.data?.response.props),
    children: apiDevice.value?.data?.response.children?.map((item: any) => ({
      ...item,
      props: propsModel(item.props) ?? [],
    })),
  };

  form.value = result;
});

// Methods
const confirmDelete = async () => {
  loadingDelete.value = true;
  if (storeDevices.object?.id) {
    const id = storeDevices.object?.id;
    await updateData({
      update: async () => {
        await storeDevices.deleteDeviceApi(id);
        await storeDevices.getDevicesApi({
          limit: 10000,
          offset: 0,
        });
      },
      success: () => {
        dialog.value = false;
        isOpen.value = false;
      },
      successMessage: 'Устройство удалено',
      errorMessage: 'Ошибка удаления устройства',
    });
  }
  loadingDelete.value = false;
};

const changeDevice = async () => {
  loading.value = true;
  if (form.value) {
    const params = {
      ...form.value,
      name: name.value,
    };
    await updateData({
      update: async () => {
        await storeDevices.changeDeviceApi(params);
      },
      successMessage: 'Устройство обновленно',
      errorMessage: 'Ошибка обновления устройства',
    });
  }
  loading.value = false;
};

const updateName = () => {
  if (form.value) name.value = form.value?.name;
};

// Watchers
watch(() => form.value?.name, () => {
  updateName();
  active.value = false;
});

watch(() => form.value?.category, () => {
  tabs.value = 'features';
});

onBeforeMount(async () => {
  const dataDevice: unknown = await useAPI(
    () => `${paths.objects}/${selectedObject.value?.id}`,
    {
      immediate: false,
    },
  );
  apiDevice.value = dataDevice as APIData<any>;

  const dataPorts: unknown = await useAPI(
    () => `${objectManager}/controllers/${selectedObject.value?.id}/ports`,
    {
      immediate: false,
      watch: false,
    },
    TablePortListSchema,
  );

  apiPorts.value = dataPorts as APIData<TablePortData[]>;
});

watch(() => selectedObject.value?.id, () => {
  console.log(selectedObject);
  if (selectedObject.value?.category === 'contoller') apiDevice.value?.refresh();
});

const isUpdate = computed(() => apiPorts.value?.pending && apiDevice.value?.pending);

</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen" :isUpdate="isUpdate">
    <div elevation="0" class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">

        <Inplace v-model:active="active" v-if="form" class="tw-w-full" @open="updateName">
          <template #display>
            <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
              {{ form?.name }}
            </h3>
          </template>
          <template #content="{ closeCallback }">
            <span class=" tw-flex tw-w-full tw-items-center tw-gap-2">
              <InputText
                v-model="name"
                autofocus
                class="tw-min-w-60"
              />
              <Button icon="pi pi-times" text severity="danger" @click="closeCallback" />
              <Button icon="pi pi-save" text severity="success" @click="changeDevice" />
            </span>
          </template>
        </Inplace>
        <Button
          @click="isOpen = false"
          icon="pi pi-times"
          size="small"
          severity="secondary"
          rounded
          text
        />
      </div>
      <Tag
        :severity="checkStatusColor(form?.status)"
        class="tw-ml-3 !tw-rounded-lg"
        outlined
        label
      >
        <div class="tw-flex tw-items-center">
          <div
            class="tw-mr-3 tw-h-2.5 tw-w-2.5 tw-rounded-full"
            :class="checkStatusBackgroundColor(form?.status)"
          />
          <p class="tw-font-normal">
            {{ checkStatusTextSmall(form?.status) }}
          </p>
        </div>
      </Tag>

      <div class="!tw-px-0 !tw-pt-1">

        <Tabs v-model:value="tabs">
          <TabList>
            <Tab value="features">
              <p class="tw-font-normal">
                {{ t('devices.features') }}
              </p>
            </Tab>
            <Tab value="events">
              <p class="tw-font-normal">
                {{ t('devices.events') }}
              </p>
            </Tab>
            <Tab value="ports" v-if="form?.category === 'controller'">
              <p class="tw-font-normal">
                Порты
              </p>
            </Tab>
            <Tab value="four">
              <p class="tw-font-normal">
                {{ t('devices.management') }}
              </p>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="features">

              <DevicesPropertiesForm v-if="form" v-model="form" />

              <div class="tw-flex tw-justify-end">
                <DialogsDeleteDialog
                  @delete="confirmDelete"
                  v-model="dialog"
                  :id="form?.id ?? -1"
                  :loading="loadingDelete"
                  :subtitle="`Вы уверены, что хотите удалить «${form?.name}»`"
                  class="tw-mr-2"
                  title="Удалить категорию"
                />

                <Button
                  :loading="loading"
                  class="tw-mr-2"
                  @click="changeDevice"
                  :label="t('save')"
                />
              </div>
            </TabPanel>
            <TabPanel value="events">
              <div v-if="form">
                <DevicesEventsForm v-model="form" />
              </div>
            </TabPanel>
            <TabPanel value="ports">
              <div v-if="apiPorts?.data?.response">
                <DevicesPortsForm v-model:ports="apiPorts.data.response" :id="storeDevices.object?.id ?? 0" />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </LayoutFullRightbar>
</template>

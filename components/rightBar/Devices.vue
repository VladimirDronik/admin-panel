<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Helper modules
import { checkStatusTextSmall, checkStatusBackgroundColor, checkStatusColor } from '~/helpers/main';
import { updateParamsForApi } from '~/helpers/devices';
// Types
import { TablePortListSchema, type TablePortData, type FullDevice } from '~/stores/devices/devicesTypes';
import type { APIData } from '~/types/StoreTypes';
import type {
  ModelProps,
} from '~/types/DevicesTypes';
// Static Data modules
import { objectManager, paths } from '~/utils/endpoints';
import { deviceEventTypes } from '~/staticData/modelEvents';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeDevices = useDevicesStore();

// Declare Options
const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const selectedObject = defineModel<FullDevice | undefined>('selectedObject', {
  required: true,
});

// Variables
const name = ref('');

const tabs = ref('features');

const active = ref(false);

const dialogDelete = ref(false);

// Apis
const apiPorts = ref<APIData<TablePortData[]>>();

const apiDevice = ref<APIData<any>>();
const apiUpdateDevice = ref<APIData<any>>();
const apiDeleteDevice = ref<APIData<any>>();

const form = ref();

// Computed Properties
const isUpdate = computed(() => apiPorts.value?.pending && apiDevice.value?.pending);

// Methods
const updateName = () => {
  if (form.value) name.value = form.value?.name;
};

const createFunction = (functionBody: string, props = {}) => {
  const func = new Function('userAccessLevel', 'props', functionBody);
  return {
    func,
    funcText: String(func),
    value: func(storeDevices.userAccessLevel, props),
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

const confirmDelete = async () => {
  if (apiDevice.value?.data?.response.id) {
    await updateData({
      update: async () => {
        await apiDeleteDevice.value?.execute();
        await storeDevices.getDevicesApi({
          limit: 10000,
          offset: 0,
        });
      },
      success: () => {
        dialogDelete.value = false;
        isOpen.value = false;
      },
      successMessage: 'Устройство удалено',
      errorMessage: 'Ошибка удаления устройства',
    });
  }
};

const changeDevice = async () => {
  await updateData({
    update: async () => {
      await apiUpdateDevice.value?.execute();
    },
    successMessage: 'Устройство обновленно',
    errorMessage: 'Ошибка обновления устройства',
  });
};

// Watchers
watch(() => form.value?.name, () => {
  updateName();
  active.value = false;
});

watch(() => form.value?.category, () => {
  tabs.value = 'features';
});

watch(() => selectedObject.value?.id, () => {
  if (selectedObject.value?.category === 'controller') apiPorts.value?.refresh();
});

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

onBeforeMount(async () => {
  // Get Device Item
  const dataDevice: unknown = await useAPI(
    () => `${paths.objects}/${selectedObject.value?.id}`,
    {
      immediate: false,
    },
  );
  apiDevice.value = dataDevice as APIData<any>;
  //

  // Update Device
  const dataUpdateDevice: unknown = await useAPI(
    paths.objects,
    {
      body: computed(() => updateParamsForApi({
        ...form.value,
        name: name.value,
      })),
      immediate: false,
      watch: false,
      method: 'PUT',
    },
  );

  apiUpdateDevice.value = dataUpdateDevice as APIData<any>;
  //

  // Delete Device
  const dataDeleteDevice: unknown = await useAPI(
    () => `${paths.objects}/${selectedObject.value?.id}`,
    {
      immediate: false,
      watch: false,
      method: 'DELETE',
    },
  );

  apiDeleteDevice.value = dataDeleteDevice as APIData<any>;
  //

  // Get Port List
  const dataPorts: unknown = await useAPI(
    () => `${objectManager}/controllers/${selectedObject.value?.id}/ports`,
    {
      immediate: false,
      watch: false,
    },
    TablePortListSchema,
  );

  apiPorts.value = dataPorts as APIData<TablePortData[]>;
  //
});
</script>

<template>
  <LayoutFullRightbar :isOpen="isOpen" :isUpdate="isUpdate">
    <div elevation="0" class="tw-min-h-80 tw-p-7">
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <Inplace v-model:active="active" v-if="form" class="tw-w-full" @open="updateName">
          <template #display>
            <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
              {{ form?.name }} ({{ form.type}})
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
        <div class="tw-flex tw-items-center tw-font-normal">
          <div
            class="tw-mr-3 tw-h-2.5 tw-w-2.5 tw-rounded-full"
            :class="checkStatusBackgroundColor(form?.status)"
          />
          {{ checkStatusTextSmall(form?.status) }}
        </div>
      </Tag>

      <Tabs v-model:value="tabs">
        <!-- Header -->
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
              {{ t('devices.ports') }}
            </p>
          </Tab>
          <Tab value="four">
            <p class="tw-font-normal">
              {{ t('devices.management') }}
            </p>
          </Tab>
        </TabList>
        <!--  -->

        <!-- Container -->
        <TabPanels>
          <TabPanel value="features">
            <DevicesDynamicDeviceForm :deviceType="form.type" is-editing>
              <template #footer>
                <div class="tw-mt-4 tw-flex tw-justify-end">
                  <DialogsDeleteDialog
                    @delete="confirmDelete"
                    v-model="dialogDelete"
                    :id="form?.id ?? -1"
                    :loading="apiDeleteDevice?.pending"
                    :subtitle="`Вы уверены, что хотите удалить «${form?.name}»`"
                    class="tw-mr-2"
                    title="Удалить категорию"
                  />

                  <Button
                    :loading="apiUpdateDevice?.pending && apiUpdateDevice.status !== 'idle'"
                    class="tw-mr-2"
                    @click="changeDevice"
                    :label="t('save')"
                  />
                </div>
              </template>
            </DevicesDynamicDeviceForm>
            <!-- <DevicesPropertiesForm v-if="form" v-model="form">
              <template #footer>
                <div class="tw-flex tw-justify-end">
                  <DialogsDeleteDialog
                    @delete="confirmDelete"
                    v-model="dialogDelete"
                    :id="form?.id ?? -1"
                    :loading="apiDeleteDevice?.pending"
                    :subtitle="`Вы уверены, что хотите удалить «${form?.name}»`"
                    class="tw-mr-2"
                    title="Удалить категорию"
                  />

                  <Button
                    :loading="apiUpdateDevice?.pending && apiUpdateDevice.status !== 'idle'"
                    class="tw-mr-2"
                    @click="changeDevice"
                    :label="t('save')"
                  />
                </div>
              </template>
            </DevicesPropertiesForm> -->
          </TabPanel>
          <TabPanel value="events">
            <FormsEventForm
              targetType="object"
              :id="form.id"
              :modelType="form.type"
              :eventTypes="deviceEventTypes"
            />
          </TabPanel>
          <TabPanel value="ports">
            <DevicesPortsForm
              v-if="apiPorts?.data?.response"
              v-model:ports="apiPorts.data.response"
              :id="selectedObject?.id ?? 0"
            />
          </TabPanel>
          <TabPanel value="management">
            Скоро...
          </TabPanel>
        </TabPanels>
        <!--  -->
      </Tabs>
    </div>
  </LayoutFullRightbar>
</template>

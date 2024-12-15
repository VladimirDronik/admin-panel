<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Helper modules
import { ClockCogIcon } from 'vue-tabler-icons';
import { checkStatusTextSmall, checkStatusBackgroundColor, checkStatusColor } from '~/helpers/main';
import { updateParamsForApi } from '~/helpers/devices';
// Types
import {
  TablePortListSchema, type TablePortData, type FullDevice,
} from '~/stores/devices/devicesTypes';
import type { APIData } from '~/types/StoreTypes';
import type {
  ModelProps,
} from '~/types/DevicesTypes';
// Static Data modules
import { objectManager, paths } from '~/utils/endpoints';
import { deviceEventTypes } from '~/staticData/modelEvents';
import type {
  AddFieldToDynamicFormPayload, DeviceEditFormPayload, DeviceChildren, DevicePropertyData, EditDeviceForm, DeviceCreateFormPayload,
} from '~/components/devices/form.types';
import {
  ObjectsCategory, DevicePropertyKey, DeviceInterface,
} from '~/types/DevicesEnums';
import api from '~/plugins/api';
import type { GetCurrentDeviceResponse } from './right-bar.types.ts';
import { transformToDeviceEditFormPayload } from '~/utils/api-payload-transformers';

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

const asideEditingForm = reactive<EditDeviceForm>({
  id: 0,
  sdaPort: null,
  sclPort: null,
  parent_id: 0,
  category: ObjectsCategory.Sensor,
  name: '',
  zone_id: null,
  props: {
    update_interval: 300,
    interface: DeviceInterface['1W'],
    address: '',
  },
  children: {},
  type: '',
  status: 'N/A',
});

const addChildrenToDynamicFormCB: AddFieldToDynamicFormPayload = (key, value) => {
  asideEditingForm.children[key] = value;
};

// Apis
const apiPorts = ref<APIData<TablePortData[]>>();
const apiDevice = ref<APIData<any>>();
const apiUpdateDevice = ref<APIData<any>>();
const apiDeleteDevice = ref<APIData<any>>();

const form = ref({});

// Computed Properties
const isUpdate = computed(() => apiPorts.value?.pending && apiDevice.value?.pending);

// Methods
const updateName = () => {
  // if (form.value) name.value = form.value?.name;
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
// watch(() => form.value?.name, () => {
//   updateName();
//   active.value = false;
// });

// watch(() => form.value?.category, () => {
//   tabs.value = 'features';
// });

watch(() => selectedObject.value?.id, () => {
  // if (selectedObject.value?.category === 'controller') apiPorts.value?.refresh();
});

const transformResponseToFormData = (data: GetCurrentDeviceResponse): EditDeviceForm| null => {
  if (!data.id) return null;
  const address = data.props.find((prop) => prop.code === 'address');
  const updatedInterval = data.props.find((prop) => prop.code === 'update_interval')?.value ?? 0;
  const updatedInterface = (data.props.find((prop) => prop.code === 'interface')?.value ?? DeviceInterface['1W']) as DeviceInterface;
  const updatedBusAdress = String(address?.value).split(';')[1];
  const ports = String(address?.value).split(';') ?? [null, null];
  const children = data.children.reduce((acc, child) => {
    const key = child.type as DevicePropertyKey;

    const propertyData = child.props.reduce((acc, prop) => {
      const key = prop.code as keyof DevicePropertyData;
      const value = prop.value as DevicePropertyData[keyof DevicePropertyData];
      // @ts-expect-error ///
      acc[key] = value;
      return acc;
    }, {} as DevicePropertyData);

    acc[key] = {
      ...propertyData,
    };
    return acc;
  }, {} as DeviceChildren);

  return {
    id: data.id,
    status: data.status,
    type: data.type,
    sdaPort: Number(ports[0]),
    sclPort: Number(ports[1]),
    busAdress: Number(updatedBusAdress),
    parent_id: data.parent_id,
    name: data.name,
    zone_id: data.zone_id,
    category: data.category as ObjectsCategory,
    props: {
      interface: updatedInterface,
      update_interval: Number(updatedInterval),
    },
    children,
  };
};

const forceUpdateKey = ref(0);

watchEffect(() => {
  const result = {
    ...apiDevice.value?.data?.response,
    props: propsModel(apiDevice.value?.data?.response.props),
    children: apiDevice.value?.data?.response.children?.map((item: any) => ({
      ...item,
      props: propsModel(item.props) ?? [],
    })),
  } as GetCurrentDeviceResponse;
  const transformedData = transformResponseToFormData(result);
  if (transformedData) Object.assign(asideEditingForm, transformedData);
  forceUpdateKey.value += 1;
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

  // Update Device
  const body = computed<DeviceEditFormPayload>(() => transformToDeviceEditFormPayload(asideEditingForm));

  const dataUpdateDevice: unknown = await useAPI(
    paths.objects,
    {
      body,
      immediate: false,
      watch: false,
      method: 'PUT',
    },
  );

  apiUpdateDevice.value = dataUpdateDevice as APIData<any>;

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
        <Inplace v-model:active="active" v-if="asideEditingForm.name" class="tw-w-full" @open="updateName">
          <template #display>
            <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
              {{ asideEditingForm?.name }} ({{ asideEditingForm.type}})
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
        :severity="checkStatusColor(asideEditingForm.status)"
        class="tw-ml-3 !tw-rounded-lg"
        outlined
        label
      >
        <div class="tw-flex tw-items-center tw-font-normal">
          <div
            class="tw-mr-3 tw-h-2.5 tw-w-2.5 tw-rounded-full"
            :class="checkStatusBackgroundColor(asideEditingForm.status)"
          />
          {{ checkStatusTextSmall(asideEditingForm.status) }}
        </div>
      </Tag>

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
          <Tab value="ports" v-if="asideEditingForm?.category === 'controller'">
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
        <TabPanels>
          <TabPanel value="features">
            <DevicesDynamicDeviceForm
              :key="forceUpdateKey"
              is-editing
              :device-type="asideEditingForm.type"
              v-model:dynamic-form="asideEditingForm"
              :add-field-to-dynamic-form="addChildrenToDynamicFormCB"
            >
              <template #footer>
                <div class="tw-mt-4 tw-flex tw-justify-end">
                  <DialogsDeleteDialog
                    @delete="confirmDelete"
                    v-model="dialogDelete"
                    :id="asideEditingForm?.id ?? -1"
                    :loading="apiDeleteDevice?.pending"
                    :subtitle="`Вы уверены, что хотите удалить «${asideEditingForm?.name}»`"
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

          </TabPanel>
          <TabPanel value="events">
            <FormsEventForm
              targetType="object"
              :id="asideEditingForm.id"
              :modelType="asideEditingForm.type"
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
      </Tabs>
    </div>
  </LayoutFullRightbar>
</template>

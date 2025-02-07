<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
// Helper modules
import { checkStatusTextSmall, checkStatusSymbol, checkStatusColor } from '~/helpers/main';
// Static Data modules
import { deviceEventTypes } from '~/staticData/modelEvents';
import { initialEditFormData } from '../forms/byTypes/initial-dynamic-form-data.js';
import { objectManager, paths } from '~/utils/endpoints';
import { transformToDeviceEditFormPayload } from '~/utils/api-payload-transformers';
// Types and Schemes modules
import type { APIData } from '~/types/StoreTypes';
import type { ModelProps } from '~/types/DevicesTypes';
import type { GetCurrentDeviceResponse } from './right-bar.types.ts';
import {
  TablePortListSchema, type TablePortData, type FullDevice,
} from '~/stores/devices/devicesTypes';
import type {
  AddFieldToDynamicFormPayload, DeviceEditFormPayload, EditDeviceForm,
} from '~/components/device//form/form.types';

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
const isDynamicFormValid = ref(false);

const forceUpdateKey = ref(0);

let asideEditingForm = reactive<EditDeviceForm>(initialEditFormData);

// Apis
const apiPorts = ref<APIData<TablePortData[]>>();
const apiDevice = ref<APIData<any>>();
const apiUpdateDevice = ref<APIData<any>>();
const apiDeleteDevice = ref<APIData<any>>();

// Computed Properties
const isUpdate = computed(() => (
  apiPorts.value?.status !== 'idle' && apiPorts.value?.pending)
  || (apiDevice.value?.status !== 'idle' && apiDevice.value?.pending));

const propsModel = (props: ModelProps | undefined): ModelProps[] => {
  if (!props) return [];
  const result = Object.values(props).map((item) => ({
    ...item,
    required: item.required ?? false,
    editable: item.editable ?? false,
    visible: item.visible ?? false,
  }));
  return result;
};

const confirmDelete = async () => {
  if (apiDevice.value?.data?.response.id && apiDeleteDevice.value) {
    apiDeleteDevice.value.pending = true;
    await updateData({
      update: async () => {
        await apiDeleteDevice.value?.execute();
        await storeDevices.getDevicesApi({
          limit: 10000,
          offset: 0,
        });
      },
      error: () => {
        dialogDelete.value = false;
        isOpen.value = false;
        if (!apiDeleteDevice.value) return;
        apiDeleteDevice.value.pending = false;
      },
      success: () => {
        dialogDelete.value = false;
        isOpen.value = false;
        if (!apiDeleteDevice.value) return;
        apiDeleteDevice.value.pending = false;
      },
      successMessage: 'Устройство удалено',
      errorMessage: 'Ошибка удаления устройства',
    });
  }
};

const devicesDynamicFormValidityHandler = (isValid: boolean) => {
  isDynamicFormValid.value = isValid;
};

const addChildrenToDynamicFormCB: AddFieldToDynamicFormPayload = (key, value) => {
  if (!asideEditingForm.children) return;
  asideEditingForm.children[key] = value;
};

const changeDevice = async () => {
  await updateData({
    update: async () => {
      await apiUpdateDevice.value?.execute();
    },
    successMessage: 'Устройство обновлено',
    errorMessage: selectedObject.value?.type === 'mega_d'
      ? 'Ошибка обновления устройства. Проверьте правильность IP-адреса.'
      : 'Ошибка обновления устройства',
    success: async () => {
      await storeDevices.getDevicesApi({
        limit: 10000,
        offset: 0,
      });
    },
  });
};

// Watchers
watch(() => selectedObject.value?.id, () => {
  if (selectedObject.value?.category === 'controller') {
    apiPorts.value?.refresh();
  } else if (tabs.value === 'ports') tabs.value = 'features';
});

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
  if (transformedData) asideEditingForm = reactive(transformedData);
  forceUpdateKey.value += 1;
});

// Hooks
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
  /// Консоль для работы, пока идут создания девайсов
  // console.log(body);
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
  apiDeleteDevice.value.pending = false;

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
  <LayoutRightbar
    :is-open="isOpen"
    :is-update="isUpdate"
  >
    <div>
      <div
        :key="forceUpdateKey"
        class="tw-mb-2 tw-flex tw-items-center tw-justify-between"
      >
        <Inplace
          v-if="asideEditingForm.name"
          v-model:active="active"
          class="tw-w-full"
        >
          <template #display>
            <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
              {{ asideEditingForm?.name }} ({{ asideEditingForm.type }})
            </h3>
          </template>
          <template #content="{ closeCallback }">
            <span class=" tw-flex tw-w-full tw-items-center tw-gap-2">
              <InputText
                v-model="name"
                autofocus
                class="tw-min-w-60"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="closeCallback"
              />
              <Button
                icon="pi pi-save"
                severity="success"
                text
                @click="changeDevice"
              />
            </span>
          </template>
        </Inplace>
        <Button
          icon="pi pi-times"
          rounded
          severity="secondary"
          size="small"
          text
          @click="isOpen = false"
        />
      </div>
      <Tag
        class="tw-ml-3 !tw-rounded-lg"
        label
        outlined
        :severity="checkStatusColor(asideEditingForm.status)"
      >
        <div class="tw-flex tw-items-center tw-font-normal">
          <div :class="`${checkStatusSymbol(asideEditingForm.status).class} tw-mr-2`">
            {{ checkStatusSymbol(asideEditingForm.status).symbol }}
          </div>
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
          <Tab
            v-if="selectedObject?.category === 'controller'"
            value="ports"
          >
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
            <DeviceFormDynamicDevice
              :key="forceUpdateKey"
              v-model:dynamic-form="asideEditingForm"
              :add-field-to-dynamic-form="addChildrenToDynamicFormCB"
              :device-type="asideEditingForm.type"
              is-editing
              @update:valid="devicesDynamicFormValidityHandler"
            >
              <template #footer>
                <div class="tw-mt-4 tw-flex tw-justify-end">
                  <DialogDelete
                    :id="asideEditingForm?.id ?? -1"
                    v-model="dialogDelete"
                    class="tw-mr-2"
                    :loading="apiDeleteDevice?.pending"
                    :subtitle="`Вы уверены, что хотите удалить «${asideEditingForm?.name}»?`"
                    title="Удалить устройство"
                    @delete="confirmDelete"
                  />
                  <Button
                    class="tw-mr-2"
                    :disabled="!isDynamicFormValid"
                    :label="t('save')"
                    :loading="apiUpdateDevice?.pending && apiUpdateDevice.status !== 'idle'"
                    @click="changeDevice"
                  />
                </div>
              </template>
            </DeviceFormDynamicDevice>
          </TabPanel>
          <TabPanel value="events">
            <FormsEventForm
              v-if="selectedObject"
              :id="selectedObject.id"
              :event-types="deviceEventTypes"
              :model-type="selectedObject.type"
              target-type="object"
            />
          </TabPanel>
          <TabPanel value="ports">
            <DeviceFormPorts
              v-if="apiPorts?.data?.response"
              :id="selectedObject?.id ?? 0"
              v-model:ports="apiPorts.data.response"
            />
          </TabPanel>
          <TabPanel value="management">
            Скоро...
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </LayoutRightbar>
</template>

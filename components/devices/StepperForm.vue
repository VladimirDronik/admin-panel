<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import {
  type Devices,
} from '~/types/DevicesTypes';
// Types and Schemes
import type { APIData } from '~/types/StoreTypes';
import type { Event } from '@/types/ModelEventTypes';
// Static Data modules
import { paths } from '~/utils/endpoints';
import { deviceEventTypes } from '~/staticData/modelEvents';
import {
  type CreateDeviceInitialForm, type DynamicFormData, type DeviceCreateFormPayload, type AddFieldToDynamicFormPayload,
} from './form.types';
import {
  Controller, GenericInput, Relay, ObjectsCategory,
} from '~/types/DevicesEnums';
import { transformToDeviceCreateFormPayload } from '~/utils/api-payload-transformers';
import { getInitialCreateDeviceFormDataByTypes } from '../forms/byTypes/initial-dynamic-form-data';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeRooms = useRoomsStore();
const storeDevices = useDevicesStore();

const initialForm = defineModel<CreateDeviceInitialForm>('form', {
  required: true,
});

const dynamicForm = reactive(getInitialCreateDeviceFormDataByTypes(initialForm.value)) as DynamicFormData;

const addChildrenToDynamicFormCB: AddFieldToDynamicFormPayload = (key, value) => {
  if (!dynamicForm.children) return;
  dynamicForm.children[key] = value;
};

const model = defineModel<Devices | undefined>('model', {
  required: true,
});

const dialog = defineModel<boolean>('dialog', {
  required: true,
});

defineProps({
  loadingModal: {
    type: Boolean,
    default: false,
  },
});

// Variables
const apiCreateDevice = ref<APIData<any>>();

const events = ref<Event[]>();

// Computed Properties
const types = computed(() => _.uniq(_.map(storeDevices.types?.data?.response, 'type')));
const tags = computed(() => (storeDevices.tags?.data?.response ? _.uniq(Object.keys(storeDevices.tags?.data?.response)) : []));

// const categories = computed(() => _.uniq(_.map(storeDevices.types?.data?.response, 'category')));

watch(
  () => initialForm.value.tags,
  (updatedTags) => {
    storeDevices.getTypesApi({ tags: updatedTags.join(';') }, false);
  },
  { deep: true },
);

const valid = computed(() => {
  // checkValidInput(form.value.zone_id) &&
  const main = checkValidInput(initialForm.value.tags) && checkValidInput(initialForm.value.category) && checkValidInput(initialForm.value.type) && checkValidInput(dynamicForm.name);

  let props = true;
  let children = true;

  if (model.value?.props.length) {
    props = model.value.props.every((item) => {
      if (item.required) return true;
      return checkValidInput(item.value);
    });
  }

  if (model.value?.children?.length) {
    children = model.value.children.every((child) => {
      if (child.props.length) return true;
      return child.props.every((item) => checkValidInput(item.value));
    });
  }

  return main && props && children && isDynamicFormValid.value;
});

// Methods
const checkValidInput = (value: any) => value || value === false;

const createDevice = async () => {
  await updateData({
    update: async () => {
      await apiCreateDevice.value?.execute();
      await storeDevices.getDevicesApi({
        limit: 10000,
        offset: 0,
      });
    },
    success: () => {
      dialog.value = false;
      model.value = undefined;
      initialForm.value = {
        name: '',
        zone_id: null,
        type: Controller.MegaD,
        tags: [],
        category: 'controller',
      };
    },
    successMessage: 'Устройство успешно создано',
    errorMessage: 'Устройство не было создано',
  });
};

const isDynamicFormValid = ref(false);

const devicesDynamicFormValidityHandler = (isValid: boolean) => {
  isDynamicFormValid.value = isValid;
};

onBeforeMount(async () => {
  // Create Device
  const body = computed<DeviceCreateFormPayload>(() => transformToDeviceCreateFormPayload({
    ...initialForm.value, ...dynamicForm,
  }));
  /// Консоль для работы, пока идут создания девайсов
  console.log(body);
  const data: unknown = await useAPI(paths.objects, {
    body,
    method: 'POST',
    immediate: false,
    watch: false,
  });

  apiCreateDevice.value = data as APIData<any>;
});

const changeTypeHandler = () => {
  Object.assign(dynamicForm, getInitialCreateDeviceFormDataByTypes(initialForm.value));
  switch (initialForm.value.type) {
    case Controller.MegaD:
      dynamicForm.category = ObjectsCategory.Controller;
      break;
    case Relay.Relay:
      dynamicForm.category = ObjectsCategory.Relay;
      break;
    case GenericInput.GenericInput:
      dynamicForm.category = ObjectsCategory.GenericInput;
      break;
    default:
      dynamicForm.category = ObjectsCategory.Sensor;
  }
};

const isRoomSelectDisabled = computed(() => initialForm.value.type === 'regulator');

</script>

<template>
  <Stepper value="1" class="basis-[50rem]" linear>
    <StepList>
      <Step value="1">{{ t('devices.features') }}</Step>
      <Step value="2">{{ t('devices.events') }}</Step>
      <Step value="3">{{ t('devices.management') }}</Step>
    </StepList>

    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1">
        <form>
          <div class="tw-ml-[20%] tw-mr-[5%]">
            <SharedUILabel class="tw-mb-4" :title="t('devices.tags')" required>
              <MultiSelect v-model="initialForm.tags" :options="tags" filter display="chip" :maxSelectedLabels="5" class="tw-w-full" />
            </SharedUILabel>
            <SharedUILabel class="tw-mb-4" :title="t('devices.type') " required>
              <Select v-model="initialForm.type" @change="changeTypeHandler" :options="types" class="tw-w-2/4" />
            </SharedUILabel>
          </div>

          <Divider class="tw-mt-0 tw-pb-3" />

          <div class="tw-ml-[20%] tw-mr-[5%]">
            <SharedUILabel class="tw-mb-4" :title="t('devices.title')" required>
              <InputText v-model="dynamicForm.name" class="tw-w-3/4" />
            </SharedUILabel>
            <SharedUILabel class="tw-mb-4" :title="t('devices.room')">
              <Select :disabled="isRoomSelectDisabled" :showClear="true" v-model="dynamicForm.zone_id" :options="storeRooms.getRoomsSelect" optionLabel="name" optionValue="code" class="tw-w-2/4" />
            </SharedUILabel>
          </div>

          <Divider class="tw-pb-3" />

          <!-- <DevicesPropertiesForm v-model="model" :loadingModal="loadingModal" disableRoomSelect /> -->

          <!-- Dynamically renders the form component based on the selected device type -->
          <DevicesDynamicDeviceForm
            v-model:dynamic-form="dynamicForm"
            :add-field-to-dynamic-form="addChildrenToDynamicFormCB"
            :deviceType="initialForm.type"
            @update:valid="devicesDynamicFormValidityHandler" />
        </form>

        <div class="tw-flex tw-justify-end">
          <Button :disabled="!valid" @click="activateCallback('2')">
            {{ t('next') }}
          </Button>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <FormsEventForm
          v-model="events"
          targetType="object"
          :modelType="initialForm.type"
          :eventTypes="deviceEventTypes"
        />
        <div class="tw-flex tw-justify-between">
          <Button @click="activateCallback('1')">
            {{ t('goBack') }}
          </Button>
          <Button @click="activateCallback('3')">
            {{ t('next') }}
          </Button>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="3">
        Пока пусто
        <div class="tw-flex tw-justify-between">
          <Button @click="activateCallback('2')">
            {{ t('goBack') }}
          </Button>
          <Button
            @click="createDevice"
            :label="t('save')"
            :loading="apiCreateDevice?.pending && apiCreateDevice.status !== 'idle'"
            color="primary"
          />
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

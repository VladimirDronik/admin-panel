<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { updateParamsForApi } from '~/helpers/devices';
import { type Devices, type DynamicFormData } from '~/types/DevicesTypes';
// Types and Schemes
import type { APIData } from '~/types/StoreTypes';
import type { Event } from '@/types/ModelEventTypes';
// Static Data modules
import { paths } from '~/utils/endpoints';
import { deviceEventTypes } from '~/staticData/modelEvents';

// Types
interface DeviceCreateForm {
  name: string;
  type: string;
  zone_id: number | null;
  category: string;
  tags: string[];
}

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeRooms = useRoomsStore();
const storeDevices = useDevicesStore();

const form = defineModel<DeviceCreateForm>('form', {
  required: true,
});

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
  () => form.value.tags,
  (updatedTags) => {
    storeDevices.getTypesApi({ tags: updatedTags.join(';') }, false);
  },
  { deep: true },
);

const valid = computed(() => {
  // checkValidInput(form.value.zone_id) &&
  const main = checkValidInput(form.value.tags) && checkValidInput(form.value.category) && checkValidInput(form.value.type) && checkValidInput(form.value.name);

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
      form.value = {
        name: '',
        zone_id: null,
        type: '',
        tags: [],
        category: 'controller',
      };
    },
    successMessage: 'Устройство успешно создано',
    errorMessage: 'Устройство не было создано',
  });
};

const isDynamicFormValid = ref(false);
const dynamicFormData = ref<DynamicFormData>({} as DynamicFormData);
const devicesDynamicFormUpdateHandler = (form: DynamicFormData) => {
  dynamicFormData.value = form;
};

const devicesDynamicFormValidityHandler = (isValid: boolean) => {
  isDynamicFormValid.value = isValid;
  console.log('Форма валидна:', isValid);
};

onBeforeMount(async () => {
  // Create Device
  const data: unknown = await useAPI(paths.objects, {
    body: computed(() => ({
      ...form.value,
      props: dynamicFormData.value,
      events: events.value,
    })),
    method: 'POST',
    immediate: false,
    watch: false,
  });

  apiCreateDevice.value = data as APIData<any>;
});

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
              <MultiSelect v-model="form.tags" :options="tags" filter display="chip" :maxSelectedLabels="5" class="tw-w-full" />
            </SharedUILabel>
            <SharedUILabel class="tw-mb-4" :title="t('devices.type') " required>
              <Select v-model="form.type" :options="types" class="tw-w-2/4" />
            </SharedUILabel>
          </div>

          <Divider class="tw-mt-0 tw-pb-3" />

          <div class="tw-ml-[20%] tw-mr-[5%]">
            <SharedUILabel class="tw-mb-4" :title="t('devices.title')" required>
              <InputText v-model="form.name" class="tw-w-3/4" />
            </SharedUILabel>
            <SharedUILabel class="tw-mb-4" :title="t('devices.room')">
              <Select v-model="form.zone_id" :options="storeRooms.getRoomsSelect" optionLabel="name" optionValue="code" class="tw-w-2/4" />
            </SharedUILabel>
          </div>

          <Divider class="tw-pb-3" />

          <!-- <DevicesPropertiesForm v-model="model" :loadingModal="loadingModal" disableRoomSelect /> -->

          <!-- Dynamically renders the form component based on the selected device type -->
          <DevicesDynamicDeviceForm :deviceType="form.type" @update:model-value="devicesDynamicFormUpdateHandler" @update:valid="devicesDynamicFormValidityHandler" />
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
          :modelType="form.type"
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
          <Button color="primary" @click="createDevice" :loading="apiCreateDevice?.pending && apiCreateDevice.status !== 'idle'" :label="t('save')" />
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import MultiSelect from 'primevue/multiselect';
import { updateParamsForApi } from '~/helpers/devices';
import { type Devices } from '~/types/DevicesTypes';
// Types and Schemes
import type { APIData } from '~/types/StoreTypes';
// Static Data modules
import { paths } from '~/staticData/endpoints';

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

// Computed Properties
const types = computed(() => _.uniq(_.map(storeDevices.types?.data?.response, 'type')));
const categories = computed(() => _.uniq(_.map(storeDevices.types?.data?.response, 'category')));
const tags = computed(() => (storeDevices.tags?.data?.response ? _.uniq(Object.keys(storeDevices.tags?.data?.response)) : []));

watch(
  () => form.value.tags,
  (updatedTags) => {
    storeDevices.getTypesApi({ tags: updatedTags.join(';') }, false);
  },
  { deep: true },
);

const isSelected = (tagName: string): boolean => Boolean((form.value.tags ?? []).find((tag) => tag === tagName));

const valid = computed(() => {
  const main = checkValidInput(form.value.zone_id)
    && checkValidInput(form.value.tags)
    && checkValidInput(form.value.category)
    && checkValidInput(form.value.type)
    && checkValidInput(form.value.name);

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

  return main && props && children;
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

onBeforeMount(async () => {
  // Create Device
  const data: unknown = await useAPI(
    paths.objectModel,
    {
      body: computed(() => ({
        ...model.value,
        ...form.value,
      })),
      method: 'POST',
      immediate: false,
      watch: false,
    },
  );

  apiCreateDevice.value = data as APIData<any>;
  //
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
          <div class="-tw-ml-[50%] tw-pr-[5%]">
            <SharedUIField :required="true">
              <template #label>
                {{ t('devices.tags') }}
              </template>
              <template #input>
                <MultiSelect v-model="form.tags" :options="tags" filter display="chip" :maxSelectedLabels="5" class="tw-w-full" required />
              </template>
            </SharedUIField>

            <SharedUIField :required="true">
              <template #label>
                {{ t('devices.type') }}
              </template>
              <template #input>
                <Select v-model="form.type" :options="types" required class="tw-w-2/4" />
              </template>
            </SharedUIField>
          </div>

          <Divider class="tw-mt-0 tw-pb-3" />

          <div class="-tw-ml-[50%] tw-pr-[5%]">
            <SharedUIField :required="true">
              <template #label>
                {{ t('devices.title') }}
              </template>
              <template #input>
                <InputText v-model="form.name" required class="tw-w-3/4" />
              </template>
            </SharedUIField>

            <SharedUIField :required="true">
              <template #label>
                {{ t('devices.room') }}
              </template>
              <template #input>
                <Select v-model="form.zone_id" :options="storeRooms.getRoomsSelect" optionLabel="name" optionValue="code" class="tw-w-2/4" required />
              </template>
            </SharedUIField>
          </div>

          <Divider class="tw-pb-3" />

          <DevicesPropertiesForm
            v-model="model"
            :loadingModal="loadingModal"
            disableRoomSelect
          />
        </form>

        <div class="tw-flex tw-justify-end">
          <Button :disabled="!valid" @click="activateCallback('2')">
            {{ t('next') }}
          </Button>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <DevicesEventsForm v-if="model" v-model="model" />
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

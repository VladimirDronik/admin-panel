<script setup lang="ts">
import _ from 'lodash';
import { useI18n } from 'vue-i18n';

interface DeviceCreateForm {
  name: string,
  type: string,
  zone_id: number | null,
  category: string,
}

// Composables
const { t } = useI18n();
const toast = useToast();
const storeRooms = useRoomsStore();
const storeDevices = useDevicesStore();
const {
  emptyRules,
} = useValidation();

const form = defineModel<DeviceCreateForm>('form', {
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
const valid = ref(false);
const loading = ref(false);

// Computed Properties
const types = computed(() => _.uniq(_.map(_.filter(storeDevices.types, ['category', form.value.category]), 'type')));
const categories = computed(() => _.uniq(_.map(storeDevices.types, 'category')));

const createDevice = async () => {
  loading.value = true;
  const newProps: any = {};
  const newChildren: any = [];
  storeDevices.model?.props.forEach((item) => {
    newProps[item.code] = {
      code: item.code,
      name: item.name,
      type: item.type,
      value: item.value,
    };
  });
  if (storeDevices.model?.children) {
    storeDevices.model?.children.forEach((item) => {
      newChildren.push({
        ...item,
        props: item.props.map((item) => ({
          code: item.code,
          name: item.name,
          type: item.type,
          value: item.value,
        })),
      });
    });
    storeDevices.model?.children[0]?.props.forEach((item) => {
      newChildren[item.code] = {
        code: item.code,
        name: item.name,
        type: item.type,
        value: item.value,
      };
    });
  }
  try {
    if (storeDevices.model?.category === 'sensor') {
      await storeDevices.createDeviceApi({
        ...form.value,
        props: newProps,
        children: newChildren,
      });
    } else {
      await storeDevices.createDeviceApi({
        ...form.value,
        props: newProps,
      });
    }
    await storeDevices.getDevicesApi({
      limit: 10000,
      offset: 0,
    });
    dialog.value = false;

    storeDevices.model = null;

    form.value = {
      name: '',
      zone_id: null,
      type: '',
      category: 'controller',
    };
  } catch (error: any) {
    showError();
  }
  loading.value = false;
};

const showError = () => {
  toast.add({
    severity: 'error',
    summary: 'Ошибка создания',
    detail: 'Устройство не было создано',
    life: 5000,
  });
};
</script>

<template>
  <Stepper value="1" class="basis-[50rem]">
    <StepList>
      <Step value="1">{{ t('devices.features') }}</Step>
      <Step value="2">{{ t('devices.events') }}</Step>
      <Step value="3">{{ t('devices.management') }}</Step>
    </StepList>
    <StepPanels>
      <StepPanel value="1">
        <v-form v-model="valid">
          <div>
            <div class="tw-mb-2 tw-flex tw-w-full tw-items-center">
              <SharedUILabel :title="t('devices.title')" required>
                <InputText
                  v-model="form.name"
                  :rules="emptyRules"
                  class="tw-w-full"
                  required
                />
              </SharedUILabel>
              <SharedUILabel :title="t('devices.room')" required>
                <Select
                  v-model="form.zone_id"
                  :rules="emptyRules"
                  :options="storeRooms.getRoomsSelect"
                  optionLabel="name"
                  class="tw-w-full"
                  required
                />
              </SharedUILabel>
            </div>
            <div class="tw-mb-2 tw-flex tw-w-full tw-items-center">
              <SharedUILabel :title="t('devices.category')" required>
                <Select
                  v-model="form.category"
                  :options="categories"
                  :rules="emptyRules"
                  class="tw-w-full"
                  required
                />
              </SharedUILabel>
              <SharedUILabel :title="t('devices.type')" required>
                <Select
                  v-model="form.type"
                  :options="types"
                  :rules="emptyRules"
                  class="tw-w-full"
                  required
                />
              </SharedUILabel>
            </div>

            <Divider />

            <DevicesPropertiesForm v-model="storeDevices.model" :loadingModal="loadingModal" />

            <div class="tw-flex tw-justify-end">
              <Button
                @click="dialog = false"
                class="tw-mr-2"
                outlined
              >
                {{ t('cancel') }}
              </Button>
              <Button
                :disabled="!valid"
                :loading="loading"
                @click="createDevice"
              >
                {{ t('next') }}
              </Button>
            </div>
          </div>
        </v-form>
      </StepPanel>
      <StepPanel value="2">
        <DevicesEventsForm v-if="storeDevices.model" v-model="storeDevices.model" />
        <div class="tw-flex tw-justify-between">
          <Button
            :disabled="!valid"
            :loading="loading"
          >
            {{ t('goBack') }}
          </Button>
          <div>
            <Button
              class="tw-mr-2"
              outlined
            >
              {{ t('cancel') }}
            </Button>
            <Button
              :disabled="!valid"
              :loading="loading"
            >
              {{ t('next') }}
            </Button>
          </div>
        </div>
      </StepPanel>
      <StepPanel value="3">
        <div class="tw-flex tw-justify-between">
          <Button
            :disabled="!valid"
            :loading="loading"
          >
            {{ t('goBack') }}
          </Button>
          <div>
            <Button
              class="tw-mr-2"
              outlined
            >
              {{ t('cancel') }}
            </Button>
            <Button
              color="primary"
              :disabled="!valid"
              :loading="loading"
            >
              {{ t('save') }}
            </Button>
          </div>
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

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

const props = defineProps({
  loadingModal: {
    type: Boolean,
    default: false,
  },
});

// Variables
const loading = ref(false);

// Computed Properties
const types = computed(() => _.uniq(_.map(_.filter(storeDevices.types, ['category', form.value.category]), 'type')));
const categories = computed(() => _.uniq(_.map(storeDevices.types, 'category')));

const checkValidInput = (value: any) => value || value === false;

const valid = computed(() => {
  const main = checkValidInput(form.value.zone_id)
  && checkValidInput(form.value.category)
  && checkValidInput(form.value.type)
  && checkValidInput(form.value.name);

  let props = true;
  let children = true;

  if (storeDevices.model?.props.length) {
    props = storeDevices.model.props.every((item) => checkValidInput(item.value));
  }

  if (storeDevices.model?.children?.length) {
    children = storeDevices.model.children.every((child) => {
      if (child.props.length) return true;
      return child.props.every((item) => checkValidInput(item.value));
    });
  }

  return main && props && children;
});

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

    toast.add({
      severity: 'success',
      summary: 'Устройство успешно создано',
      life: 5000,
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
    toast.add({
      severity: 'error',
      summary: 'Ошибка создания',
      detail: 'Устройство не было создано',
      life: 5000,
    });
  }
  loading.value = false;
};
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
        <v-form>
          <div class="tw-mb-2 tw-flex tw-w-full tw-items-center">
            <SharedUILabel :title="t('devices.title')" required>
              <InputText
                v-model="form.name"
                class="tw-w-full"
                required
              />
            </SharedUILabel>
            <SharedUILabel :title="t('devices.room')" required>
              <Select
                v-model="form.zone_id"
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
                class="tw-w-full"
                required
              />
            </SharedUILabel>
            <SharedUILabel :title="t('devices.type')" required>
              <Select
                v-model="form.type"
                :options="types"
                class="tw-w-full"
                required
              />
            </SharedUILabel>
          </div>
        </v-form>

        <Divider />

        <DevicesPropertiesForm disableRoomSelect v-model="storeDevices.model" :loadingModal="loadingModal" />

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
            @click="activateCallback('2')"
          >
            {{ t('next') }}
          </Button>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <DevicesEventsForm v-if="storeDevices.model" v-model="storeDevices.model" />
        <div class="tw-flex tw-justify-between">
          <Button
            @click="activateCallback('1')"
          >
            {{ t('goBack') }}
          </Button>
          <Button
            :loading="loading"
            @click="activateCallback('3')"
          >
            {{ t('next') }}
          </Button>
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="3">
        Пока пусто
        <div class="tw-flex tw-justify-between">
          <Button
            @click="activateCallback('2')"
          >
            {{ t('goBack') }}
          </Button>
          <Button
            color="primary"
            @click="createDevice"
            :loading="loading"
          >
            {{ t('save') }}
          </Button>
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

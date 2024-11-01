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
    showError(error?.data?.error);
  }
  loading.value = false;
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
            <div v-if="storeDevices.model">
              <div v-for="item in storeDevices.model?.props" :key="item.code">
                <div v-if="item.visible.value">
                  <SharedUILabel
                    v-if="item.type === 'bool'"
                    :title="item.name"
                    :required="item.required.value"
                  >
                    <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-rounded tw-border tw-border-black tw-px-4">
                      <p class="tw-py-3 tw-text-base">
                        {{ item.value ? t('enabled') : t('disabled')}}
                      </p>
                      <ToggleSwitch
                        v-model="item.value"
                        color="primary"
                        :disabled="!item.editable.value"
                      />
                    </div>
                  </SharedUILabel>
                  <SharedUILabel
                    v-else-if="item.type === 'enum'"
                    :title="item.name"
                    :required="item.required.value"
                  >
                    <v-select
                      v-model="item.value"
                      :items="Object.keys(item.values)"
                      :disabled="!item.editable.value"
                      :rules="item.required ? emptyRules : undefined"
                      required
                    />
                  </SharedUILabel>
                  <SharedUILabel
                    v-else
                    :title="item.name"
                    :required="item.required.value"
                  >
                    <v-text-field
                      v-model="item.value"
                      :disabled="!item.editable.value"
                      :rules="!item.required ? emptyRules : undefined"
                      required
                    />
                  </SharedUILabel>
                </div>
              </div>
              <div v-if="storeDevices.model?.category === 'sensor'">
                <div class="tw-mb-4" v-for="port in storeDevices.model?.children" :key="port.id">
                  <p class="text-primary tw-mb-2 tw-pt-3 tw-text-2xl tw-font-semibold">
                    {{port.name}}
                  </p>
                  <div class="tw-mb-1" v-for="item in port.props" :key="item.code">
                    <div v-if="item.visible.value">
                      <SharedUILabel
                        v-if="item.type === 'bool'"
                        :title="item.name"
                        :required="item.required.value"
                      >
                        <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-rounded tw-border tw-border-black tw-px-4">
                          <p class="tw-py-3 tw-text-base">
                            {{ item.value ? t('enabled') : t('disabled')}}
                          </p>
                          <ToggleSwitch
                            v-model="item.value"
                            color="primary"
                            :disabled="!item.editable.value"
                          />
                        </div>
                      </SharedUILabel>
                      <SharedUILabel
                        v-else-if="item.type === 'enum'"
                        :title="item.name"
                        :required="item.required.value"
                      >
                        <v-select
                          v-model="item.value"
                          :disabled="!item.editable.value"
                          :items="Object.keys(item.values)"
                          :rules="!item.required ? emptyRules : undefined"
                          required
                        />
                      </SharedUILabel>
                      <SharedUILabel
                        v-else
                        :title="item.name"
                        :required="item.required.value"
                      >
                        <v-text-field
                          v-model="item.value"
                          :disabled="!item.editable.value"
                          :type="item.type === 'int' || item.type === 'float' ? 'number' : 'text'"
                          :rules="!item.required ? emptyRules : undefined"
                          required
                        />
                      </SharedUILabel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p v-if="!loadingModal" class="tw-text-center tw-text-xl">
                {{ t('devices.preloadTitle') }}
              </p>
              <div v-else class="tw-flex tw-justify-center">
                <v-progress-circular
                  :size="30"
                  :width="3"
                  color="primary"
                  class="tw-mb-2"
                  indeterminate
                />
              </div>
            </div>
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
        <DevicesFeaturesForm v-if="storeDevices.model" v-model="storeDevices.model" />
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

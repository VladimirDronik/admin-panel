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
              <div class="tw-mr-2 tw-w-full">
                <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                  {{ t('devices.title') }} <span class="text-primary">*</span>
                </p>
                <v-text-field v-model="form.name" required :rules="emptyRules" />
              </div>
              <div class="tw-w-full">
                <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                  <!-- {{ t('devices.title') }}  -->
                  {{ t('devices.room') }} <span class="text-primary">*</span>
                </p>
                <v-select :items="storeRooms.getRoomsSelect" v-model="form.zone_id" required :rules="emptyRules" />
              </div>
            </div>
            <div class="tw-mb-2 tw-flex tw-w-full tw-items-center">
              <div class="tw-mr-2 tw-w-full">
                <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                  {{ t('devices.category') }} <span class="text-primary">*</span>
                </p>
                <v-select :items="categories" v-model="form.category" required :rules="emptyRules" />
              </div>
              <div class="tw-w-full">
                <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                  {{ t('devices.type') }} <span class="text-primary">*</span>
                </p>
                <v-select :items="types" v-model="form.type" required :rules="emptyRules" />
              </div>
            </div>
            <v-divider class=" tw-mb-3 !tw-border-black" />
            <div v-if="storeDevices.model">
              <div v-for="item in storeDevices.model?.props" :key="item.code">
                <div v-if="item.visible.value">
                  <div v-if="item.type === 'bool'">
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }} <span v-if="item.required.value" class="text-primary">*</span>
                    </p>
                    <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-rounded tw-border tw-border-black tw-px-4">
                      <p class="tw-py-3 tw-text-base">
                        {{ item.value ? t('enabled') : t('disabled')}}
                      </p>
                      <v-switch
                        v-model="item.value"
                        color="primary"
                        hide-details
                        :disabled="!item.editable.value"
                      />
                    </div>
                  </div>
                  <div v-else-if="item.type === 'enum'">
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }} <span v-if="item.required.value" class="text-primary">*</span>
                    </p>
                    <v-select
                      v-model="item.value"
                      :items="Object.keys(item.values)"
                      :disabled="!item.editable.value"
                      :rules="item.required ? emptyRules : undefined"
                      required
                    />
                  </div>
                  <div v-else>
                    <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                      {{ item.name }} <span v-if="item.required.value" class="text-primary">*</span>
                    </p>
                    <v-text-field
                      v-model="item.value"
                      :disabled="!item.editable.value"
                      :rules="!item.required ? emptyRules : undefined"
                      required
                    />
                  </div>
                </div>
              </div>
              <div v-if="storeDevices.model?.category === 'sensor'">
                <div class="tw-mb-4" v-for="port in storeDevices.model?.children" :key="port.id">
                  <p class="text-primary tw-mb-2 tw-pt-3 tw-text-2xl tw-font-semibold">
                    {{port.name}}
                  </p>
                  <div class="tw-mb-1" v-for="item in port.props" :key="item.code">
                    <div v-if="item.visible.value">
                      <div v-if="item.type === 'bool'">
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }} <span v-if="item.required.value" class="text-primary">*</span>
                        </p>
                        <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between tw-rounded tw-border tw-border-black tw-px-4">
                          <p class="tw-py-3 tw-text-base">
                            {{ item.value ? t('enabled') : t('disabled') }}
                          </p>
                          <v-switch
                            :disabled="!item.editable.value"
                            v-model="item.value"
                            color="primary"
                            hide-details
                            :rules="!item.required ? emptyRules : undefined"
                            required
                          />
                        </div>
                      </div>
                      <div v-else-if="item.type === 'enum'">
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }} <span v-if="item.required.value" class="text-primary">*</span>
                        </p>
                        <v-select
                          v-model="item.value"
                          :disabled="!item.editable.value"
                          :items="Object.keys(item.values)"
                          :rules="!item.required ? emptyRules : undefined"
                          required
                        />
                      </div>
                      <div v-else>
                        <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                          {{ item.name }} <span v-if="item.required.value" class="text-primary">*</span>
                        </p>
                        <v-text-field
                          v-model="item.value"
                          :disabled="!item.editable.value"
                          :type="item.type === 'int' || item.type === 'float' ? 'number' : 'text'"
                          :rules="!item.required ? emptyRules : undefined"
                          required
                        />
                      </div>
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
              <v-btn
                class="tw-mr-2"
                color="primary"
                variant="outlined"
                @click="dialog = false"
              >
                {{ t('cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!valid"
                :loading="loading"
                @click="createDevice"
              >
                {{ t('next') }}
              </v-btn>
            </div>
          </div>
        </v-form>
      </StepPanel>
      <StepPanel value="2">
        <DevicesFeaturesForm />
        <div class="tw-flex tw-justify-between">
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
          >
            {{ t('goBack') }}
          </v-btn>
          <div>
            <v-btn
              class="tw-mr-2"
              color="primary"
              variant="outlined"
            >
              {{ t('cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!valid"
              :loading="loading"
            >
              {{ t('next') }}
            </v-btn>
          </div>
        </div>
      </StepPanel>
      <StepPanel value="3">
        <div class="tw-flex tw-justify-between">
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
          >
            {{ t('goBack') }}
          </v-btn>
          <div>
            <v-btn
              class="tw-mr-2"
              color="primary"
              variant="outlined"
            >
              {{ t('cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!valid"
              :loading="loading"
            >
              {{ t('save') }}
            </v-btn>
          </div>
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

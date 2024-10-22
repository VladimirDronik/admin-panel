<script setup lang="ts">
import _ from 'lodash';

import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const toast = useToast();

const dialog = defineModel({
  default: false,
});

// Composables
const storeDevices = useDevicesStore();
const {
  emptyRules,
} = useValidation();

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'created'): void
}>();

// Variables
const valid = ref(false);
const loading = ref(false);
const loadingModel = ref(false);

const form = ref({
  name: '',
  type: '',
  category: 'controller',
});

// Computed Properties
const types = computed(() => _.uniq(_.map(_.filter(storeDevices.types, ['category', form.value.category]), 'type')));
const categories = computed(() => _.uniq(_.map(storeDevices.types, 'category')));

const props = computed(() => {
  if (storeDevices.model?.props) {
    return storeDevices.model.props.map((item) => item.value);
  }
});
const childrenProps = computed(() => {
  if (storeDevices.model?.children) {
    return storeDevices.model?.children.map((item) => item?.props.map((item) => item.value))[0];
  }
});

// Methods
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
      type: '',
      category: 'controller',
    };
  } catch (error: any) {
    showError(error?.data?.error);
  }
  loading.value = false;
};

const getModel = async () => {
  loadingModel.value = true;
  if (form.value.type && form.value.category) {
    await storeDevices.getModelApi({
      type: form.value.type,
      category: form.value.category,
    });
  }
  loadingModel.value = false;
};

const showError = (text: string) => {
  toast.add({
    severity: 'error',
    summary: 'Ошибка создания',
    detail: 'Устройство не было создано',
    life: 5000,
  });
};

const propsModel = (props: any[] | undefined) => {
  if (!props) return [];
  const result = props.map((item) => ({
    ...item,
    required: {
      func: item.required.func,
      funcText: String(item.required.func),
      value: item.required.func(storeDevices.userAccessLevel, props),
    },
    editable: {
      func: item.editable.func,
      funcText: String(item.editable.func),
      value: item.editable.func(storeDevices.userAccessLevel, props),
    },
    visible: {
      func: item.visible.func,
      funcText: String(item.visible.func),
      value: item.visible.func(storeDevices.userAccessLevel, props),
    },
  }));
  return result;
};

const updateFields = () => {
  if (storeDevices.model) {
    storeDevices.model = {
      ...storeDevices.model,
      props: propsModel(storeDevices.model.props),
      children: storeDevices.model.children?.map((item) => ({
        ...item,
        props: propsModel(item.props) ?? [],
      })),
    };
  }
};

// Watchers
watch(() => form.value.type, getModel);

watch(() => form.value.category, async () => {
  form.value.type = '';
  storeDevices.model = null;
  getModel();
});

watch([props, childrenProps], (newValue, oldValue) => {
  if (!_.isEqual(newValue, oldValue)) {
    updateFields();
  }
}, {
  immediate: true,
});
</script>

<template>
  <div>
    <BaseDialog v-model="dialog" :width="1200">
      <template v-slot:button>
        <v-btn color="primary" class="text-capitalize" @click="dialog = true">
          {{ t('devices.addDevice') }}
        </v-btn>
      </template>

      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <p class="tw-mb-4 tw-pl-2 tw-text-2xl tw-font-semibold">
          {{ t('devices.addTitleDevice') }}
        </p>
        <v-btn @click="dialog = false" icon size="small" variant="text">
          <XIcon class="white" />
        </v-btn>
      </div>

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
                <div>
                  <p class="tw-mb-1.5 tw-text-lg tw-font-semibold">
                    {{ t('devices.title') }} <span class="text-primary">*</span>
                  </p>
                  <v-text-field v-model="form.name" required :rules="emptyRules" />
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
                                {{ item.value ? 'Включено' : 'Выключено'}}
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
                  <p v-if="!loadingModel" class="tw-text-center tw-text-xl">
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
            <div class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-px-4 tw-py-2">
              <div class="tw-flex tw-items-center tw-justify-between">
                <p class="tw-text-lg tw-font-semibold">
                  ON
                </p>
                <div class="tw-flex tw-items-center tw-justify-end">
                  <v-btn class="tw-mr-2" variant="text" size="small" prepend-icon="mdi-cog">
                    Настройка
                  </v-btn>
                  <v-switch hide-details color="primary" />
                </div>
              </div>
              <p class="tw-mb-2">
                Событие при включении
              </p>
              <p>
                <span class="text-primary tw-mr-2">
                  Метод 1
                </span>
                <span class="text-warning tw-mr-2">
                  Пауза 1
                </span>
                <span class="text-info tw-mr-2">
                  Скрипт 1
                </span>
                <span class="text-error">
                  Уведомление 1
                </span>
              </p>
            </div>
            <div class="tw-border-grey tw-mb-2 tw-rounded-md tw-border tw-border-solid tw-p-4">
              <div class="tw-mb-3 tw-flex tw-items-center tw-justify-between">
                <p class="tw-text-lg tw-font-semibold">
                  Toggle
                </p>
                <div class="tw-flex tw-items-center tw-justify-end">
                  <v-btn color="primary" size="small" prepend-icon="mdi-plus">
                    Добавить
                  </v-btn>
                </div>
              </div>
              <p class="tw-mb-2">
                Событие при переключении
              </p>
              <p>
                Нет действий
              </p>
            </div>
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

    </BaseDialog>
  </div>
</template>

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
import { deviceEventTypes } from '~/staticData/modelEvents';
import {
  type CreateDeviceInitialForm, type FormTypes, type DynamicFormData, type DeviceCreateFormPayload, type AddFieldToDynamicFormPayload,
} from './form.types';
import {
  Controller, GenericInput, Relay, ObjectsCategory, Conditioner,
  RS485,
  Counter,
  Regulator,
} from '~/types/DevicesEnums';
import { transformToDeviceCreateFormPayload } from '~/utils/api-payload-transformers';
import { getInitialCreateDeviceFormDataByTypes } from '~/components/forms/byTypes/initial-dynamic-form-data';
import { iconMap, type IconMapKey } from '~/staticData/iconMap';

// Composables
const { t } = useI18n();
const { updateData } = useUtils();
const storeRooms = useRoomsStore();
const storeDevices = useDevicesStore();
const storeUser = useUserStore();

const initialForm = defineModel<CreateDeviceInitialForm>('form', {
  required: true,
});

const initialFormData = _.cloneDeep(getInitialCreateDeviceFormDataByTypes({ ...initialForm.value })) as DynamicFormData;
const dynamicForm = reactive(initialFormData);

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

// Variables
const apiCreateDevice = ref<APIData<any>>();

const events = ref<Event[]>();

const eventTypes = ref(_.cloneDeep(deviceEventTypes));

const showOnokomSelect = ref(false);

const typesLoading = ref(false);
const tagSearch = ref('');

// Computed Properties
// const types = computed(() => _.uniq(_.map(storeDevices.types?.data?.response, 'type')));
const typeOptions = computed(() => storeDevices.types?.data?.response?.map((item) => ({
  label: item.name,
  value: item.type as FormTypes,
})));
const tags = computed(() => (storeDevices.tags?.data?.response ? _.uniq(Object.keys(storeDevices.tags?.data?.response)) : []));

const groupedTypeOptions = computed(() => {
  const onokom: { label: string; value: string }[] = [];
  const others: { label: string; value: FormTypes }[] = [];

  typeOptions.value?.forEach((type) => {
    if (type.value.startsWith('onokom/')) {
      const subtype = type.value.split('/')[1];
      onokom.push({
        label: subtype,
        value: type.value,
      });
    } else {
      others.push(type);
    }
  });

  return { onokom, others };
});
// const categories = computed(() => _.uniq(_.map(storeDevices.types?.data?.response, 'category')));

const isRoomSelectDisabled = computed(() => initialForm.value.type === 'regulator');

const displayedTags = computed(() => initialForm.value.tags.slice(0, 9));

const valid = computed(() => {
  // checkValidInput(form.value.zone_id) &&
  const main = checkValidInput(initialForm.value.type) && checkValidInput(dynamicForm.name);

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
      eventTypes.value = _.cloneDeep(deviceEventTypes);
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
  const body = computed<DeviceCreateFormPayload>(() => ({
    ...transformToDeviceCreateFormPayload({
      ...initialForm.value,
      ...dynamicForm,
    }),
    events: events.value?.map((item) => ({
      actions: item.actions,
      name: item.code,
    }))
      .filter((item) => item.actions.length > 0),
  }));
  /// Консоль для работы, пока идут создания девайсов
  // console.log(body);
  const data: unknown = await useAPI(paths.objects, {
    body,
    method: 'POST',
    immediate: false,
    watch: false,
  });

  apiCreateDevice.value = data as APIData<any>;
});

const changeTypeHandler = () => {
  Object.assign(dynamicForm, _.cloneDeep(getInitialCreateDeviceFormDataByTypes({ ...initialForm.value })));
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
    case Regulator.Regulator:
      dynamicForm.category = ObjectsCategory.Regulator;
      break;
    case RS485.Bus:
      dynamicForm.category = ObjectsCategory.RS485;
      break;
    case Counter.ImpulseCounter:
      dynamicForm.category = ObjectsCategory.Counter;
      break;
    case Conditioner.OnokomAUX1MBB:
    case Conditioner.OnokomDK1MBB:
    case Conditioner.OnokomGR1MBB:
    case Conditioner.OnokomGR3MBB:
    case Conditioner.OnokomHR1MBB:
    case Conditioner.OnokomHS3MBB:
    case Conditioner.OnokomHS6MBB:
    case Conditioner.OnokomME1MBB:
    case Conditioner.OnokomMH8MBB:
    case Conditioner.OnokomTCL1MBB:
      dynamicForm.category = ObjectsCategory.Conditioner;
      break;
    default:
      dynamicForm.category = ObjectsCategory.Sensor;
  }
};

const toggleTag = (tag: string) => {
  if (!initialForm.value.tags) {
    initialForm.value.tags = [];
  }
  const index = initialForm.value.tags.indexOf(tag);
  if (index === -1) {
    initialForm.value.tags.push(tag);
  } else {
    initialForm.value.tags = initialForm.value.tags.filter((t) => t !== tag);
  }
};

const removeTag = (tag: string) => {
  initialForm.value.tags = initialForm.value.tags.filter((t) => t !== tag);
};

const isSelectedTag = (tagName: string): boolean => initialForm.value.tags.includes(tagName);

const isTagMatched = (tag: string) => tag.toLowerCase().includes(tagSearch.value.toLowerCase()) && tagSearch.value.length > 0;

const handleTagEnter = () => {
  const match = tags.value.find(
    (tag) => tag.toLowerCase() === tagSearch.value.toLowerCase(),
  );
  if (match && !initialForm.value.tags.includes(match)) {
    initialForm.value.tags.push(match);
  }
  tagSearch.value = '';
};

const clearTagSearch = () => {
  tagSearch.value = '';
};

const handleTypeSelection = (type: FormTypes) => {
  initialForm.value.type = type;
  changeTypeHandler();
};

const getButtonClasses = (isSelected: boolean) => {
  if (storeUser.isDark) {
    return 'tw-border tw-border-dark';
  }
  if (isSelected) {
    return 'tw-border';
  }
  return 'tw-border shadow';
};

const getButtonStyle = (isSelected: boolean) => {
  if (isSelected) {
    return {
      backgroundColor: storeUser.isDark ? '#484848' : '#EDF3F2',
    };
  }
  return {
    backgroundColor: 'transparent',
  };
};

watch(
  () => initialForm.value.tags,
  async (updatedTags) => {
    typesLoading.value = true;
    await storeDevices.getTypesApi({ tags: updatedTags.join(';') }, false);
    typesLoading.value = false;

    if (updatedTags.length === 0) {
      initialForm.value.type = '' as FormTypes;
    }
  },
  { deep: true },
);

</script>

<template>
  <Stepper
    class="basis-[50rem]"
    :dialog="dialog"
    :form="initialForm"
    linear
    :model="model"
    :value="'1'"
  >
    <StepList>
      <Step value="1">
        {{ t('devices.features') }}
      </Step>
      <Step value="2">
        {{ t('devices.events') }}
      </Step>
      <Step value="3">
        {{ t('devices.management') }}
      </Step>
    </StepList>

    <StepPanels>
      <StepPanel
        v-slot="{ activateCallback }"
        value="1"
      >
        <form>
          <div>
            <div>
              <p class="tw-mb-2 tw-text-sm tw-font-medium">
                {{ t('devices.tags') }} <span class="tw-text-primary">*</span>
              </p>
              <div class="style-container tw-mb-4 tw-flex tw-h-[51px] tw-flex-wrap tw-items-center tw-gap-2 tw-rounded-lg tw-p-2">
                <Chip
                  v-for="tag in displayedTags"
                  :key="tag"
                  class="tw-rounded-lg tw-bg-[#D6E4E1] tw-px-3 tw-py-1"
                  :label="tag"
                  removable
                  @remove="removeTag(tag)"
                />
                <InputText
                  v-model="tagSearch"
                  class="no-bg-focus tw-min-w-[100px] tw-max-w-[50%] tw-flex-1 tw-border-none tw-shadow-none tw-outline-none focus:tw-ring-0"
                  @blur="clearTagSearch"
                  @keydown.enter.prevent="handleTagEnter"
                />
                <span
                  v-if="initialForm.tags.length > 9"
                  class="tw-text-sm tw-font-medium tw-text-gray-500"
                >
                  +{{ initialForm.tags.length - 9 }}
                </span>
              </div>
              <div class="и tw-mb-4 tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-2">
                <Tag
                  v-for="tag in tags"
                  :key="tag"
                  class="tw-cursor-pointer tw-rounded-md tw-px-3 tw-py-1 tw-text-sm"
                  :class="{
                    'tw-border tw-border-green-500 tw-text-green-700': isTagMatched(tag),
                    'tw-bg-green-200': isSelectedTag(tag),
                  }"
                  :severity="isSelectedTag(tag) ? 'success' : undefined"
                  :value="tag"
                  @click="toggleTag(tag)"
                >
                  <p class="tw-font-thin">
                    {{ tag }}
                  </p>
                </Tag>
              </div>
            </div>
            <!-- <SharedUILabel
              class="tw-mb-4"
              :title="t('devices.tags')"
            >
              <MultiSelect
                v-model="initialForm.tags"
                class="tw-w-full"
                filter
                :max-selected-labels="5"
                :options="tags"
              />
            </SharedUILabel> -->
            <!-- <SharedUILabel
              class="tw-mb-4"
              required
              :title="t('devices.type') "
            >
              <Select
                v-model="initialForm.type"
                class="tw-w-full"
                option-label="label"
                option-value="value"
                :options="typeOptions"
                @change="changeTypeHandler"
              />
            </SharedUILabel> -->
            <div
              v-if="initialForm.tags.length"
              class="tw-mb-4"
            >
              <p class="tw-mb-2 tw-text-sm tw-font-medium">
                {{ t('devices.type') }} <span class="tw-text-primary">*</span>
              </p>

              <div
                v-if="typesLoading"
                class="tw-flex tw-h-20 tw-items-center tw-justify-center"
              >
                <ProgressSpinner
                  stroke-width="4"
                  style="width: 40px; height: 40px"
                />
              </div>

              <div
                v-else
                class="tw-flex tw-flex-wrap tw-gap-3"
              >
                <div
                  v-if="groupedTypeOptions.onokom.length"
                  class="tw-w-1/2 tw-pr-2"
                >
                  <button
                    class="tw-flex tw-h-[80px] tw-w-[155px] tw-items-center tw-justify-center tw-rounded-lg tw-border tw-p-4 tw-text-center tw-text-sm"
                    :class="getButtonClasses(showOnokomSelect)"
                    :style="getButtonStyle(showOnokomSelect)"
                    type="button"
                    @click="showOnokomSelect = !showOnokomSelect"
                  >
                    <component
                      :is="iconMap['onokom/hr_1_mb_b' as keyof typeof iconMap]"
                      class="tw-shrink-0"
                      size="24"
                      stroke-width="1.5"
                    />
                    <span class="tw-ml-2 tw-break-words tw-text-sm">{{ t('devices.conditionersOnokom') }}</span>
                  </button>

                  <div v-if="showOnokomSelect">
                    <SharedUILabel
                      class="tw-mt-4"
                      :title="t('devices.gatewayTypeOnokom')"
                    >
                      <Select
                        v-model="initialForm.type"
                        class="tw-w-full"
                        option-label="label"
                        option-value="value"
                        :options="groupedTypeOptions.onokom"
                        @change="changeTypeHandler"
                      />
                    </SharedUILabel>
                  </div>
                </div>

                <button
                  v-for="type in groupedTypeOptions.others"
                  :key="type.value"
                  class="tw-flex tw-h-[80px] tw-w-[155px] tw-items-center tw-justify-center tw-rounded-lg tw-border tw-p-4 tw-text-center tw-text-sm"
                  :class="getButtonClasses(initialForm.type === type.value)"
                  :style="getButtonStyle(initialForm.type === type.value)"
                  type="button"
                  @click="handleTypeSelection(type.value)"
                >
                  <component
                    :is="iconMap[type.value as IconMapKey]"
                    class="tw-shrink-0"
                    size="24"
                    stroke-width="1.5"
                  />
                  <span class="tw-ml-2 tw-break-words tw-text-sm">{{ type.label }}</span>
                </button>
                <div
                  v-if="typeOptions.length === 0 && initialForm.tags.length"
                  class="tw-flex tw-w-full tw-justify-center"
                >
                  <p class="tw-text-center">
                    {{ t('devices.noTypesFound') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Divider class="tw-mt-0 tw-pb-3" />

          <div class="tw-mb-4 tw-flex tw-gap-4">
            <SharedUILabel
              required
              :title="t('devices.title')"
            >
              <InputText
                v-model="dynamicForm.name"
                class="tw-w-full"
              />
            </SharedUILabel>
            <SharedUILabel :title="t('devices.room')">
              <Select
                v-model="dynamicForm.zone_id"
                class="tw-w-full"
                :disabled="isRoomSelectDisabled"
                option-label="name"
                option-value="code"
                :options="storeRooms.getRoomsSelect"
                :show-clear="true"
              />
            </SharedUILabel>
          </div>

          <Divider class="tw-pb-3" />

          <!-- Dynamically renders the form component based on the selected device type -->
          <DeviceFormDynamicDevice
            v-model:dynamic-form="dynamicForm"
            :add-field-to-dynamic-form="addChildrenToDynamicFormCB"
            :device-type="initialForm.type"
            @update:valid="devicesDynamicFormValidityHandler"
          />
        </form>

        <div class="tw-flex tw-justify-end">
          <Button
            :disabled="!valid"
            @click="activateCallback('2')"
          >
            {{ t('next') }}
          </Button>
        </div>
      </StepPanel>
      <StepPanel
        v-slot="{ activateCallback }"
        value="2"
      >
        <FormsEventForm
          v-model="events"
          :event-types="eventTypes"
          :model-type="initialForm.type"
          target-type="object"
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
      <StepPanel
        v-slot="{ activateCallback }"
        value="3"
      >
        Пока пусто
        <div class="tw-flex tw-justify-between">
          <Button @click="activateCallback('2')">
            {{ t('goBack') }}
          </Button>
          <Button
            color="primary"
            :label="t('save')"
            :loading="apiCreateDevice?.pending && apiCreateDevice.status !== 'idle'"
            @click="createDevice"
          />
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<style scoped lang="scss">
.style-container {
  background: var(--p-inputtext-background);
}

.shadow {
  box-shadow:
    0px 4px 20px rgba(18, 114, 90, 0.15),
    0px 2px 4px rgba(18, 114, 90, 0.08);
}

.border-dark {
  border: 2px solid #484848;
}

:deep(.no-bg-focus.p-inputtext:focus) {
  background-color: transparent !important;
}

</style>

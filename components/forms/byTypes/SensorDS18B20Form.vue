<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { type ModelRef } from 'vue';
import { DevicePropertyKey, Controller, DeviceInterface } from '~/types/DevicesEnums';
import type {
  DynamicFormData, AddFieldToDynamicFormPayload, DeviceChildrenRequired, DeviceChildren,
} from '~/components/devices/form.types';
import type { DeviceParentId, DevicePort } from '~/types/DevicesTypes';

const parentId = defineModel('parent-id') as ModelRef<DeviceParentId>;
const sdaPort = defineModel<DevicePort>('sda-port');

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);
const controllerIdRef = computed(() => parentId.value);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

const props = defineProps<{
  isEditing: boolean;
  addFieldToDynamicForm: AddFieldToDynamicFormPayload;
}>();

const dynamicForm = defineModel<DynamicFormData & { children: DeviceChildrenRequired } >('dynamic-form', { required: true });

const initialForm: DeviceChildren = {
  [DevicePropertyKey.Temperature]: {
    value: 0,
    value_updated_at: '',
    min_error_value: -41,
    min_threshold: -40,
    max_threshold: 100,
    max_error_value: 101,
    unit: '°C',
    write_graph: false,
  },
};

Object.entries(initialForm).forEach(([key, value]) => props.addFieldToDynamicForm(key as DevicePropertyKey, value));

const { t } = useI18n();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
  update_interval: dynamicForm.value.props.update_interval,
  minThresholdTemp: dynamicForm.value.children.temperature.min_threshold,
  maxThresholdTemp: dynamicForm.value.children.temperature.max_threshold,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  update_interval: z.number().default(300),
  minThresholdTemp: z.number().min(-40),
  maxThresholdTemp: z.number().max(100),
});

const resolver = ref(zodResolver(schema));

watch(
  () => dynamicForm.value,
  () => {
    const flatFormData = flatForm.value;
    const validationResult = schema.safeParse(flatFormData);
    const isValid = validationResult.success;
    emit('update:valid', isValid);
  },
  { deep: true },
);

const sensorMockData = {
  data: [
    { value: 23, unit: '°C', label: t('devices.temperature') },
  ],
  lastUpdate: '26.09.2024 15:27:59',
};
</script>

<template>
  <Form :resolver="resolver" :form="dynamicForm">
    <FormsSensorHeader v-if="props.isEditing" v-bind="{ ...sensorMockData }" v-model:name="dynamicForm.name" v-model:update-interval="dynamicForm.props.update_interval" v-model:zone-id="dynamicForm.zone_id" />
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>
    <SharedUILabel class="tw-mb-2" :title="t('devices.controller')" required :value="dynamicForm.parent_id" name="controller">
      <Select
        v-model="dynamicForm.parent_id"
        :options="controllers"
        optionLabel="name"
        optionValue="id"
        class="tw-w-full"
      />
    </SharedUILabel>
    <SharedUILabel class="tw-mb-2" :title="t('devices.mode')" required :value="dynamicForm.props.interface" name="interface">
      <div class="tw-flex tw-items-center">
        <RadioButton class="tw-mr-1" inputId="single-mode" v-model="dynamicForm.props.interface" :value="DeviceInterface['1W']" />
        <label for="single-mode" class="tw-mr-4"> {{ t('devices.single') }}</label>
        <RadioButton class="tw-mr-1" inputId="bus-mode" v-model="dynamicForm.props.interface" :value="DeviceInterface['1WBUS']" />
        <label for="bus-mode"> {{ t('devices.bus') }}</label>
      </div>
    </SharedUILabel>

    <SharedUILabel required class="tw-mb-2" :title="t('devices.port')">
      <Select v-model="sdaPort" :options="formattedPorts" optionLabel="label" optionValue="value" class="tw-w-full" />
    </SharedUILabel>

    <SharedUILabel required class="tw-mb-2" v-if="dynamicForm.props.interface === '1WBUS'" :title="t('devices.address16')">
      <InputNumber id="address" v-model="dynamicForm.busAdress" class="tw-w-full" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.polling')" required :value="dynamicForm.props.update_interval" name="update_interval">
      <InputNumber suffix=" sec" id="update_interval" v-model="dynamicForm.props.update_interval" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider v-if="!props.isEditing" class="tw-mt-0 tw-pb-3" />

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.temperature') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="dynamicForm.children.temperature.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel
        class="tw-flex-col"
        required
        :value="dynamicForm.children.temperature.min_threshold"
        name="minThresholdTemp"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="dynamicForm.children.temperature.min_threshold" suffix=" °C" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="dynamicForm.children.temperature.max_threshold" name="maxThresholdTemp" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="dynamicForm.children.temperature.max_threshold" suffix=" °C" />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel class="tw-flex-col" :value="dynamicForm.children.temperature.min_error_value" :title="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')">
        <InputNumber v-model="dynamicForm.children.temperature.min_error_value" suffix=" °C" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="dynamicForm.children.temperature.max_error_value" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="dynamicForm.children.temperature.max_error_value" suffix=" °C" />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style>

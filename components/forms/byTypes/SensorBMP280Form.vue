<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { DevicePropertyKey } from '~/types/DevicesEnums';
import type {
  DynamicFormData, AddFieldToDynamicFormPayload, DeviceChildrenRequired, DeviceChildren,
} from '~/components/devices/form.types';

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
    max_threshold: 85,
    max_error_value: 86,
    unit: '°C',
    write_graph: false,
  },
  [DevicePropertyKey.Pressure]: {
    value: 0,
    value_updated_at: '',
    min_error_value: 224,
    min_threshold: 225,
    max_threshold: 825,
    max_error_value: 826,
    unit: 'mmHg',
    write_graph: false,
  },
};

Object.entries(initialForm).forEach(([key, value]) => props.addFieldToDynamicForm(key as DevicePropertyKey, value));

const { t } = useI18n();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
  sclPort: dynamicForm.value.sclPort,
  update_interval: dynamicForm.value.props.update_interval,
  minThresholdTemp: dynamicForm.value.children.temperature.min_threshold,
  maxThresholdTemp: dynamicForm.value.children.temperature.max_threshold,
  minThresholdPressure: dynamicForm.value.children.pressure.min_threshold,
  maxThresholdPressure: dynamicForm.value.children.pressure.max_threshold,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  sclPort: z.number().min(1),
  update_interval: z.number().default(300),
  minThresholdTemp: z.number().min(-40),
  maxThresholdTemp: z.number().max(85),
  minThresholdPressure: z.number().min(225),
  maxThresholdPressure: z.number().max(825),
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
    { value: 226, unit: 'mmHg', label: t('devices.pressure') },
  ],
  lastUpdate: '26.09.2024 15:27:59',
};
</script>

<template>
  <Form :resolver="resolver" :form="dynamicForm">
    <FormsSensorHeader v-if="props.isEditing" v-bind="{ ...sensorMockData }" v-model:name="dynamicForm.name" v-model:update-interval="dynamicForm.props.update_interval" v-model:zone-id="dynamicForm.zone_id" />
    <FormsSensorBasicPlacement v-model:parent-id="dynamicForm.parent_id" v-model:sda-port="dynamicForm.sdaPort" v-model:scl-port="dynamicForm.sclPort" />

    <!-- Интервал опроса -->

    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.polling')" required :value="dynamicForm.props.update_interval" name="update_interval">
      <InputNumber suffix=" sec" id="update_interval" v-model="dynamicForm.props.update_interval" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider v-if="!props.isEditing" class="tw-mt-0 tw-pb-3" />

    <!-- Температура-->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.temperature') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="dynamicForm.children.temperature.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
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
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel class="tw-flex-col" :value="dynamicForm.children.temperature.min_error_value" :title="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')">
        <InputNumber v-model="dynamicForm.children.temperature.min_error_value" suffix=" °C" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="dynamicForm.children.temperature.max_error_value" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="dynamicForm.children.temperature.max_error_value" suffix=" °C" />
      </SharedUILabel>
    </div>

    <!-- Давление -->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.pressure') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="dynamicForm.children.pressure.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        required
        :value="dynamicForm.children.pressure.min_threshold"
        name="minThresholdPressure"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="dynamicForm.children.pressure.min_threshold" suffix=" mmHg" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="dynamicForm.children.pressure.max_threshold" name="maxThresholdPressure" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="dynamicForm.children.pressure.max_threshold" suffix=" mmHg" />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        :value="dynamicForm.children.pressure.min_error_value"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
      >
        <InputNumber v-model="dynamicForm.children.pressure.min_error_value" suffix=" mmHg" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="dynamicForm.children.pressure.max_error_value" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="dynamicForm.children.pressure.max_error_value" suffix=" mmHg" />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style>

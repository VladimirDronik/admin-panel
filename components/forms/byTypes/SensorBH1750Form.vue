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
  [DevicePropertyKey.Illumination]: {
    value: 0,
    value_updated_at: '',
    min_error_value: -1,
    min_threshold: 0,
    max_threshold: 65535,
    max_error_value: 65536,
    unit: 'lx',
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
  minThresholdIllumination: dynamicForm.value.children.illumination.min_threshold,
  maxThresholdIllumination: dynamicForm.value.children.illumination.max_threshold,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  sclPort: z.number().min(1),
  update_interval: z.number().default(300),
  minThresholdIllumination: z.number().min(0),
  maxThresholdIllumination: z.number().max(65535),
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
    { value: 2300, unit: 'lx', label: t('devices.illumination') },
  ],
  lastUpdate: '26.09.2024 15:27:59',
};

</script>

<template>
  <div />
  <Form :resolver="resolver" :form="dynamicForm">
    <FormsSensorHeader v-if="props.isEditing" v-bind="{ ...sensorMockData }" v-model:name="dynamicForm.name" v-model:update-interval="dynamicForm.props.update_interval" v-model:zone-id="dynamicForm.zone_id" />
    <FormsSensorBasicPlacement v-model:parent-id="dynamicForm.parent_id" v-model:sda-port="dynamicForm.sdaPort" v-model:scl-port="dynamicForm.sclPort" />

    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.polling')" required :value="dynamicForm.props.update_interval" name="update_interval">
      <InputNumber suffix=" sec" id="update_interval" v-model="dynamicForm.props.update_interval" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider v-if="!props.isEditing" class="tw-mt-0 tw-pb-3" />

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.illumination') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="dynamicForm.children.illumination.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        required
        :value="dynamicForm.children.illumination.min_threshold"
        name="minAvailableIllumination"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="dynamicForm.children.illumination.min_threshold" suffix=" lx" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="dynamicForm.children.illumination.max_threshold" name="maxAvailableIllumination" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="dynamicForm.children.illumination.max_threshold" suffix=" lx" />
      </SharedUILabel>
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        :value="dynamicForm.children.illumination.min_error_value"
        name="minAlarmIllumination"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
      >
        <InputNumber v-model="dynamicForm.children.illumination.min_error_value" suffix=" lx" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="dynamicForm.children.illumination.max_error_value" name="maxAlarmIllumination" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="dynamicForm.children.illumination.max_error_value" suffix=" lx" />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style>

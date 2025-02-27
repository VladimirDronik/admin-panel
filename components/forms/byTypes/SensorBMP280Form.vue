<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type {
  DynamicFormData, DeviceChildrenRequired,
} from '~/components/device/form/form.types';
import { units } from '~/staticData/updateIntervalOptions';

const props = defineProps<{
  isEditing: boolean;
}>();

const dynamicForm = defineModel<DynamicFormData & { children: DeviceChildrenRequired } >('dynamic-form', { required: true });

const { t } = useI18n();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
  sclPort: dynamicForm.value.sclPort,
  minThresholdTemp: dynamicForm.value.children.temperature.min_threshold,
  maxThresholdTemp: dynamicForm.value.children.temperature.max_threshold,
  minThresholdPressure: dynamicForm.value.children.pressure.min_threshold,
  maxThresholdPressure: dynamicForm.value.children.pressure.max_threshold,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  sclPort: z.number().min(1),
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

const sensorDataToShow = computed(() => {
  const { temperature } = dynamicForm.value.children;
  const { pressure } = dynamicForm.value.children;

  const lastUpdate = temperature.value_updated_at || pressure.value_updated_at || '';

  return {
    data: [
      {
        value: temperature.value ?? 0,
        unit: '°C',
        label: t('devices.temperature'),
      },
      {
        value: pressure.value ?? 0,
        unit: 'mmHg',
        label: t('devices.pressure'),
      },
    ],
    lastUpdate,
  };
});
</script>

<template>
  <Form
    :form="dynamicForm"
    :resolver="resolver"
  >
    <FormsSensorHeader
      v-if="props.isEditing"
      v-bind="{ ...sensorDataToShow }"
      v-model:name="dynamicForm.name"
      v-model:numeric-value="dynamicForm.props.numericValue"
      v-model:selected-unit="dynamicForm.props.selectedUnit"
      v-model:zone-id="dynamicForm.zone_id"
    />
    <FormsSensorBasicPlacement
      v-model:parent-id="dynamicForm.parent_id"
      v-model:scl-port="dynamicForm.sclPort"
      v-model:sda-port="dynamicForm.sdaPort"
    />

    <!-- Интервал опроса -->

    <SharedUILabel
      v-if="!props.isEditing"
      class="tw-mb-4"
      required
      :title="t('devices.polling')"
    >
      <div class="p-inputgroup tw-w-2/4">
        <InputNumber
          v-model="dynamicForm.props.numericValue"
          class="tw-w-1/2"
        />
        <Select
          v-model="dynamicForm.props.selectedUnit"
          class="tw-w-1/2"
          option-label="label"
          option-value="value"
          :options="units"
        />
      </div>
    </SharedUILabel>

    <Divider
      v-if="!props.isEditing"
      class="tw-mt-0 tw-pb-3"
    />

    <!-- Температура-->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.temperature') }}
    </p>

    <SharedUILabel
      class="text-primary-custom tw-mb-2"
      :title="t('devices.graphing')"
    >
      <ToggleSwitch v-model="dynamicForm.children.temperature.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] ">
      <SharedUILabel
        class="tw-flex-col"
        name="minThresholdTemp"
        required
        :title="`${t('devices.minAvailability')}`"
        :tooltip="t('devices.tooltipMinAvailability')"
        :value="dynamicForm.children.temperature.min_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.temperature.min_threshold"
          disabled
          suffix=" °C"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name="maxThresholdTemp"
        required
        :title="`${t('devices.maxAvailability')}`"
        :value="dynamicForm.children.temperature.max_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.temperature.max_threshold"
          disabled
          suffix=" °C"
        />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] ">
      <SharedUILabel
        class="tw-flex-col"
        :title="`${t('devices.minAlarm')}`"
        :tooltip="t('devices.tooltipMinAlarm')"
        :value="dynamicForm.children.temperature.min_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.temperature.min_error_value"
          suffix=" °C"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        :title="`${t('devices.maxAlarm')}`"
        :value="dynamicForm.children.temperature.max_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.temperature.max_error_value"
          suffix=" °C"
        />
      </SharedUILabel>
    </div>

    <!-- Давление -->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.pressure') }}
    </p>

    <SharedUILabel
      class="text-primary-custom tw-mb-2"
      :title="t('devices.graphing')"
    >
      <ToggleSwitch v-model="dynamicForm.children.pressure.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] ">
      <SharedUILabel
        class="tw-flex-col"
        name="minThresholdPressure"
        required
        :title="`${t('devices.minAvailability')}`"
        :tooltip="t('devices.tooltipMinAvailability')"
        :value="dynamicForm.children.pressure.min_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.pressure.min_threshold"
          disabled
          suffix=" mmHg"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name="maxThresholdPressure"
        required
        :title="`${t('devices.maxAvailability')}`"
        :value="dynamicForm.children.pressure.max_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.pressure.max_threshold"
          disabled
          suffix=" mmHg"
        />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] ">
      <SharedUILabel
        class="tw-flex-col"
        :title="`${t('devices.minAlarm')}`"
        :tooltip="t('devices.tooltipMinAlarm')"
        :value="dynamicForm.children.pressure.min_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.pressure.min_error_value"
          suffix=" mmHg"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        :title="`${t('devices.maxAlarm')}`"
        :value="dynamicForm.children.pressure.max_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.pressure.max_error_value"
          suffix=" mmHg"
        />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

:deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 200px;
}
</style>

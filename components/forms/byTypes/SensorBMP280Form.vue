<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';

const { t } = useI18n();

const form = ref({
  controller: null,
  sdaPort: null,
  sclPort: null,
  update_interval: 300,
  enableGraphingTemp: false,
  minAvailableTemp: -40,
  maxAvailableTemp: 85,
  minAlarmTemp: 0,
  maxAlarmTemp: 0,
  enableGraphingPressure: false,
  minAvailablePressure: 225,
  maxAvailablePressure: 825,
  minAlarmPressure: 0,
  maxAlarmPressure: 0,
  name: '',
  zone_id: '',
  address: '',
});

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'update:valid']);

const schema = z.object({
  controller: z.number().min(1),
  sdaPort: z.number().min(1),
  sclPort: z.number().min(1),
  update_interval: z.number().min(300),
  minAvailableTemp: z.number().min(-40),
  maxAvailableTemp: z.number().max(85),
  minAvailablePressure: z.number().min(225),
  maxAvailablePressure: z.number().max(825),
});

const resolver = ref(zodResolver(schema));

watch(
  form,
  (newValue) => {
    emit('update:modelValue', newValue);

    const validationResult = schema.safeParse(newValue);
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
  <Form :resolver="resolver" :form="form">
    <FormsSensorHeader v-if="props.isEditing" v-bind="{ ...sensorMockData }" :form="{ update_interval: form.update_interval, name: form.name, zone_id: form.zone_id }" />
    <FormsSensorBasicPlacement v-model:form="form" />

    <!-- Интервал опроса -->

    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.polling')" required :value="form.update_interval" name="update_interval">
      <InputNumber suffix=" sec" id="update_interval" v-model="form.update_interval" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider v-if="!props.isEditing" class="tw-mt-0 tw-pb-3" />

    <!-- Температурные настройки -->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.temperature') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingTemp" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        required
        :value="form.minAvailableTemp"
        name="minAvailableTemp"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="form.minAvailableTemp" suffix=" °C" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="form.maxAvailableTemp" name="maxAvailableTemp" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="form.maxAvailableTemp" suffix=" °C" />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel class="tw-flex-col" :value="form.minAlarmTemp" name="minAlarmTemp" :title="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')">
        <InputNumber v-model="form.minAlarmTemp" suffix=" °C" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="form.maxAlarmTemp" name="maxAlarmTemp" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="form.maxAlarmTemp" suffix=" °C" />
      </SharedUILabel>
    </div>

    <!-- Давление -->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.pressure') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingPressure" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        required
        :value="form.minAvailablePressure"
        name="minAvailablePressure"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="form.minAvailablePressure" suffix=" mmHg" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="form.maxAvailablePressure" name="maxAvailablePressure" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="form.maxAvailablePressure" suffix=" mmHg" />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        :value="form.minAlarmPressure"
        name="minAlarmPressure"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
      >
        <InputNumber v-model="form.minAlarmPressure" suffix=" mmHg" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="form.maxAlarmPressure" name="maxAlarmPressure" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="form.maxAlarmPressure" suffix=" mmHg" />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';

const { t } = useI18n();

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'update:valid']);

const form = ref({
  controller: null,
  sdaPort: null,
  sclPort: null,
  update_interval: 300,
  enableGraphingIllumination: false,
  minAvailableIllumination: 0,
  maxAvailableIllumination: 65535,
  minAlarmIllumination: 0,
  maxAlarmIllumination: 0,
  name: '',
  zone_id: '',
  address: '',
});

const schema = z.object({
  controller: z.number().min(1),
  sdaPort: z.number().min(1),
  sclPort: z.number().min(1),
  update_interval: z.number().min(300),
  minAvailableIllumination: z.number().min(0),
  maxAvailableIllumination: z.number().max(65535),
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
    { value: 2300, unit: 'lx', label: t('devices.illumination') },
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

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.illumination') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingIllumination" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        required
        :value="form.minAvailableIllumination"
        name="minAvailableIllumination"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="form.minAvailableIllumination" suffix=" lx" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="form.maxAvailableIllumination" name="maxAvailableIllumination" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="form.maxAvailableIllumination" suffix=" lx" />
      </SharedUILabel>
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        :value="form.minAlarmIllumination"
        name="minAlarmIllumination"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
      >
        <InputNumber v-model="form.minAlarmIllumination" suffix=" lx" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="form.maxAlarmIllumination" name="maxAlarmIllumination" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="form.maxAlarmIllumination" suffix=" lx" />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style>

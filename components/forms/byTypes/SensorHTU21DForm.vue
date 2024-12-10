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
  pollInterval: 300,
  enableGraphingTemp: false,
  minAvailableTemp: -40,
  maxAvailableTemp: 105,
  minAlarmTemp: 0,
  maxAlarmTemp: 0,
  enableGraphingHumidity: false,
  minAvailableHumidity: 0,
  maxAvailableHumidity: 100,
  minAlarmHumidity: 0,
  maxAlarmHumidity: 0,
  title: 'EXAMPLE',
  room: '',
});

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
});

const resolver = ref(
  zodResolver(
    z.object({
      controller: z.number().min(1),
      sdaPort: z.number().min(1),
      sclPort: z.number().min(1),
      pollInterval: z.number().default(300),
      minAvailableTemp: z.number().min(-40),
      maxAvailableTemp: z.number().max(105),
      minAvailableHumidity: z.number().min(0),
      maxAvailableHumidity: z.number().max(100),
    }),
  ),
);

const handleSubmit = ({ valid }: { valid: boolean; }) => {
  if (valid) {
    console.log('Форма успешно отправлена:', form.value);
    // Логика отправки данных на сервер
  } else {
    console.log('Форма содержит ошибки');
  }
};

const sensorMockData = {
  data: [
    { value: 23, unit: '°C', label: t('devices.temperature') },
    { value: 40, unit: '%', label: t('devices.humidity') },
  ],
  lastUpdate: '26.09.2024 15:27:59',
};

</script>

<template>
  <Form :resolver="resolver" @submit="handleSubmit">
    <FormsSensorHeader v-if="props.isEditing" v-bind="{ ...sensorMockData }" :form="{ pollInterval: form.pollInterval, title: form.title, room: form.room }" />
    <FormsSensorBasicPlacement v-model:form="form" />

    <!-- Интервал опроса -->

    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.polling')" required :value="form.pollInterval" name="pollInterval">
      <InputNumber suffix=" sec" id="pollInterval" v-model="form.pollInterval" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider v-if="!props.isEditing" class="tw-mt-0 tw-pb-3" />

    <!-- Температура -->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.temperature') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingTemp" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
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
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel class="tw-flex-col" :value="form.minAlarmTemp" name="minAlarmTemp" :title="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')">
        <InputNumber v-model="form.minAlarmTemp" suffix=" °C" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="form.maxAlarmTemp" name="maxAlarmTemp" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="form.maxAlarmTemp" suffix=" °C" />
      </SharedUILabel>
    </div>

    <!-- Влажность -->

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.humidity') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingHumidity" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel
        class="tw-flex-col"
        required
        :value="form.minAvailableHumidity"
        name="minAvailableHumidity"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="form.minAvailableHumidity" suffix=" %" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" required :value="form.maxAvailableHumidity" name="maxAvailableHumidity" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="form.maxAvailableHumidity" suffix=" %" />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel
        class="tw-flex-col"
        :value="form.minAlarmHumidity"
        name="minAlarmHumidity"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
      >
        <InputNumber v-model="form.minAlarmHumidity" suffix=" %" />
      </SharedUILabel>
      <SharedUILabel class="tw-flex-col !tw-items-start" :value="form.maxAlarmHumidity" name="maxAlarmHumidity" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber v-model="form.maxAlarmHumidity" suffix=" %" />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style>

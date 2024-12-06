<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Controller } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';

const { t } = useI18n();

const form = ref({
  controller: null,
  sdaPort: null,
  sclPort: null,
  pollInterval: 300,
  enableGraphingTemp: false,
  minAvailableTemp: -40,
  maxAvailableTemp: 85,
  minAlarmTemp: 0,
  maxAlarmTemp: 0,
  enableGraphingHumidity: false,
  minAvailableHumidity: 0,
  maxAvailableHumidity: 100,
  minAlarmHumidity: 0,
  maxAlarmHumidity: 0,
  enableGraphingPressure: false,
  minAvailablePressure: 225,
  maxAvailablePressure: 825,
  minAlarmPressure: 0,
  maxAlarmPressure: 0,
});

const resolver = ref(
  zodResolver(
    z.object({
      controller: z.number().min(1),
      sdaPort: z.number().min(1),
      sclPort: z.number().min(1),
      pollInterval: z.number().min(300),
      minAvailableTemp: z.number().min(-40),
      maxAvailableTemp: z.number().max(85),
      minAvailableHumidity: z.number().min(0),
      maxAvailableHumidity: z.number().max(100),
      minAvailablePressure: z.number().min(225),
      maxAvailablePressure: z.number().max(825),
    }),
  ),
);

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);
const controllerIdRef = computed(() => form.value.controller);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

const handleSubmit = ({ valid }: { valid: boolean; }) => {
  if (valid) {
    console.log('Форма успешно отправлена:', form.value);
    // Логика отправки данных на сервер
  } else {
    console.log('Форма содержит ошибки');
  }
};
</script>

<template>
  <Form :resolver="resolver" @submit="handleSubmit">
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>

    <SharedUILabel class="tw-mb-2" :title="t('devices.controller')" required :value="form.controller" name="controller">
      <Select :options="controllers" optionLabel="name" optionValue="id" class="tw-w-full" v-model="form.controller" />
    </SharedUILabel>

    <!-- Порт SDA -->
    <SharedUILabel class="tw-mb-2" :title="t('devices.portSDA')" required :value="form.controller" name="controller">
      <Select v-model="form.sdaPort" :options="formattedPorts" optionLabel="label" optionValue="value" class="tw-w-full" />
    </SharedUILabel>

    <!-- Порт SCL -->
    <SharedUILabel class="tw-mb-2" :title="t('devices.portSCL')" required :value="form.sclPort" name="sclPort">
      <Select v-model="form.sclPort" :options="formattedPorts" optionLabel="label" optionValue="value" class="tw-w-full" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <!-- Интервал опроса -->

    <SharedUILabel class="tw-mb-2" :title="t('devices.polling')" required :value="form.pollInterval" name="pollInterval">
      <InputNumber suffix=" sec" id="pollInterval" v-model="form.pollInterval" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <!-- Температурные настройки -->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.temperature') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingTemp" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        required
        :value="form.minAvailableTemp"
        name="minAvailableTemp"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="form.minAvailableTemp" suffix=" °C" />
      </SharedUILabel>
      <SharedUILabel required :value="form.maxAvailableTemp" name="maxAvailableTemp" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="form.maxAvailableTemp" suffix=" °C" />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel :value="form.minAlarmTemp" name="minAlarmTemp" :title="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')">
        <InputNumber class="tw-ml-8" v-model="form.minAlarmTemp" suffix=" °C" />
      </SharedUILabel>
      <SharedUILabel :value="form.maxAlarmTemp" name="maxAlarmTemp" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber class="tw-ml-2" v-model="form.maxAlarmTemp" suffix=" °C" />
      </SharedUILabel>
    </div>

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.humidity') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingHumidity" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        required
        :value="form.minAvailableHumidity"
        name="minAvailableHumidity"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="form.minAvailableHumidity" suffix=" %" />
      </SharedUILabel>
      <SharedUILabel required :value="form.maxAvailableHumidity" name="maxAvailableHumidity" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="form.maxAvailableHumidity" suffix=" %" />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        :value="form.minAlarmHumidity"
        name="minAlarmHumidity"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
      >
        <InputNumber class="tw-ml-8" v-model="form.minAlarmHumidity" suffix=" %" />
      </SharedUILabel>
      <SharedUILabel :value="form.maxAlarmHumidity" name="maxAlarmHumidity" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber class="tw-ml-2" v-model="form.maxAlarmHumidity" suffix=" %" />
      </SharedUILabel>
    </div>

    <!-- Давление -->
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.pressure') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingPressure" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        required
        :value="form.minAvailablePressure"
        name="minAvailablePressure"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="form.minAvailablePressure" suffix=" mmHg" />
      </SharedUILabel>
      <SharedUILabel required :value="form.maxAvailablePressure" name="maxAvailablePressure" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="form.maxAvailablePressure" suffix=" mmHg" />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        :value="form.minAlarmPressure"
        name="minAlarmPressure"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
      >
        <InputNumber class="tw-ml-8" v-model="form.minAlarmPressure" suffix=" mmHg" />
      </SharedUILabel>
      <SharedUILabel :value="form.maxAlarmPressure" name="maxAlarmPressure" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber class="tw-ml-2" v-model="form.maxAlarmPressure" suffix=" mmHg" />
      </SharedUILabel>
    </div>

    <div class="tw-mt-4 tw-flex tw-justify-end">
      <Button type="submit" :label="t('next')" class="tw-mt-4" />
    </div>
  </Form>
</template>

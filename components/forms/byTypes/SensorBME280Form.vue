<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { Sensor } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';

const { t } = useI18n();

const schema = z.object({
  sdaPort: z.string().nullable(),
  sclPort: z.string().nullable(),
  pollInterval: z.number().nullable().default(0),
  // Температура
  minAvailableTemp: z.number().nullable().default(0),
  maxAvailableTemp: z.number().nullable().default(0),
  minAlarmTemp: z.number().nullable().default(0),
  maxAlarmTemp: z.number().nullable().default(0),
  enableGraphingTemp: z.boolean(),
  // Влажность
  minAvailableHumidity: z.number().nullable().default(0),
  maxAvailableHumidity: z.number().nullable().default(0),
  minAlarmHumidity: z.number().nullable().default(0),
  maxAlarmHumidity: z.number().nullable().default(0),
  enableGraphingHumidity: z.boolean(),
  // Давление
  minAvailablePressure: z.number().nullable().default(0),
  maxAvailablePressure: z.number().nullable().default(0),
  minAlarmPressure: z.number().nullable().default(0),
  maxAlarmPressure: z.number().nullable().default(0),
  enableGraphingPressure: z.boolean(),
});

type FormSchema = z.infer<typeof schema>;

const { handleSubmit } = useForm<FormSchema>({
  validationSchema: toTypedSchema(schema),
});

const { value: sdaPort, errorMessage: sdaPortError } = useField<FormSchema['sdaPort']>('sdaPort');
const { value: sclPort, errorMessage: sclPortError } = useField<FormSchema['sclPort']>('sclPort');
const { value: pollInterval, errorMessage: pollIntervalError } = useField<FormSchema['pollInterval']>('pollInterval');

// Температура
const { value: minAvailableTemp } = useField<FormSchema['minAvailableTemp']>('minAvailableTemp');
const { value: maxAvailableTemp } = useField<FormSchema['maxAvailableTemp']>('maxAvailableTemp');
const { value: minAlarmTemp } = useField<FormSchema['minAlarmTemp']>('minAlarmTemp');
const { value: maxAlarmTemp } = useField<FormSchema['maxAlarmTemp']>('maxAlarmTemp');
const { value: enableGraphingTemp } = useField<FormSchema['enableGraphingTemp']>('enableGraphingTemp');

// Влажность
const { value: minAvailableHumidity } = useField<FormSchema['minAvailableHumidity']>('minAvailableHumidity');
const { value: maxAvailableHumidity } = useField<FormSchema['maxAvailableHumidity']>('maxAvailableHumidity');
const { value: minAlarmHumidity } = useField<FormSchema['minAlarmHumidity']>('minAlarmHumidity');
const { value: maxAlarmHumidity } = useField<FormSchema['maxAlarmHumidity']>('maxAlarmHumidity');
const { value: enableGraphingHumidity } = useField<FormSchema['enableGraphingHumidity']>('enableGraphingHumidity');

// Давление
const { value: minAvailablePressure } = useField<FormSchema['minAvailablePressure']>('minAvailablePressure');
const { value: maxAvailablePressure } = useField<FormSchema['maxAvailablePressure']>('maxAvailablePressure');
const { value: minAlarmPressure } = useField<FormSchema['minAlarmPressure']>('minAlarmPressure');
const { value: maxAlarmPressure } = useField<FormSchema['maxAlarmPressure']>('maxAlarmPressure');
const { value: enableGraphingPressure } = useField<FormSchema['enableGraphingPressure']>('enableGraphingPressure');

const submitForm = (values: FormSchema) => {
  const dataToSave = {
    pollInterval: values.pollInterval,
    temperatureSettings: {
      minAvailable: values.minAvailableTemp,
      maxAvailable: values.maxAvailableTemp,
      minAlarm: values.minAlarmTemp,
      maxAlarm: values.maxAlarmTemp,
      enableGraphing: values.enableGraphingTemp,
    },
    humiditySettings: {
      minAvailable: values.minAvailableHumidity,
      maxAvailable: values.maxAvailableHumidity,
      minAlarm: values.minAlarmHumidity,
      maxAlarm: values.maxAlarmHumidity,
      enableGraphing: values.enableGraphingHumidity,
    },
    pressureSettings: {
      minAvailable: values.minAvailablePressure,
      maxAvailable: values.maxAvailablePressure,
      minAlarm: values.minAlarmPressure,
      maxAlarm: values.maxAlarmPressure,
      enableGraphing: values.enableGraphingPressure,
    },
    ports: {
      sda: values.sdaPort,
      scl: values.sclPort,
    },
  };

  console.log('Validated Values:', values);
  console.log('Data to Save:', dataToSave);

  // Логика отправки на сервер
};

const ports = ref<{ name: string }[]>([]);

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Sensor.BME280);
</script>

<template>
  <form class="tw-text-lg tw-font-semibold" @submit.prevent="handleSubmit(submitForm)">
    <p class="tw-mb-4">{{ t('devices.placement') }}</p>

    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.controller')" />
      <Select :options="controllers" optionLabel="name" class="tw-w-full" />
    </div>

    <!-- Порт SDA -->
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.portSDA')" />
      <Select id="sdaPort" v-model="sdaPort" :options="ports" optionLabel="name" class="tw-w-full" />
      <p v-if="sdaPortError" class="tw-text-red-500">{{ sdaPortError }}</p>
    </div>

    <!-- Порт SCL -->
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.portSCL')" />
      <Select id="sclPort" v-model="sclPort" :options="ports" optionLabel="name" class="tw-w-full" />
      <p v-if="sclPortError" class="tw-text-red-500">{{ sclPortError }}</p>
    </div>

    <Divider class="tw-mt-0 tw-pb-3" />

    <!-- Интервал опроса -->
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.polling')" />
      <InputNumber suffix=" sec" id="pollInterval" v-model="pollInterval" class="tw-w-1/4" />
      <p v-if="pollIntervalError" class="tw-text-red-500">{{ pollIntervalError }}</p>
    </div>

    <Divider class="tw-mt-0 tw-pb-3" />

    <!-- Температурные настройки -->
    <p class="tw-mb-4">{{ t('devices.temperature') }}</p>

    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.graphing')" />
      <ToggleSwitch v-model="enableGraphingTemp" />
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <SharedUIFormLabel :label="`${t('devices.minAvailability')}:`" :tooltip="t('devices.tooltipMinAvailability')" />
      <InputNumber v-model="minAvailableTemp" suffix="°C" />
      <SharedUIFormLabel :label="t('devices.maxAvailability')" />
      <InputNumber v-model="maxAvailableTemp" suffix="°C" />
    </div>

    <div class="tw-mb-4 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <SharedUIFormLabel :label="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')" />
      <InputNumber v-model="minAlarmTemp" suffix="°C" />
      <SharedUIFormLabel :label="t('devices.maxAlarm')" />
      <InputNumber v-model="maxAlarmTemp" suffix="°C" />
    </div>

    <p class="tw-mb-4">{{ t('devices.humidity') }}</p>

    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.graphing')" />
      <ToggleSwitch v-model="enableGraphingHumidity" />
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <SharedUIFormLabel :label="`${t('devices.minAvailability')}:`" :tooltip="t('devices.tooltipMinAvailability')" />
      <InputNumber v-model="minAvailableHumidity" suffix="%" />
      <SharedUIFormLabel :label="t('devices.maxAvailability')" />
      <InputNumber v-model="maxAvailableHumidity" suffix="%" />
    </div>

    <div class="tw-mb-4 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <SharedUIFormLabel :label="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')" />
      <InputNumber v-model="minAlarmHumidity" suffix="%" />
      <SharedUIFormLabel :label="t('devices.maxAlarm')" />
      <InputNumber v-model="maxAlarmHumidity" suffix="%" />
    </div>

    <!-- Давление -->
    <p class="tw-mb-4">{{ t('devices.pressure') }}</p>

    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.graphing')" />
      <ToggleSwitch v-model="enableGraphingPressure" />
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <SharedUIFormLabel :label="`${t('devices.minAvailability')}:`" :tooltip="t('devices.tooltipMinAvailability')" />
      <InputNumber v-model="minAvailablePressure" suffix=" hPa" />
      <SharedUIFormLabel :label="t('devices.maxAvailability')" />
      <InputNumber v-model="maxAvailablePressure" suffix=" hPa" />
    </div>

    <div class="tw-mb-4 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <SharedUIFormLabel :label="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')" />
      <InputNumber v-model="minAlarmPressure" suffix=" hPa" />
      <SharedUIFormLabel :label="t('devices.maxAlarm')" />
      <InputNumber v-model="maxAlarmPressure" suffix=" hPa" />
    </div>
  </form>
</template>

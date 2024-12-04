<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { Sensor } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';

const { t } = useI18n();

const schema = z.object({
  mode: z.enum(['single', 'bus']),
  address: z.string().nullable(),
  port: z.string().nullable(),
  pollInterval: z.number().nullable().default(0),
  minAvailableTemp: z.number().nullable().default(0),
  maxAvailableTemp: z.number().nullable().default(0),
  minAlarmTemp: z.number().nullable().default(0),
  maxAlarmTemp: z.number().nullable().default(0),
  enableGraphing: z.boolean(),
});

type FormSchema = z.infer<typeof schema>;

const { handleSubmit } = useForm<FormSchema>({
  validationSchema: toTypedSchema(schema),
});

const { value: mode } = useField<FormSchema['mode']>('mode');
const { value: address, errorMessage: addressError } = useField<FormSchema['address']>('address');
const { value: port, errorMessage: portError } = useField<FormSchema['port']>('port');
const { value: pollInterval, errorMessage: pollIntervalError } = useField<FormSchema['pollInterval']>('pollInterval');
const { value: minAvailableTemp } = useField<FormSchema['minAvailableTemp']>('minAvailableTemp');
const { value: maxAvailableTemp } = useField<FormSchema['maxAvailableTemp']>('maxAvailableTemp');
const { value: minAlarmTemp } = useField<FormSchema['minAlarmTemp']>('minAlarmTemp');
const { value: maxAlarmTemp } = useField<FormSchema['maxAlarmTemp']>('maxAlarmTemp');
const { value: enableGraphing } = useField<FormSchema['enableGraphing']>('enableGraphing');

// Сохранение данных формы
const submitForm = (values: z.infer<typeof schema>) => {
  const dataToSave = {
    interface: values.mode === 'single' ? '1W' : '1WBUS',
    address: values.mode === 'single' ? values.port : `${values.port};${values.address}`,
    pollInterval: values.pollInterval,
    temperatureSettings: {
      minAvailable: values.minAvailableTemp,
      maxAvailable: values.maxAvailableTemp,
      minAlarm: values.minAlarmTemp,
      maxAlarm: values.maxAlarmTemp,
      enableGraphing: values.enableGraphing,
    },
  };

  console.log('Validated Values:', values);
  console.log('Data to Save:', dataToSave);

  // Добавить логику отправки `dataToSave` на сервер.
};

const ports = ref<{ name: string }[]>([]);

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Sensor.DS18B20);
</script>

<template>
  <form class="tw-text-lg tw-font-semibold" @submit.prevent="handleSubmit(submitForm)">
    <p class="tw-mb-4">{{ t('devices.placement') }}</p>

    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.controller')" />
      <Select :options="controllers" optionLabel="name" class="tw-w-full" />
    </div>

    <!-- Режим -->
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.mode')" />
      <div class="tw-flex tw-items-center">
        <RadioButton class="tw-mr-1" id="single" v-model="mode" :value="'single'" />
        <label for="single-mode" class="tw-mr-4"> {{ t('devices.single') }}</label>
        <RadioButton class="tw-mr-1" id="bus" v-model="mode" :value="'bus'" />
        <label for="bus-mode"> {{ t('devices.bus') }}</label>
      </div>
    </div>

    <!-- Порт -->
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.port')" />
      <Select id="port" v-model="port" :options="ports" optionLabel="name" class="tw-w-full" />
      <p v-if="portError" class="tw-text-red-500">{{ portError }}</p>
    </div>

    <!-- Адрес (только для режима 'bus') -->
    <div v-if="mode === 'bus'" class="custom-grid">
      <SharedUIFormLabel :label="t('devices.address16')" />
      <InputText id="address" v-model="address" class="tw-w-full" />
      <p v-if="addressError" class="tw-text-red-500">{{ addressError }}</p>
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
      <ToggleSwitch v-model="enableGraphing" />
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
  </form>
</template>

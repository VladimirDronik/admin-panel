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
  minAvailableIllumination: z.number().nullable().default(0),
  maxAvailableIllumination: z.number().nullable().default(0),
  minAlarmIllumination: z.number().nullable().default(0),
  maxAlarmIllumination: z.number().nullable().default(0),
  enableGraphingIllumination: z.boolean(),
});

type FormSchema = z.infer<typeof schema>;

const { handleSubmit } = useForm<FormSchema>({
  validationSchema: toTypedSchema(schema),
});

const { value: sdaPort, errorMessage: sdaPortError } = useField<FormSchema['sdaPort']>('sdaPort');
const { value: sclPort, errorMessage: sclPortError } = useField<FormSchema['sclPort']>('sclPort');
const { value: pollInterval, errorMessage: pollIntervalError } = useField<FormSchema['pollInterval']>('pollInterval');
const { value: minAvailableIllumination } = useField<FormSchema['minAvailableIllumination']>('minAvailableIllumination');
const { value: maxAvailableIllumination } = useField<FormSchema['maxAvailableIllumination']>('maxAvailableIllumination');
const { value: minAlarmIllumination } = useField<FormSchema['minAlarmIllumination']>('minAlarmIllumination');
const { value: maxAlarmIllumination } = useField<FormSchema['maxAlarmIllumination']>('maxAlarmIllumination');
const { value: enableGraphingIllumination } = useField<FormSchema['enableGraphingIllumination']>('enableGraphingIllumination');

// const address = computed(() => {
//   const sda = ports.value.find((port) => port.name === sdaPort.value)?.id;
//   const scl = ports.value.find((port) => port.name === sclPort.value)?.id;
//   return sda && scl ? `${sda};${scl}` : null;
// });

// Сохранение данных формы
const submitForm = (values: FormSchema) => {
  const dataToSave = {
    // address: address.value,
    pollInterval: values.pollInterval,
    illuminationSettings: {
      minAvailable: values.minAvailableIllumination,
      maxAvailable: values.maxAvailableIllumination,
      minAlarm: values.minAlarmIllumination,
      maxAlarm: values.maxAlarmIllumination,
      enableGraphing: values.enableGraphingIllumination,
    },
    ports: {
      sda: values.sdaPort,
      scl: values.sclPort,
    },
  };

  console.log('Validated Values:', values);
  //   console.log('Generated Address:', address.value);
  console.log('Data to Save:', dataToSave);

  // Логика отправки на сервер
};

const ports = ref<{ name: string }[]>([]);

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Sensor.BH1750);
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

    <p class="tw-mb-4">{{ t('devices.illumination') }}</p>

    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.graphing')" />
      <ToggleSwitch v-model="enableGraphingIllumination" />
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <SharedUIFormLabel :label="`${t('devices.minAvailability')}:`" :tooltip="t('devices.tooltipMinAvailability')" />
      <InputNumber v-model="minAvailableIllumination" suffix=" lx" />
      <SharedUIFormLabel :label="t('devices.maxAvailability')" />
      <InputNumber v-model="maxAvailableIllumination" suffix=" lx" />
    </div>

    <div class="tw-mb-4 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <SharedUIFormLabel :label="`${t('devices.minAlarm')}:`" :tooltip="t('devices.tooltipMinAlarm')" />
      <InputNumber v-model="minAlarmIllumination" suffix=" lx" />
      <SharedUIFormLabel :label="t('devices.maxAlarm')" />
      <InputNumber v-model="maxAlarmIllumination" suffix=" lx" />
    </div>
  </form>
</template>

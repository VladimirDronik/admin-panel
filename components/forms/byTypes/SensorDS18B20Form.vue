<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Controller } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';
import { useControllerPortsViaId } from '~/composables/useControllerPortsViaId';

const { t } = useI18n();

const form = ref({
  controller: null,
  mode: '',
  port: '',
  address: '',
  pollInterval: 300,
  enableGraphingTemp: false,
  minAvailableTemp: -40,
  maxAvailableTemp: 100,
  minAlarmTemp: 0,
  maxAlarmTemp: 0,
});

const resolver = ref(
  zodResolver(
    z.object({
      controller: z.number().min(1),
      mode: z.string().min(1),
      port: z.number().min(1),
      address: z.number().min(1),
      pollInterval: z.number().min(300),
      minAvailableTemp: z.number().min(-40),
      maxAvailableTemp: z.number().max(100),
    }),
  ),
);

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);
const controllerIdRef = computed(() => form.value.controller);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

const address = computed(() => {
  const { port, mode } = form.value;

  if (!port) {
    return ''; // Если порт не выбран, возвращаем пустую строку
  }

  const selectedPort = formattedPorts.value.find((p) => p.value === Number(port));

  if (!selectedPort) {
    return '';
  }

  if (mode === '1WBUS') {
    const sensorAddress = form.value.address.split(';')[1] || '';
    return `${selectedPort.number};${sensorAddress}`;
  } if (mode === '1W') {
    return `${selectedPort.number}`;
  }

  return '';
});

watch(
  address,
  (newAddress) => {
    if (form.value.mode !== '1WBUS' || form.value.address === '' || form.value.address.includes(';')) {
      form.value.address = newAddress;
    }
  },
  { immediate: true },
);

const handleSubmit = ({ valid }: { valid: boolean;}) => {
  if (valid) {
    console.log('Форма успешно отправлена:', form.value);
    console.log('SDA Port ID:', form.value.port);
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

    <!-- Режим -->
    <SharedUILabel class="tw-mb-2" :title="t('devices.mode')" required :value="form.mode" name="mode">
      <div class="tw-flex tw-items-center">
        <RadioButton class="tw-mr-1" id="single" v-model="form.mode" :value="'1W'" />
        <label for="single-mode" class="tw-mr-4"> {{ t('devices.single') }}</label>
        <RadioButton class="tw-mr-1" id="bus" v-model="form.mode" :value="'1WBUS'" />
        <label for="bus-mode"> {{ t('devices.bus') }}</label>
      </div>
    </SharedUILabel>

    <!-- Порт -->
    <SharedUILabel required class="tw-mb-2" :title="t('devices.port')">
      <Select v-model="form.port" :options="formattedPorts" optionLabel="label" optionValue="value" class="tw-w-full" />
    </SharedUILabel>

    <!-- Адрес (только для режима 'bus') -->
    <SharedUILabel required class="tw-mb-2" v-if="form.mode === '1WBUS'" :title="t('devices.address16')">
      <InputText id="address" v-model="form.address" class="tw-w-full" />
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

    <div class="tw-mt-4 tw-flex tw-justify-end">
      <Button type="submit" :label="t('next')" class="tw-mt-4" />
    </div>
  </Form>
</template>

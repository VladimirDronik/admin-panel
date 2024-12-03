<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface SensorFormData {
  mode: 'single' | 'bus';
  address: string;
  port: string;
  pollInterval: number | null;
  minAvailableTemp: number | null;
  maxAvailableTemp: number | null;
  minAlarmTemp: number | null;
  maxAlarmTemp: number | null;
  enableGraphing: boolean;
}

const formData = reactive<SensorFormData>({
  mode: 'single',
  address: '',
  port: '',
  pollInterval: 0,
  minAvailableTemp: 0,
  maxAvailableTemp: 0,
  minAlarmTemp: 0,
  maxAlarmTemp: 0,
  enableGraphing: false,
});

// Сохранение данных формы
const submitForm = () => {
  const dataToSave = {
    interface: formData.mode === 'single' ? '1W' : '1WBUS',
    address: formData.mode === 'single' ? formData.port : `${formData.port};${formData.address}`,
    pollInterval: formData.pollInterval,
    temperatureSettings: {
      minAvailable: formData.minAvailableTemp,
      maxAvailable: formData.maxAvailableTemp,
      minAlarm: formData.minAlarmTemp,
      maxAlarm: formData.maxAlarmTemp,
      enableGraphing: formData.enableGraphing,
    },
  };

  // Логирование собранных данных
  console.log('Form Data:', formData);
  console.log('Data to Save:', dataToSave);

  // Добавить логику отправки `dataToSave` на сервер.
};

const controllers = ref([{ name: 'controller 1' }, { name: 'controller 2' }]);
const ports = ref([{ name: 'port 1' }, { name: 'port 2' }]);
</script>

<template>
  <form class="tw-text-lg tw-font-semibold" @submit.prevent="submitForm">
    <p class="tw-mb-4">{{ t('devices.placement') }}</p>

    <div class="custom-grid">
      <span>{{ t('devices.controller') }}</span>
      <Select :options="controllers" optionLabel="name" class="tw-w-full" />
    </div>
    <!-- Режим -->
    <div class="custom-grid">
      <span> {{ t('devices.mode') }} </span>
      <div class="tw-flex tw-items-center">
        <RadioButton class="tw-mr-1" id="single" v-model="formData.mode" :value="'single'" />
        <label for="single-mode" class="tw-mr-4"> {{ t('devices.single') }}</label>
        <RadioButton class="tw-mr-1" id="bus" v-model="formData.mode" :value="'bus'" />
        <label for="bus-mode"> {{ t('devices.bus') }}</label>
      </div>
    </div>

    <!-- Порт -->
    <div class="custom-grid">
      <span>{{ t('devices.port') }}</span>
      <Select :options="ports" optionLabel="name" class="tw-w-full" />
    </div>

    <!-- Адрес (только для режима 'bus') -->
    <div v-if="formData.mode === 'bus'" class="custom-grid">
      <span>{{ t('devices.address16') }}</span>
      <InputText id="address" v-model="formData.address" class="tw-w-full" />
    </div>

    <Divider class="tw-mt-0 tw-pb-3" />

    <!-- Интервал опроса -->
    <div class="custom-grid">
      <span>{{ t('devices.polling') }}</span>
      <InputNumber suffix=" sec" class="tw-w-1/4" id="pollInterval" v-model="formData.pollInterval" />
    </div>

    <Divider class="tw-mt-0 tw-pb-3" />

    <!-- Температурные настройки -->
    <p class="tw-mb-4">{{ t('devices.temperature') }}</p>

    <div class="custom-grid">
      <span for="switch">{{ t('devices.graphing') }}</span>
      <InputSwitch v-model="formData.enableGraphing" />
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <span v-tooltip="t('devices.tooltipMinAvailability')">{{ t('devices.minAvailability') }}:</span>
      <InputNumber v-model="formData.minAvailableTemp" suffix="°C" />
      <span>{{ t('devices.maxAvailability') }}:</span>
      <InputNumber v-model="formData.maxAvailableTemp" suffix="°C" />
    </div>
    <div class="tw-mb-4 tw-grid tw-grid-cols-[1.4fr_2fr_1.4fr_2fr] tw-gap-4">
      <span v-tooltip="t('devices.tooltipMinAlarm')">{{ t('devices.minAlarm') }}:</span>
      <InputNumber v-model="formData.minAlarmTemp" suffix="°C" />
      <span>{{ t('devices.maxAlarm') }}:</span>
      <InputNumber v-model="formData.maxAlarmTemp" suffix="°C" />
    </div>
  </form>
</template>

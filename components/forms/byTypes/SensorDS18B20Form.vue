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
  interface: '',
  update_interval: 300,
  enableGraphingTemp: false,
  minAvailableTemp: -40,
  maxAvailableTemp: 100,
  minAlarmTemp: 0,
  maxAlarmTemp: 0,
  name: '',
  zone_id: '',
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
  mode: z.string().min(1),
  port: z.number().min(1),
  address: z.string().min(1),
  update_interval: z.number().min(300),
  minAvailableTemp: z.number().min(-40),
  maxAvailableTemp: z.number().max(100),
});

const resolver = ref(zodResolver(schema));

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);
const controllerIdRef = computed(() => form.value.controller);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

const address = computed(() => {
  const { port, mode } = form.value;
  const selectedPort = formattedPorts.value.find((p) => p.value === Number(port));

  if (!selectedPort) {
    return '';
  }
  if (mode === '1WBUS') {
    form.value.interface = '1WBUS';
    const sensorAddress = form.value.address.split(';')[1] || '';
    return `${selectedPort.number};${sensorAddress}`;
  }

  if (mode === '1W') {
    form.value.interface = '1W';
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
  ],
  lastUpdate: '26.09.2024 15:27:59',
};
</script>

<template>
  <Form :resolver="resolver" :form="form">
    <FormsSensorHeader v-if="props.isEditing" v-bind="{ ...sensorMockData }" :form="{ update_interval: form.update_interval, name: form.name, zone_id: form.zone_id }" />
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>

    <SharedUILabel class="tw-mb-2" :title="t('devices.controller')" required :value="form.controller" name="controller">
      <Select :options="controllers" optionLabel="name" optionValue="id" class="tw-w-full" v-model="form.controller" />
    </SharedUILabel>

    <!-- Режим -->
    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.mode')" required :value="form.mode" name="mode">
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
    <SharedUILabel required class="tw-mb-2" v-if="!props.isEditing && form.mode === '1WBUS'" :title="t('devices.address16')">
      <InputText id="address" v-model="form.address" class="tw-w-full" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

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
  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style>

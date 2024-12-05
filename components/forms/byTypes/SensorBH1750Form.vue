<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Sensor } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';

const { t } = useI18n();

const form = ref({
  controller: null,
  sdaPort: null,
  sclPort: null,
  pollInterval: 300,
  enableGraphingIllumination: false,
  minAvailableIllumination: 0,
  maxAvailableIllumination: 65535,
  minAlarmIllumination: 0,
  maxAlarmIllumination: 0,
});

const resolver = ref(
  zodResolver(
    z.object({
      controller: z.string().min(1),
      sdaPort: z.string().min(1),
      sclPort: z.string().min(1),
      pollInterval: z.number().min(300),
      minAvailableIllumination: z.number().min(0),
      maxAvailableIllumination: z.number().min(65535),
    }),
  ),
);

const ports = ref<{ name: string }[]>([]);

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Sensor.BH1750);
const controllerIds = computed(() => controllers.value.map((controller) => controller.id));
const controllerNames = computed(() => controllers.value.map((controller) => controller.name));

const handleSubmit = ({ valid, values }: { valid: boolean; values: any }) => {
  if (valid) {
    console.log('Форма успешно отправлена:', values);
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
      <Select :options="controllerNames" class="tw-w-full" v-model="form.controller" />
    </SharedUILabel>

    <!-- Порт SDA -->
    <SharedUILabel class="tw-mb-2" :title="t('devices.portSDA')" required :value="form.controller" name="controller">
      <Select v-model="form.sdaPort" :options="ports" optionLabel="name" class="tw-w-full" />
    </SharedUILabel>

    <!-- Порт SCL -->
    <SharedUILabel class="tw-mb-2" :title="t('devices.portSCL')" required :value="form.sclPort" name="sclPort">
      <Select v-model="form.sclPort" :options="ports" optionLabel="name" class="tw-w-full" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <!-- Интервал опроса -->

    <SharedUILabel class="tw-mb-2" :title="t('devices.polling')" required :value="form.pollInterval" name="pollInterval">
      <InputNumber suffix=" sec" id="pollInterval" v-model="form.pollInterval" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.illumination') }}</p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="form.enableGraphingIllumination" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        required
        :value="form.minAvailableIllumination"
        name="minAvailableIllumination"
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
      >
        <InputNumber v-model="form.minAvailableIllumination" suffix=" lx" />
      </SharedUILabel>
      <SharedUILabel required :value="form.maxAvailableIllumination" name="maxAvailableIllumination" :title="`${t('devices.maxAvailability')}:`">
        <InputNumber v-model="form.maxAvailableIllumination" suffix=" lx" />
      </SharedUILabel>
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        :value="form.minAlarmIllumination"
        name="minAlarmIllumination"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
      >
        <InputNumber class="tw-ml-8" v-model="form.minAlarmIllumination" suffix=" lx" />
      </SharedUILabel>
      <SharedUILabel :value="form.maxAlarmIllumination" name="maxAlarmIllumination" :title="`${t('devices.maxAlarm')}:`">
        <InputNumber class="tw-ml-2" v-model="form.maxAlarmIllumination" suffix=" lx" />
      </SharedUILabel>
    </div>

    <div class="tw-mt-4 tw-flex tw-justify-end">
      <Button type="submit" :label="t('next')" class="tw-mt-4" />
    </div>
  </Form>
</template>

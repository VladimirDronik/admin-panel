<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Controller, DeviceInterface } from '~/types/DevicesEnums';
import type {
  DynamicFormData, DeviceChildrenRequired,
} from '~/components/device/form/form.types';
import { units } from '~/staticData/updateIntervalOptions';

const dynamicForm = defineModel<DynamicFormData & { children: DeviceChildrenRequired } >('dynamic-form', { required: true });

const { controllers, getController } = useController();
getController(Controller.MegaD);
const controllerIdRef = computed(() => dynamicForm.value.parent_id);
const { formattedPorts } = usePorts(controllerIdRef);

const props = defineProps<{
  isEditing: boolean;
}>();

const { t } = useI18n();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
  minThresholdTemp: dynamicForm.value.children.temperature.min_threshold,
  maxThresholdTemp: dynamicForm.value.children.temperature.max_threshold,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  minThresholdTemp: z.number().min(-55),
  maxThresholdTemp: z.number().max(125),
});

const resolver = ref(zodResolver(schema));

watch(
  () => dynamicForm.value,
  () => {
    const flatFormData = flatForm.value;
    const validationResult = schema.safeParse(flatFormData);
    const isValid = validationResult.success;
    emit('update:valid', isValid);
  },
  { deep: true },
);

const sensorDataToShow = computed(() => {
  const { temperature } = dynamicForm.value.children;

  const lastUpdate = temperature.value_updated_at || '';

  return {
    data: [
      {
        value: temperature.value ?? 0,
        unit: '°C',
        label: t('devices.temperature'),
      },
    ],
    lastUpdate,
  };
});
</script>

<template>
  <Form
    :form="dynamicForm"
    :resolver="resolver"
  >
    <FormsSensorHeader
      v-if="props.isEditing"
      v-bind="{ ...sensorDataToShow }"
      v-model:name="dynamicForm.name"
      v-model:numeric-value="dynamicForm.props.numericValue"
      v-model:selected-unit="dynamicForm.props.selectedUnit"
      v-model:zone-id="dynamicForm.zone_id"
    />
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.placement') }}
    </p>
    <SharedUILabel
      class="tw-mb-2"
      name="controller"
      required
      :title="t('devices.controller')"
      :value="dynamicForm.parent_id"
    >
      <Select
        v-model="dynamicForm.parent_id"
        class="tw-w-3/4"
        option-label="name"
        option-value="id"
        :options="controllers"
      />
    </SharedUILabel>
    <div class="tw-my-4 tw-flex tw-items-center ">
      <label
        class="tw-mr-4 tw-text-lg tw-font-bold"
        for="single-mode"
      >
        {{ t('devices.mode') }}
        <span class="tw-text-primary">*</span>
      </label>

      <div class="tw-flex tw-items-center">
        <RadioButton
          v-model="dynamicForm.props.interface"
          class="tw-mr-1"
          input-id="single-mode"
          :value="DeviceInterface['1W']"
        />
        <label
          class="tw-mr-4"
          for="single-mode"
        >{{ t('devices.single') }}</label>

        <RadioButton
          v-model="dynamicForm.props.interface"
          class="tw-mr-1"
          input-id="bus-mode"
          :value="DeviceInterface['1WBUS']"
        />
        <label for="bus-mode">{{ t('devices.bus') }}</label>
      </div>
    </div>

    <SharedUILabel
      class="tw-mb-2"
      required
      :title="t('devices.port')"
    >
      <Select
        v-model="dynamicForm.sdaPort"
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="formattedPorts"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="dynamicForm.props.interface === '1WBUS'"
      class="tw-mb-2"
      required
      :title="t('devices.address16')"
    >
      <InputNumber
        v-model="dynamicForm.busAddress"
        class="tw-w-3/4"
      />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <SharedUILabel
      v-if="!props.isEditing"
      class="tw-mb-4"
      required
      :title="t('devices.polling')"
    >
      <div class="p-inputgroup tw-w-2/4">
        <InputNumber
          v-model="dynamicForm.props.numericValue"
          class="tw-w-1/2"
        />
        <Select
          v-model="dynamicForm.props.selectedUnit"
          class="tw-w-1/2"
          option-label="label"
          option-value="value"
          :options="units"
        />
      </div>
    </SharedUILabel>

    <Divider
      v-if="!props.isEditing"
      class="tw-mt-0 tw-pb-3"
    />

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.temperature') }}
    </p>

    <SharedUILabel
      class="text-primary-custom tw-mb-2"
      :title="t('devices.graphing')"
    >
      <ToggleSwitch v-model="dynamicForm.children.temperature.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel
        class="tw-flex-col"
        name="minThresholdTemp"
        required
        :title="`${t('devices.minAvailability')}`"
        :tooltip="t('devices.tooltipMinAvailability')"
        :value="dynamicForm.children.temperature.min_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.temperature.min_threshold"
          disabled
          suffix=" °C"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name="maxThresholdTemp"
        required
        :title="`${t('devices.maxAvailability')}`"
        :value="dynamicForm.children.temperature.max_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.temperature.max_threshold"
          disabled
          suffix=" °C"
        />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel
        class="tw-flex-col"
        :title="`${t('devices.minAlarm')}`"
        :tooltip="t('devices.tooltipMinAlarm')"
        :value="dynamicForm.children.temperature.min_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.temperature.min_error_value"
          suffix=" °C"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        :title="`${t('devices.maxAlarm')}`"
        :value="dynamicForm.children.temperature.max_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.temperature.max_error_value"
          suffix=" °C"
        />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

:deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 200px;
}
</style>

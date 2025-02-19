<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { updateIntervals } from '~/staticData/updateIntervalOptions';
import type {
  DynamicFormData, DeviceChildrenRequired,
} from '~/components/device/form/form.types';

const props = defineProps<{
  isEditing: boolean;
}>();

const dynamicForm = defineModel<DynamicFormData & { children: DeviceChildrenRequired } >('dynamic-form', { required: true });

const { t } = useI18n();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
  sclPort: dynamicForm.value.sclPort,
  update_interval: dynamicForm.value.props.update_interval,
  minThresholdIllumination: dynamicForm.value.children.illumination.min_threshold,
  maxThresholdIllumination: dynamicForm.value.children.illumination.max_threshold,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  sclPort: z.number().min(1),
  minThresholdIllumination: z.number().min(0),
  maxThresholdIllumination: z.number().max(65535),
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
  const { illumination } = dynamicForm.value.children;

  const lastUpdate = illumination.value_updated_at || '';

  return {
    data: [
      {
        value: illumination.value ?? 0,
        unit: 'lx',
        label: t('devices.illumination'),
      },
    ],
    lastUpdate,
  };
});

</script>

<template>
  <div />
  <Form
    :form="dynamicForm"
    :resolver="resolver"
  >
    <FormsSensorHeader
      v-if="props.isEditing"
      v-bind="{ ...sensorDataToShow }"
      v-model:name="dynamicForm.name"
      v-model:update-interval="dynamicForm.props.update_interval"
      v-model:zone-id="dynamicForm.zone_id"
    />
    <FormsSensorBasicPlacement
      v-model:parent-id="dynamicForm.parent_id"
      v-model:scl-port="dynamicForm.sclPort"
      v-model:sda-port="dynamicForm.sdaPort"
    />

    <SharedUILabel
      v-if="!props.isEditing"
      class="tw-mb-2"
      name="update_interval"
      required
      :title="t('devices.polling')"
      :value="dynamicForm.props.update_interval"
    >
      <Select
        id="update_interval"
        v-model="dynamicForm.props.update_interval"
        class="tw-mr-10 tw-w-1/4"
        option-label="label"
        option-value="value"
        :options="updateIntervals"
      />
    </SharedUILabel>

    <Divider
      v-if="!props.isEditing"
      class="tw-mt-0 tw-pb-3"
    />

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.illumination') }}
    </p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="dynamicForm.children.illumination.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        name="minAvailableIllumination"
        required
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
        :value="dynamicForm.children.illumination.min_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.illumination.min_threshold"
          disabled
          suffix=" lx"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name="maxAvailableIllumination"
        required
        :title="`${t('devices.maxAvailability')}:`"
        :value="dynamicForm.children.illumination.max_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.illumination.max_threshold"
          disabled
          suffix=" lx"
        />
      </SharedUILabel>
    </div>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr] tw-gap-4">
      <SharedUILabel
        class="tw-flex-col"
        name="minAlarmIllumination"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
        :value="dynamicForm.children.illumination.min_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.illumination.min_error_value"
          suffix=" lx"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name="maxAlarmIllumination"
        :title="`${t('devices.maxAlarm')}:`"
        :value="dynamicForm.children.illumination.max_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.illumination.max_error_value"
          suffix=" lx"
        />
      </SharedUILabel>
    </div>
  </Form>
</template>

<style scoped>

:deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style>

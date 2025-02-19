<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Controller } from '~/types/DevicesEnums';
import type {
  DynamicFormData, DeviceChildrenRequired,
} from '~/components/device/form/form.types';
import { updateIntervals } from '~/staticData/updateIntervalOptions';

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
  update_interval: dynamicForm.value.props.update_interval,
  minThresholdTemp: dynamicForm.value.children.current.min_threshold,
  maxThresholdTemp: dynamicForm.value.children.current.max_threshold,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  minThresholdTemp: z.number().min(0),
  maxThresholdTemp: z.number().max(10),
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
  const { current } = dynamicForm.value.children;

  const lastUpdate = current.value_updated_at || '';

  return {
    data: [
      {
        value: current.value ?? 0,
        unit: 'u',
        label: t('devices.current'),
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
      v-model:update-interval="dynamicForm.props.update_interval"
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

    <Divider class="tw-mt-0 tw-pb-3" />

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
      {{ t('devices.current') }}
    </p>

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="dynamicForm.children.current.write_graph" />
    </SharedUILabel>

    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel
        class="tw-flex-col"
        name="minThresholdTemp"
        required
        :title="`${t('devices.minAvailability')}:`"
        :tooltip="t('devices.tooltipMinAvailability')"
        :value="dynamicForm.children.current.min_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.current.min_threshold"
          disabled
          suffix=" u"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        name="maxThresholdTemp"
        required
        :title="`${t('devices.maxAvailability')}:`"
        :value="dynamicForm.children.current.max_threshold"
      >
        <InputNumber
          v-model="dynamicForm.children.current.max_threshold"
          disabled
          suffix=" u"
        />
      </SharedUILabel>
    </div>
    <div class="tw-mb-2 tw-grid tw-grid-cols-[1fr_2fr_1fr_2fr]">
      <SharedUILabel
        class="tw-flex-col"
        :title="`${t('devices.minAlarm')}:`"
        :tooltip="t('devices.tooltipMinAlarm')"
        :value="dynamicForm.children.current.min_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.current.min_error_value"
          suffix=" u"
        />
      </SharedUILabel>
      <SharedUILabel
        class="tw-flex-col !tw-items-start"
        :title="`${t('devices.maxAlarm')}:`"
        :value="dynamicForm.children.current.max_error_value"
      >
        <InputNumber
          v-model="dynamicForm.children.current.max_error_value"
          suffix=" u"
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

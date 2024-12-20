<!-- <script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Controller, DeviceInterface } from '~/types/DevicesEnums';
import type {
  DynamicFormData, DeviceChildrenRequired,
} from '~/components/devices/form.types';

const dynamicForm = defineModel<DynamicFormData & { children: DeviceChildrenRequired } >('dynamic-form', { required: true });

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);
const controllerIdRef = computed(() => dynamicForm.value.parent_id);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

const props = defineProps<{
  isEditing: boolean;
}>();

const { t } = useI18n();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
  update_interval: dynamicForm.value.props.update_interval,
  minThresholdTemp: dynamicForm.value.children.temperature.min_threshold,
  maxThresholdTemp: dynamicForm.value.children.temperature.max_threshold,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  update_interval: z.number().default(300),
  minThresholdTemp: z.number().min(-40),
  maxThresholdTemp: z.number().max(100),
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
  <Form :resolver="resolver" :validateOnValueUpdate="false" :validateOnBlur="true" :form="dynamicForm">
    <FormsSensorHeader v-if="props.isEditing" v-bind="{ ...sensorDataToShow }" v-model:name="dynamicForm.name" v-model:update-interval="dynamicForm.props.update_interval" v-model:zone-id="dynamicForm.zone_id" />
    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>
    <SharedUILabel class="tw-mb-2" :title="t('devices.controller')" required :value="dynamicForm.parent_id" name="controller">
      <Select
        v-model="dynamicForm.parent_id"
        :options="controllers"
        optionLabel="name"
        optionValue="id"
        class="tw-w-3/4"
      />
    </SharedUILabel>

    <SharedUILabel required class="tw-mb-2" :title="t('devices.port')">
      <Select v-model="dynamicForm.sdaPort" :options="formattedPorts" optionLabel="label" optionValue="value" class="tw-w-3/4" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <SharedUILabel :title="t('devices.getecting')">
      <ToggleSwitch v-model="" />
    </SharedUILabel>

    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.polling')" required :value="dynamicForm.props.update_interval" name="update_interval">
      <InputNumber suffix=" sec" id="update_interval" v-model="dynamicForm.props.update_interval" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="dynamicForm.children.temperature.write_graph" />
    </SharedUILabel>

  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 150px;
}
</style> -->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { DynamicFormData } from '~/components/device/form/form.types';
import { Controller } from '~/types/DevicesEnums';
import { units } from '~/staticData/updateIntervalOptions';

const dynamicForm = defineModel<DynamicFormData>('dynamic-form', { required: true });

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
  multiplier: dynamicForm.value.props.multiplier,
  start_value: dynamicForm.value.props.start_value,
  price: dynamicForm.value.props.price,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  multiplier: z.number().min(0),
  start_value: z.number().min(0),
  price: z.number().min(0.1),
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

const counterData = computed(() => ({
  data: [
    {
      value: dynamicForm.value.props.total ?? 0,
      unit: dynamicForm.value.props.unit ?? '',
      label: '',
    },
  ],
  lastUpdate: dynamicForm.value.props.last_update || '',
}));

const typeParamOptions = [
  { label: 'Газ', value: 'gas' },
  { label: 'Электричество', value: 'electro' },
  { label: 'Вода', value: 'water' },
];

const unitOptions = {
  gas: [
    { label: 'Кубометры (м³)', value: 'm3' },
    { label: 'Литры (л)', value: 'l' },
  ],
  electro: [
    { label: 'Киловатт-часы (кВт/ч)', value: 'kWh' },
  ],
  water: [
    { label: 'Кубометры (м³)', value: 'm3' },
    { label: 'Литры (л)', value: 'l' },
  ],
};
</script>

<template>
  <Form
    :form="dynamicForm"
    :resolver="resolver"
  >
    <FormsSensorHeader
      v-if="props.isEditing"
      v-bind="{ ...counterData }"
      v-model:name="dynamicForm.name"
      v-model:numeric-value="dynamicForm.props.numericValue"
      v-model:selected-unit="dynamicForm.props.selectedUnit"
      v-model:zone-id="dynamicForm.zone_id"
    />

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.placement') }}
    </p>

    <div class="tw-mb-2 tw-flex tw-items-center tw-gap-4">
      <SharedUILabel
        class="half-width-field tw-w-1/2"
        name="controller"
        required
        :title="t('devices.controller')"
        :value="dynamicForm.parent_id"
      >
        <Select
          v-model="dynamicForm.parent_id"
          class="tw-w-full"
          option-label="name"
          option-value="id"
          :options="controllers"
        />
      </SharedUILabel>

      <SharedUILabel
        class="half-width-field tw-w-1/2"
        name="sdaPort"
        required
        :title="t('devices.port')"
      >
        <Select
          v-model="dynamicForm.sdaPort"
          class="tw-w-full"
          option-label="label"
          option-value="value"
          :options="formattedPorts"
        />
      </SharedUILabel>
    </div>

    <Divider class="tw-mt-0 tw-pb-3" />

    <SharedUILabel
      v-if="!props.isEditing"
      class="tw-mb-4"
      required
      :title="t('devices.polling')"
    >
      <div class="p-inputgroup full-width-field tw-w-1/2">
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

    <div class="tw-mb-4 tw-flex tw-items-center tw-gap-4">
      <SharedUILabel
        class="half-width-field tw-w-1/2"
        required
        :title="t('devices.typeParam')"
      >
        <Select
          v-model="dynamicForm.props.type_param"
          class="tw-w-full"
          option-label="label"
          option-value="value"
          :options="typeParamOptions"
        />
      </SharedUILabel>

      <SharedUILabel
        v-if="dynamicForm.props.type_param"
        class="half-width-field tw-w-1/2"
        required
        :title="t('devices.unit')"
      >
        <Select
          v-model="dynamicForm.props.unit"
          class="tw-w-full"
          option-label="label"
          option-value="value"
          :options="unitOptions[dynamicForm.props.type_param as keyof typeof unitOptions] ?? []"
        />
      </SharedUILabel>
    </div>

    <SharedUILabel
      class="text-primary-custom tw-mb-2"
      :title="t('devices.graphing')"
    >
      <ToggleSwitch v-model="dynamicForm.props.write_graph" />
    </SharedUILabel>

    <SharedUILabel
      class="full-width-field tw-mb-2"
      name="multiplier"
      required
      :title="t('devices.multiplier')"
    >
      <InputNumber
        v-model="dynamicForm.props.multiplier"
        class="tw-w-full"
      />
    </SharedUILabel>
    <SharedUILabel
      v-if="!props.isEditing"
      class="full-width-field tw-mb-2"
      name="start_value"
      required
      :title="t('devices.startValue')"
    >
      <InputNumber
        v-model="dynamicForm.props.start_value"
        class="tw-w-full"
      />
    </SharedUILabel>

    <SharedUILabel
      class="full-width-field tw-mb-2"
      name="price"
      required
      :title="t('devices.price')"
    >
      <InputNumber
        v-model="dynamicForm.props.price"
        class="tw-w-full"
      />
    </SharedUILabel>
  </Form>
</template>

<style scoped lang="scss">
.half-width-field {
  max-width: 195.75px;
}

.full-width-field {
  max-width: 405.5px;
}
</style>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';

import type { DynamicFormData } from '~/components/device/form/form.types';

const { modbus, getModbus } = useModbus();
getModbus();

const dynamicForm = defineModel<DynamicFormData>('dynamic-form', { required: true });

const props = defineProps<{
  isEditing: boolean;
}>();

const { t } = useI18n();
const storeRooms = useRoomsStore();
const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  address: dynamicForm.value.props.address,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  address: z.number().min(1).max(247),
});

const resolver = ref(zodResolver(schema));

watch(
  () => dynamicForm.value,
  () => {
    const flatFormData = flatForm.value;
    const validationResult = schema.safeParse(flatFormData);
    emit('update:valid', validationResult.success);
  },
  { deep: true },
);

const operatingModeOptions = [
  { value: '1', name: 'Нагрев' },
  { value: '2', name: 'Охлаждение' },
  { value: '3', name: 'Автоматический' },
  { value: '4', name: 'Осушение' },
  { value: '5', name: 'Вентиляция' },
];

const fanSpeedOptions = [
  { value: '0', name: 'Авто' },
  { value: '1', name: 'Первая скорость' },
  { value: '2', name: 'Вторая скорость' },
  { value: '3', name: 'Третья скорость' },
];

const horizontalSlatsOptions = [
  { value: '1', name: 'Качание' },
  { value: '2', name: 'Нижнее положение' },
  { value: '3', name: 'Второе положение' },
  { value: '4', name: 'Третье положение' },
  { value: '5', name: 'Четвертое положение' },
  { value: '6', name: 'Пятое положение' },
  { value: '7', name: 'Шестое положение' },
  { value: '8', name: 'Седьмое положение' },
];

const verticalSlatsOptions = [
  { value: '1', name: 'Качание' },
  { value: '2', name: 'Левое положение' },
  { value: '3', name: 'Второе положение' },
  { value: '4', name: 'Третье положение' },
  { value: '5', name: 'Четвертое положение' },
  { value: '6', name: 'Пятое положение' },
];
</script>

<template>
  <Form
    :form="dynamicForm"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
  >
    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      name="title"
      required
      :title="t('devices.title')"
    >
      <InputText
        v-model="dynamicForm.name"
        class="tw-w-3/4"
        required
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      name="room"
      :title="t('devices.room')"
    >
      <Select
        v-model="dynamicForm.zone_id"
        class="tw-w-3/4"
        option-label="name"
        option-value="code"
        :options="storeRooms.getRoomsSelect"
        :show-clear="true"
      />
    </SharedUILabel>

    <Divider v-if="props.isEditing" class="tw-mt-0 tw-pb-3" />

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.placement') }}
    </p>

    <SharedUILabel
      class="tw-mb-2"
      name="controller"
      required
      :title="t('devices.modbus')"
      :value="dynamicForm.parent_id"
    >
      <Select
        v-model="dynamicForm.parent_id"
        class="tw-w-3/4"
        option-label="name"
        option-value="id"
        :options="modbus"
      />
    </SharedUILabel>

    <SharedUILabel
      class="tw-mb-2"
      name="address"
      required
      :title="t('devices.address16')"
    >
      <InputNumber
        v-model="(dynamicForm.props.address as unknown as number)"
        class="tw-w-3/4"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      required
      :title="t('devices.polling')"
      :value="dynamicForm.props.update_interval"
    >
      <InputNumber
        v-model="(dynamicForm.props.update_interval as unknown as number)"
        class="tw-mr-10 tw-w-3/4"
        disabled
        suffix=" sec"
      />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" required :title="t('devices.condition')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.enable" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.powerStatus')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.power_status" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.displayBacklight')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.display_backlight" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.silentMode')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.silent_mode" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.ecoMode')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.eco_mode" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.turboMode')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.turbo_mode" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.sleepMode')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.sleep_mode" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.ionization')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.ionization" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.selfCleaning')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.self_cleaning" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.sounds')" :width="300">
      <ToggleSwitch v-model="dynamicForm.props.sounds" disabled />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.operatingMode')" :width="300">
      <Select v-model="dynamicForm.props.operating_mode" class="tw-w-3/4" disabled option-label="name" option-value="value" :options="operatingModeOptions" />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.fanSpeed')" :width="300">
      <Select v-model="dynamicForm.props.fan_speed" class="tw-w-3/4" disabled option-label="name" option-value="value" :options="fanSpeedOptions" />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.horizontalSlatsMode')" :width="300">
      <Select v-model="dynamicForm.props.horizontal_slats_mode" class="tw-w-3/4" disabled option-label="name" option-value="value" :options="horizontalSlatsOptions" />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.verticalSlatsMode')" :width="300">
      <Select v-model="dynamicForm.props.vertical_slats_mode" class="tw-w-3/4" disabled option-label="name" option-value="value" :options="verticalSlatsOptions" />
    </SharedUILabel>
  </Form>
</template>


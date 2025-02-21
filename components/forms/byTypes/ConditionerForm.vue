<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { useCheckAddressAvailability } from '~/composables/useCheck';

import type { EditDeviceForm } from '~/components/device/form/form.types';

const { modbus, getModbus } = useModbus();
getModbus();
const { occupiedDeviceId, checking, checkAddressAvailability } = useCheckAddressAvailability();
const toast = useToast();
const dynamicForm = defineModel<EditDeviceForm>('dynamic-form', { required: true });

const props = defineProps<{
  isEditing: boolean;
}>();

const { t } = useI18n();
const storeRooms = useRoomsStore();
const emit = defineEmits(['update:valid']);
const addressApproved = ref(false);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  address: dynamicForm.value.props.address,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  address: z.number().min(1).max(247),
});

const resolver = ref(zodResolver(schema));

const check = async () => {
  const numericAddress = Number(dynamicForm.value.props.address);
  if (!Number.isNaN(numericAddress) && dynamicForm.value.parent_id) {
    await checkAddressAvailability(numericAddress, dynamicForm.value.parent_id);

    if (occupiedDeviceId.value === 0) {
      toast.add({
        severity: 'success',
        summary: 'Адрес свободен',
        detail: `Адрес ${numericAddress} доступен`,
        life: 5000,
      });
      addressApproved.value = true;
    } else if (occupiedDeviceId.value === dynamicForm.value.id) {
      toast.add({
        severity: 'info',
        summary: 'Адрес не изменился',
        detail: 'Вы можете сохранить изменения',
        life: 5000,
      });
      addressApproved.value = true;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Адрес занят',
        detail: `Устройство ID ${occupiedDeviceId.value} уже использует этот адрес. Выберите другой.`,
        life: 5000,
      });
      addressApproved.value = false;
    }
  }
};

watch(
  () => dynamicForm.value.props.address,
  () => {
    addressApproved.value = false;
  },
);

watch(
  () => [dynamicForm.value, occupiedDeviceId.value, addressApproved.value],
  () => {
    const flatFormData = flatForm.value;
    let validationSuccess = schema.safeParse(flatFormData).success;

    if (props.isEditing && occupiedDeviceId.value === dynamicForm.value.id) {
      addressApproved.value = true;
      validationSuccess = true;
    }

    emit('update:valid', validationSuccess && addressApproved.value);
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
  { value: '1', name: 'Тихий режим' },
  { value: '2', name: 'Первая скорость' },
  { value: '3', name: 'Вторая скорость' },
  { value: '4', name: 'Третья скорость' },
  { value: '5', name: 'Четвертая скорость' },
  { value: '6', name: 'Пятая скорость' },
];

const horizontalSlatsOptions = [
  { value: '0', name: 'Остановлено' },
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
  { value: '0', name: 'Остановлено' },
  { value: '1', name: 'Качание' },
  { value: '2', name: 'Левое положение' },
  { value: '3', name: 'Второе положение' },
  { value: '4', name: 'Третье положение' },
  { value: '5', name: 'Четвертое положение' },
  { value: '6', name: 'Пятое положение' },
  { value: '7', name: 'Мягкий поток' },
];

const silentModeConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/me_1_mb_b',
  'onokom/tcl_1_mb_b',
  'onokom/hs_3_mb_b',
  'onokom/dk_1_mb_b',
  'onokom/gr_1_mb_b',
  'onokom/gr_3_mb_b',
  'onokom/hr_1_mb_b',
]);

const soundsConditioners = new Set([
  'onokom/tcl_1_mb_b',
  'onokom/hr_1_mb_b',
]);

const ecoModeConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/tcl_1_mb_b',
  'onokom/hr_1_mb_b',
  'onokom/gr_1_mb_b',
  'onokom/hr_1_mb_b',
  'onokom/hs_3_mb_b',
]);

const turboModeConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/tcl_1_mb_b',
  'onokom/hs_6_mb_b',
  'onokom/gr_1_mb_b',
  'onokom/hr_1_mb_b',
]);

const sleepModeConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/tcl_1_mb_b',
  'onokom/hs_6_mb_b',
  'onokom/gr_3_mb_b',
  'onokom/gr_1_mb_b',
  'onokom/hr_1_mb_b',
  'onokom/hs_3_mb_b',
]);

const ionizationConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/tcl_1_mb_b',
  'onokom/gr_1_mb_b',
  'onokom/hr_1_mb_b',
]);

const selfCleaningConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/tcl_1_mb_b',
  'onokom/gr_3_mb_b',
  'onokom/hr_1_mb_b',
]);

const antiFungusConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/tcl_1_mb_b',
]);

const disableDisplayOnPowerOffConditioners = new Set([
  'onokom/gr_1_mb_b',
]);

const onDutyHeatingConditioners = new Set([
  'onokom/tcl_1_mb_b',
]);

const softFlowConditioners = new Set([
  'onokom/tcl_1_mb_b',
]);

const externalTemperatureConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/tcl_1_mb_b',
  'onokom/gr_1_mb_b',
  'onokom/gr_3_mb_b',
  'onokom/hr_1_mb_b',
  'onokom/hs_3_mb_b',
  'onokom/dk_1_mb_b',
]);

const displayBacklightConditioners = new Set([
  'onokom/aux_1_mb_b',
  'onokom/tcl_1_mb_b',
  'onokom/dk_1_mb_b',
  'onokom/gr_1_mb_b',
  'onokom/hr_1_mb_b',
  'onokom/hs_3_mb_b',
]);

const displayHighBrightnessConditioners = new Set([
  'onokom/dk_1_mb_b',
]);

const hasSilentMode = computed(() => silentModeConditioners.has(dynamicForm.value?.type));
const hasSounds = computed(() => soundsConditioners.has(dynamicForm.value?.type));
const hasEcoMode = computed(() => ecoModeConditioners.has(dynamicForm.value?.type));
const hasTurboMode = computed(() => turboModeConditioners.has(dynamicForm.value?.type));
const hasSleepMode = computed(() => sleepModeConditioners.has(dynamicForm.value?.type));
const hasIonization = computed(() => ionizationConditioners.has(dynamicForm.value?.type));
const hasSelfCleaning = computed(() => selfCleaningConditioners.has(dynamicForm.value?.type));
const hasAntiFungus = computed(() => antiFungusConditioners.has(dynamicForm.value?.type));
const hasDisableDisplayOnPowerOff = computed(() => disableDisplayOnPowerOffConditioners.has(dynamicForm.value?.type));
const hasOnDutyHeating = computed(() => onDutyHeatingConditioners.has(dynamicForm.value?.type));
const hasSoftFlow = computed(() => softFlowConditioners.has(dynamicForm.value?.type));
const hasExternalTemperature = computed(() => externalTemperatureConditioners.has(dynamicForm.value?.type));
const hasDisplayBacklight = computed(() => displayBacklightConditioners.has(dynamicForm.value?.type));
const hasDisplayHighBrightness = computed(() => displayHighBrightnessConditioners.has(dynamicForm.value?.type));
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

    <Divider
      v-if="props.isEditing"
      class="tw-mt-0 tw-pb-3"
    />

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
      <InputGroup class="tw-w-3/4">
        <InputNumber v-model="(dynamicForm.props.address as unknown as number)" />
        <Button
          :disabled="!dynamicForm.parent_id"
          label="Проверить адрес"
          :loading="checking"
          @click="check"
        />
      </InputGroup>
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

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      required
      :title="t('devices.condition')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.enabled"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      :title="t('devices.powerStatus')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.power_status"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      :title="t('devices.operatingMode')"
      :width="150"
    >
      <Select
        v-model="dynamicForm.props.operating_mode"
        class="tw-w-3/4"
        disabled
        option-label="name"
        option-value="value"
        :options="operatingModeOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      :title="`${t('devices.internalTemperature')}`"
      :value="dynamicForm.props.internal_temperature"
      :width="150"
    >
      <InputNumber
        v-model="dynamicForm.props.internal_temperature"
        class="tw-w-3/4"
        disabled
        suffix=" °C"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasExternalTemperature"
      class="tw-mb-2"
      :title="`${t('devices.externalTemperature')}`"
      :value="dynamicForm.props.external_temperature"
      :width="150"
    >
      <InputNumber
        v-model="dynamicForm.props.external_temperature"
        class="tw-w-3/4"
        disabled
        suffix=" °C"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      :title="`${t('devices.targetTemperature')}`"
      :value="dynamicForm.props.target_temperature"
      :width="150"
    >
      <InputNumber
        v-model="dynamicForm.props.target_temperature"
        class="tw-w-3/4"
        disabled
        suffix=" °C"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      :title="t('devices.fanSpeed')"
      :width="150"
    >
      <Select
        v-model="dynamicForm.props.fan_speed"
        class="tw-w-3/4"
        disabled
        option-label="name"
        option-value="value"
        :options="fanSpeedOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      :title="t('devices.horizontalSlatsMode')"
      :width="150"
    >
      <Select
        v-model="dynamicForm.props.horizontal_slats_mode"
        class="tw-w-3/4"
        disabled
        option-label="name"
        option-value="value"
        :options="horizontalSlatsOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      :title="t('devices.verticalSlatsMode')"
      :width="150"
    >
      <Select
        v-model="dynamicForm.props.vertical_slats_mode"
        class="tw-w-3/4"
        disabled
        option-label="name"
        option-value="value"
        :options="verticalSlatsOptions"
      />
    </SharedUILabel>

    <!-- Не для всех -->

    <SharedUILabel
      v-if="props.isEditing && hasDisplayBacklight"
      class="tw-mb-2"
      :title="t('devices.displayBacklight')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.display_backlight"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasSilentMode"
      class="tw-mb-2"
      :title="t('devices.silentMode')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.silent_mode"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasEcoMode"
      class="tw-mb-2"
      :title="t('devices.ecoMode')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.eco_mode"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasTurboMode"
      class="tw-mb-2"
      :title="t('devices.turboMode')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.turbo_mode"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasSleepMode"
      class="tw-mb-2"
      :title="t('devices.sleepMode')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.sleep_mode"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasIonization"
      class="tw-mb-2"
      :title="t('devices.ionization')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.ionization"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasSelfCleaning"
      class="tw-mb-2"
      :title="t('devices.selfCleaning')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.self_cleaning"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasAntiFungus"
      class="tw-mb-2"
      :title="t('devices.antiFungus')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.anti_fungus"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasDisableDisplayOnPowerOff"
      class="tw-mb-2"
      :title="t('devices.disableDisplayOnPowerOff ')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.disable_display_on_power_off"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasSounds"
      class="tw-mb-2"
      :title="t('devices.sounds')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.sounds"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasOnDutyHeating"
      class="tw-mb-2"
      :title="t('devices.onDutyHeating')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.on_duty_heating"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasSoftFlow"
      class="tw-mb-2"
      :title="t('devices.softFlow')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.soft_flow"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing && hasDisplayHighBrightness"
      class="tw-mb-2"
      :title="t('devices.displayHighBrightness')"
      :width="150"
    >
      <ToggleSwitch
        v-model="dynamicForm.props.display_high_brightness "
        disabled
      />
    </SharedUILabel>
  </Form>
</template>


<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Controller } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';

const { t } = useI18n();

const props = defineProps<{ form: { controller: number | null; sdaPort: number | null; sclPort: number | null } }>();
const emit = defineEmits(['update:form']);

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);

const controllerIdRef = computed(() => props.form.controller);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

const updateFormField = (field: keyof typeof props.form, value: any) => {
  emit('update:form', { ...props.form, [field]: value });
};
</script>

<template>
  <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>

  <SharedUILabel class="tw-mb-2" :title="t('devices.controller')" required :value="props.form.controller" name="controller">
    <Select
      :value="props.form.controller"
      @update:modelValue="value => updateFormField('controller', value)"
      :options="controllers"
      optionLabel="name"
      optionValue="id"
      class="tw-w-full"
    />
  </SharedUILabel>

  <SharedUILabel class="tw-mb-2" :title="t('devices.portSDA')" required :value="props.form.sdaPort" name="sdaPort">
    <Select
      :value="props.form.sdaPort"
      @update:modelValue="value => updateFormField('sdaPort', value)"
      :options="formattedPorts"
      optionLabel="label"
      optionValue="value"
      class="tw-w-full"
    />
  </SharedUILabel>

  <SharedUILabel class="tw-mb-2" :title="t('devices.portSCL')" required :value="props.form.sclPort" name="sclPort">
    <Select
      :value="props.form.sclPort"
      @update:modelValue="value => updateFormField('sclPort', value)"
      :options="formattedPorts"
      optionLabel="label"
      optionValue="value"
      class="tw-w-full"
    />
  </SharedUILabel>

  <Divider class="tw-mt-0 tw-pb-3" />
</template>

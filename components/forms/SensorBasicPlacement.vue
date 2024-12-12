<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Controller } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';

const { t } = useI18n();

const props = defineProps<{ form: { controller: number | null; sdaPort: number | null; sclPort: number | null; address?: string } }>();
const emit = defineEmits(['update:form']);

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);

const controllerIdRef = computed(() => props.form.controller);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

const form = ref(props.form);

const address = computed(() => {
  const { sdaPort, sclPort } = form.value;
  return sdaPort && sclPort ? `${sdaPort};${sclPort}` : '';
});

watch(
  [form, address],
  () => {
    form.value.address = address.value;
    emit('update:form', form.value);
  },
  { deep: true, immediate: true },
);

</script>

<template>
  <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>

  <SharedUILabel class="tw-mb-2" :title="t('devices.controller')" required :value="form.controller" name="controller">
    <Select
      v-model="form.controller"
      :options="controllers"
      optionLabel="name"
      optionValue="id"
      class="tw-w-full"
    />
  </SharedUILabel>

  <SharedUILabel class="tw-mb-2" :title="t('devices.portSDA')" required :value="form.sdaPort" name="sdaPort">
    <Select
      v-model="form.sdaPort"
      :options="formattedPorts"
      optionLabel="label"
      optionValue="value"
      class="tw-w-full"
    />
  </SharedUILabel>

  <SharedUILabel class="tw-mb-2" :title="t('devices.portSCL')" required :value="form.sclPort" name="sclPort">
    <Select
      v-model="form.sclPort"
      :options="formattedPorts"
      optionLabel="label"
      optionValue="value"
      class="tw-w-full"
    />
  </SharedUILabel>

  <Divider class="tw-mt-0 tw-pb-3" />
</template>

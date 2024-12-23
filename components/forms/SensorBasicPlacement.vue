<script setup lang="ts">
import { type ModelRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Controller } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';
import type { DeviceParentId, DevicePort } from '~/types/DevicesTypes';

const { t } = useI18n();

const parentId = defineModel<DeviceParentId>('parent-id') as ModelRef<DeviceParentId>;
const sdaPort = defineModel<DevicePort>('sda-port');
const sclPort = defineModel<DevicePort>('scl-port');

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);

const controllerIdRef = computed(() => parentId.value);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

</script>

<template>
  <p class="tw-mb-4 tw-text-lg tw-font-semibold">
    {{ t('devices.placement') }}
  </p>

  <SharedUILabel
    class="tw-mb-2"
    name="controller"
    required
    :title="t('devices.controller')"
    :value="parentId"
  >
    <Select
      v-model="parentId"
      class="tw-w-3/4"
      option-label="name"
      option-value="id"
      :options="controllers"
    />
  </SharedUILabel>

  <SharedUILabel
    class="tw-mb-2"
    name="sdaPort"
    required
    :title="t('devices.portSDA')"
    :value="sdaPort"
  >
    <Select
      v-model="sdaPort"
      class="tw-w-3/4"
      option-label="label"
      option-value="value"
      :options="formattedPorts"
    />
  </SharedUILabel>

  <SharedUILabel
    class="tw-mb-2"
    name="sclPort"
    required
    :title="t('devices.portSCL')"
    :value="sclPort"
  >
    <Select
      v-model="sclPort"
      class="tw-w-3/4"
      option-label="label"
      option-value="value"
      :options="formattedPorts"
    />
  </SharedUILabel>

  <Divider class="tw-mt-0 tw-pb-3" />
</template>

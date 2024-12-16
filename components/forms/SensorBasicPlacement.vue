<script setup lang="ts">
import {
  defineEmits, computed, type ModelRef,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { Controller } from '~/types/DevicesEnums';
import { useControllersViaType } from '~/composables/useControllersViaType';
import type { DeviceParentId, DevicePort } from '~/types/DevicesTypes';

const { t } = useI18n();

const parentId = defineModel('parent-id') as ModelRef<DeviceParentId>;
const sdaPort = defineModel<DevicePort>('sda-port');
const sclPort = defineModel<DevicePort>('scl-port');

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);

const controllerIdRef = computed(() => parentId.value);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef);

</script>

<template>
  <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>

  <SharedUILabel class="tw-mb-2" :title="t('devices.controller')" required :value="parentId" name="controller">
    <Select
      v-model="parentId"
      :options="controllers"
      optionLabel="name"
      optionValue="id"
      class="tw-w-full"
    />
  </SharedUILabel>

  <SharedUILabel class="tw-mb-2" :title="t('devices.portSDA')" required :value="sdaPort" name="sdaPort">
    <Select
      v-model="sdaPort"
      :options="formattedPorts"
      optionLabel="label"
      optionValue="value"
      class="tw-w-full"
    />
  </SharedUILabel>

  <SharedUILabel class="tw-mb-2" :title="t('devices.portSCL')" required :value="sclPort" name="sclPort">
    <Select
      v-model="sclPort"
      :options="formattedPorts"
      optionLabel="label"
      optionValue="value"
      class="tw-w-full"
    />
  </SharedUILabel>

  <Divider class="tw-mt-0 tw-pb-3" />
</template>

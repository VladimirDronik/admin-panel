<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
import { type ModelRef } from 'vue';
// Helper modules
import { useController } from '~/composables/useControllerModbus';
// Types modules
import { Controller } from '~/types/DevicesEnums';
import type { DeviceParentId, DevicePort } from '~/types/DevicesTypes';

// Composables
const { t } = useI18n();
const { controllers, getController } = useController();

// Declare Options
const parentId = defineModel<DeviceParentId>('parent-id') as ModelRef<DeviceParentId>;
const sdaPort = defineModel<DevicePort>('sda-port');
const sclPort = defineModel<DevicePort>('scl-port');

// Computed Properties
const controllerIdRef = computed(() => parentId.value);

const { formattedPorts } = usePorts(controllerIdRef);

getController(Controller.MegaD);

</script>

<template>
  <p class="tw-mb-4 tw-text-lg tw-font-semibold">
    {{ t('devices.placement') }}
  </p>

  <SharedUILabel
    class="tw-mb-2 tw-max-w-[405.5px]"
    name="controller"
    required
    :title="t('devices.controller')"
    :value="parentId"
  >
    <Select
      v-model="parentId"
      class="tw-w-full"
      option-label="name"
      option-value="id"
      :options="controllers"
    />
  </SharedUILabel>

  <div class="tw-mb-4 tw-flex tw-gap-4">
    <SharedUILabel
      class="tw-w-1/2 tw-max-w-[195.75px]"
      name="sdaPort"
      required
      :title="t('devices.portSDA')"
      :value="sdaPort"
    >
      <Select
        v-model="sdaPort"
        class="tw-w-full"
        option-label="label"
        option-value="value"
        :options="formattedPorts"
      />
    </SharedUILabel>

    <SharedUILabel
      class="tw-w-1/2 tw-max-w-[195.75px]"
      name="sclPort"
      required
      :title="t('devices.portSCL')"
      :value="sclPort"
    >
      <Select
        v-model="sclPort"
        class="tw-w-full"
        option-label="label"
        option-value="value"
        :options="formattedPorts"
      />
    </SharedUILabel>
  </div>

  <Divider class="tw-mt-0 tw-pb-3" />
</template>

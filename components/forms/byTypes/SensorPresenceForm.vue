<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Controller } from '~/types/DevicesEnums';
import type {
  DynamicFormData, DeviceChildrenRequired,
} from '~/components/device/form/form.types';
import { units } from '~/staticData/updateIntervalOptions';

const dynamicForm = defineModel<DynamicFormData & { children: DeviceChildrenRequired } >('dynamic-form', { required: true });

const { controllers, getController } = useController();
getController(Controller.MegaD);
const controllerIdRef = computed(() => dynamicForm.value.parent_id);
const { formattedPorts } = usePorts(controllerIdRef);

const props = defineProps<{
  isEditing: boolean;
}>();
const { t } = useI18n();
const storeRooms = useRoomsStore();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
  sclPort: dynamicForm.value.sclPort,
  enabled: dynamicForm.value.enabled,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  enabled: z.boolean().default(true),
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

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.motion') }}
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

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">
      {{ t('devices.presence') }}
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
        v-model="dynamicForm.sclPort"
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="formattedPorts"
      />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />
    <SharedUILabel
      class="text-primary-custom tw-mb-2"
      required
      :title="t('devices.detecting')"
      :width="165"
    >
      <ToggleSwitch v-model="dynamicForm.enabled" />
    </SharedUILabel>

    <SharedUILabel
      class="tw-mb-4"
      required
      :title="t('devices.period')"
    >
      <div class="p-inputgroup tw-w-2/4">
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

    <Divider class="tw-mt-0 tw-pb-3" />

    <SharedUILabel
      class="text-primary-custom tw-mb-2"
      :title="t('devices.graphingMotion')"
      :width="200"
    >
      <ToggleSwitch v-model="dynamicForm.children.motion.write_graph" />
    </SharedUILabel>
    <SharedUILabel
      class="text-primary-custom tw-mb-2"
      :title="t('devices.graphingPresence')"
      :width="200"
    >
      <ToggleSwitch v-model="dynamicForm.children.motion.write_graph" />
    </SharedUILabel>
  </Form>
</template>

<style scoped>

:deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 100px;
}
</style>

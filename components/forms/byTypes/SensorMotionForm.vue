<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Controller } from '~/types/DevicesEnums';
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
const storeRooms = useRoomsStore();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
  enable: dynamicForm.value.props.enable,
  period: dynamicForm.value.props.period,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
  enable: z.boolean().default(false),
  period: z.number().default(8),
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
    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.title')" required name="title">
      <InputText
        v-model="dynamicForm.name"
        required
        class="tw-w-3/4" />
    </SharedUILabel>
    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.room')" name="room">
      <Select
        :showClear="true"
        v-model="dynamicForm.zone_id"
        :options="storeRooms.getRoomsSelect"
        optionLabel="name"
        optionValue="code"
        class="tw-w-3/4"
      />
    </SharedUILabel>

    <Divider v-if="props.isEditing" class="tw-mt-0 tw-pb-3" />

    <p class="tw-mb-4 tw-text-lg tw-font-semibold">{{ t('devices.placement') }}</p>
    <SharedUILabel :width="350" class="tw-mb-2" :title="t('devices.controller')" required :value="dynamicForm.parent_id" name="controller">
      <Select
        v-model="dynamicForm.parent_id"
        :options="controllers"
        optionLabel="name"
        optionValue="id"
        class="tw-w-3/4"
      />
    </SharedUILabel>

    <SharedUILabel :width="350" required class="tw-mb-2" :title="t('devices.port')">
      <Select v-model="dynamicForm.sdaPort" :options="formattedPorts" optionLabel="label" optionValue="value" class="tw-w-3/4" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />
    <SharedUILabel :width="350" required :title="t('devices.detecting')">
      <ToggleSwitch v-model="dynamicForm.props.enable" />
    </SharedUILabel>

    <SharedUILabel :width="350" class="tw-mb-2" :title="t('devices.period')" required :value="dynamicForm.props.period" name="period">
      <InputNumber suffix=" sec" id="period" v-model="dynamicForm.props.period" class="tw-mr-10 tw-w-1/4" />
    </SharedUILabel>

    <Divider class="tw-mt-0 tw-pb-3" />

    <SharedUILabel :title="t('devices.graphing')">
      <ToggleSwitch v-model="dynamicForm.children.motion.write_graph" />
    </SharedUILabel>
  </Form>
</template>

<style scoped>

::v-deep(.p-inputtext.p-component.p-filled.p-inputnumber-input) {
 width: 100px;
}
</style>

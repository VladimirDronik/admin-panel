<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Controller } from '~/types/DevicesEnums';
import type {
  DynamicFormData,
} from '~/components/devices/form.types';

const dynamicForm = defineModel<DynamicFormData>('dynamic-form', { required: true });

const props = defineProps<{
  isEditing: boolean;
}>();

const { controllers, getControllersViaType } = useControllersViaType();
getControllersViaType(Controller.MegaD);
const controllerIdRef = computed(() => dynamicForm.value.parent_id);
const { formattedPorts } = useControllerPortsViaId(controllerIdRef, 'outputs');

const { t } = useI18n();
const storeRooms = useRoomsStore();

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  parent_id: dynamicForm.value.parent_id,
  sdaPort: dynamicForm.value.sdaPort,
}));

const schema = z.object({
  parent_id: z.number().min(1),
  sdaPort: z.number().min(1),
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
  <Form :resolver="resolver" :validateOnValueUpdate="false" :validateOnBlur="true" :form="dynamicForm">
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
    <SharedUILabel class="tw-mb-2" :title="t('devices.controller')" required :value="dynamicForm.parent_id" name="controller">
      <Select
        v-model="dynamicForm.parent_id"
        :options="controllers"
        optionLabel="name"
        optionValue="id"
        class="tw-w-3/4"
      />
    </SharedUILabel>

    <SharedUILabel required class="tw-mb-2" :title="t('devices.port')">
      <Select v-model="dynamicForm.sdaPort" :options="formattedPorts" optionLabel="label" optionValue="value" class="tw-w-3/4" />
    </SharedUILabel>

  </Form>
</template>

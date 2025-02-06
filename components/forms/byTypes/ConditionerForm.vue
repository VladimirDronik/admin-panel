<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';

import type { DynamicFormData } from '~/components/devices/form.types';

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
  address: z.number().min(1).max(4096),
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
      required 
      :title="t('devices.address16')"
      name="address"
    >
      <InputNumber
        v-model="(dynamicForm.props.address as unknown as number)"
        class="tw-w-3/4"
      />
    </SharedUILabel>
  </Form>
</template>
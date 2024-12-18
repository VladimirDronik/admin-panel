<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type {
  DynamicFormData,
} from '~/components/devices/form.types';

const { t } = useI18n();
const storeRooms = useRoomsStore();

const props = defineProps<{
  isEditing: boolean;
}>();

const dynamicForm = defineModel<DynamicFormData>('dynamic-form', { required: true });

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  id: dynamicForm.value.props.id,
  address: dynamicForm.value.props.address,
  password: dynamicForm.value.props.password,
  protocol: dynamicForm.value.props.protocol,
}));

const schema = z.object({
  id: z.string().min(1).max(15),
  address: z.string().min(1).max(15),
  password: z.string().min(1).max(6),
  protocol: z.enum(['http', 'mqtt']),
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

const protocolOptions = schema.shape.protocol.options;

</script>

<template>
  <div />
  <Form :resolver="resolver" :validateOnValueUpdate="false" :validateOnBlur="true" :form="dynamicForm">

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.title')" required :value="dynamicForm.name" name="title">
      <InputText
        v-model="dynamicForm.name"
      />
    </SharedUILabel>

    <SharedUILabel class="tw-mb-2" :title="t('devices.id')" required :value="dynamicForm.props.id" name="id">
      <InputText
        v-model="dynamicForm.props.id"
      />
    </SharedUILabel>

    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.address')" required :value="dynamicForm.props.address" name="address">
      <InputText
        id="address"
        v-model="dynamicForm.props.address"
      />
    </SharedUILabel>

    <SharedUILabel class="tw-mb-2" :title="t('devices.password')" required :value="dynamicForm.props.password" name="password">
      <InputText
        id="password"
        v-model="dynamicForm.props.password"
      />
    </SharedUILabel>
    <SharedUILabel class="tw-mb-2" :title="t('devices.protocol')" required :value="dynamicForm.props.protocol" name="ptotocol">
      <Select
        :options="protocolOptions"
        v-model="dynamicForm.props.protocol"
      />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.room')" name="zone_id">
      <Select
        :showClear="true"
        v-model="dynamicForm.zone_id"
        :options="storeRooms.getRoomsSelect"
        optionLabel="name"
        optionValue="code"
        class="tw-w-3/4"

      />
    </SharedUILabel>
  </Form>
</template>

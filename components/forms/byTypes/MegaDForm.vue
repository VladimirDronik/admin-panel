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
  id: z.string().max(15).optional(),
  address: z.string().min(1).max(15),
  password: z.string().min(1).max(6),
  protocol: z.enum(['http']),
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
      :value="dynamicForm.name"
    >
      <InputText
        v-model="dynamicForm.name"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="dynamicForm.props.protocol === 'mqtt'"
      class="tw-mb-2"
      name="id"
      required
      :title="t('devices.id')"
      :value="dynamicForm.props.id"
    >
      <InputText
        v-model="dynamicForm.props.id"
      />
    </SharedUILabel>

    <!-- v-if="!props.isEditing" -->
    <SharedUILabel
      class="tw-mb-2"
      name="address"
      required
      :title="t('devices.address')"
      :value="dynamicForm.props.address"
    >
      <InputText
        id="address"
        v-model="dynamicForm.props.address"
      />
    </SharedUILabel>

    <SharedUILabel
      class="tw-mb-2"
      name="password"
      required
      :title="t('devices.password')"
      :value="dynamicForm.props.password"
    >
      <InputText
        id="password"
        v-model="dynamicForm.props.password"
      />
    </SharedUILabel>
    <SharedUILabel
      class="tw-mb-2"
      name="ptotocol"
      required
      :title="t('devices.protocol')"
      :value="dynamicForm.props.protocol"
    >
      <Select
        v-model="dynamicForm.props.protocol"
        :options="protocolOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-2"
      name="zone_id"
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
  </Form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type {
  DynamicFormData,
} from '~/components/device/form/form.types';
import { units } from '~/staticData/updateIntervalOptions';

const dynamicForm = defineModel<DynamicFormData>('dynamic-form', { required: true });

const props = defineProps<{
  isEditing: boolean;
}>();

const { t } = useI18n();
const storeRooms = useRoomsStore();
const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  ip: showIpPortFields.value ? dynamicForm.value.props.ip : null,
  port: showIpPortFields.value ? dynamicForm.value.props.port : null,
  data_bits: dynamicForm.value.props.data_bits ?? null,
  tries: dynamicForm.value.props.tries ?? null,
}));

const schema = z.object({
  ip: z.string().min(1).nullable(),
  port: z.number().min(1).nullable(),
  data_bits: z.number().min(1).nullable(),
  tries: z.number().min(1).max(10).nullable(),
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

const shouldShowFields = computed(() => props.isEditing && dynamicForm.value.parent_id !== 0 && dynamicForm.value.parent_id !== null && dynamicForm.value.parent_id !== undefined);

const showIpPortFields = computed(() => dynamicForm.value.parent_id === 0
  || dynamicForm.value.parent_id === null
  || dynamicForm.value.parent_id === undefined);

const speedOptions = [
  { value: '115200', name: '115200' },
  { value: '1200', name: '1200' },
  { value: '128000', name: '128000' },
  { value: '19200', name: '19200' },
  { value: '2400', name: '2400' },
  { value: '256000', name: '256000' },
  { value: '38400', name: '38400' },
  { value: '4800', name: '4800' },
  { value: '57600', name: '57600' },
  { value: '9600', name: '9600' },
];

const parityOptions = [
  { value: '0', name: 'none' },
  { value: '1', name: 'even' },
  { value: '2', name: 'odd' },
];

const stopBitsOptions = [
  { value: '0', name: '0' },
  { value: '1', name: '1' },
  { value: '2', name: '2' },
];
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

    <SharedUILabel
      v-if="showIpPortFields"
      class="tw-mb-2"
      name="ip"
      required
      :title="t('devices.address')"
      :value="dynamicForm.props.ip"
      :width="300"
    >
      <InputText
        v-model="dynamicForm.props.ip"
        class="tw-w-2/4"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="showIpPortFields"
      class="tw-mb-2"
      name="port"
      required
      :title="t('devices.port')"
      :value="dynamicForm.props.port"
      :width="300"
    >
      <InputNumber
        v-model="dynamicForm.props.port"
        class="tw-w-2/4"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="!showIpPortFields && props.isEditing"
      class="tw-mb-2"
      required
      :title="t('devices.connectionString')"
      :value="dynamicForm.props.ip"
      :width="300"
    >
      <InputText
        v-model="dynamicForm.props.ip"
        class="tw-w-2/4"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="shouldShowFields"
      class="tw-mb-2"
      required
      :title="t('devices.speed')"
      :value="dynamicForm.props.speed"
      :width="300"
    >
      <Select
        v-model="dynamicForm.props.speed"
        class="tw-w-2/4"
        option-label="name"
        option-value="value"
        :options="speedOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="shouldShowFields"
      class="tw-mb-2"
      name="data_bits"
      required
      :title="t('devices.dataBits')"
      :value="dynamicForm.props.data_bits"
      :width="300"
    >
      <InputNumber
        v-model="dynamicForm.props.data_bits"
        class="tw-w-2/4"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="shouldShowFields"
      class="tw-mb-2"
      required
      :title="t('devices.parity')"
      :value="dynamicForm.props.parity"
      :width="300"
    >
      <Select
        v-model="dynamicForm.props.parity"
        class="tw-w-2/4"
        option-label="name"
        option-value="value"
        :options="parityOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="shouldShowFields"
      class="tw-mb-2"
      required
      :title="t('devices.stopBits')"
      :value="dynamicForm.props.stop_bits"
      :width="300"
    >
      <Select
        v-model="dynamicForm.props.stop_bits"
        class="tw-w-2/4"
        option-label="name"
        option-value="value"
        :options="stopBitsOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      class="tw-mb-4"
      required
      :title="t('devices.timeout')"
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

    <SharedUILabel
      class="tw-mb-2"
      name="tries"
      required
      :title="t('devices.tries')"
      :value="dynamicForm.props.tries"
      :width="300"
    >
      <InputNumber
        v-model="dynamicForm.props.tries"
        class="tw-w-2/4"
      />
    </SharedUILabel>
  </Form>
</template>

<style scoped lang="scss">
</style>


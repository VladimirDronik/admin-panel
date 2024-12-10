<script setup lang="ts">
import { reactive, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';

const storeRooms = useRoomsStore();

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
});

const { t } = useI18n();

const megaDFormSchema = z.object({
  title: z.string().min(1),
  id: z.string().max(15),
  address: z.string().max(15),
  password: z.string().max(6),
  protocol: z.enum(['HTTP', 'MQTT']),
  room: z.string().min(1),
});

type MegaDForm = z.infer<typeof megaDFormSchema>;

const form = reactive<MegaDForm>({
  title: '',
  id: '',
  address: '',
  password: '',
  protocol: 'HTTP',
  room: '',
});

const resolver = ref(zodResolver(megaDFormSchema));
const protocolOptions = megaDFormSchema.shape.protocol.options;

interface FieldSettings {
  inputWidth: string;
}

const getFieldSettingsForMegaD = (code: keyof MegaDForm): FieldSettings => {
  switch (code) {
    case 'id':
    case 'address':
      return { inputWidth: '18ch' };
    case 'password':
      return { inputWidth: '12ch' };
    case 'protocol':
      return { inputWidth: '12ch' };
    default:
      return { inputWidth: '18ch' };
  }
};

const handleSubmit = () => {
  console.log('Form Data:', form);
};

</script>

<template>
  <Form :resolver="resolver" @submit="handleSubmit">

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.title')" required :value="form.title" name="title">
      <InputText
        v-model="form.title"
        :style="{ width: getFieldSettingsForMegaD('id').inputWidth }"
      />
    </SharedUILabel>

    <SharedUILabel class="tw-mb-2" :title="t('devices.id')" required :value="form.id" name="id">
      <InputText
        v-model="form.id"
        :style="{ width: getFieldSettingsForMegaD('id').inputWidth }"
      />
    </SharedUILabel>

    <SharedUILabel v-if="!props.isEditing" class="tw-mb-2" :title="t('devices.address')" required :value="form.address" name="address">
      <InputText
        id="address"
        v-model="form.address"
        :style="{ width: getFieldSettingsForMegaD('address').inputWidth }"
      />
    </SharedUILabel>

    <SharedUILabel class="tw-mb-2" :title="t('devices.password')" required :value="form.password" name="password">
      <InputText
        id="password"
        v-model="form.password"
        :style="{ width: getFieldSettingsForMegaD('password').inputWidth }"
      />
    </SharedUILabel>

    <SharedUILabel class="tw-mb-2" :title="t('devices.protocol')" required :value="form.protocol" name="ptotocol">
      <Select
        :options="protocolOptions"
        v-model="form.protocol"
        :style="{ width: getFieldSettingsForMegaD('protocol').inputWidth }"
      />
    </SharedUILabel>

    <SharedUILabel v-if="props.isEditing" class="tw-mb-2" :title="t('devices.room')" name="room">
      <Select
        :value="form.room"
        :options="storeRooms.getRoomsSelect"
        optionLabel="name"
        :style="{ width: getFieldSettingsForMegaD('id').inputWidth }"
      />
    </SharedUILabel>
  </Form>
</template>

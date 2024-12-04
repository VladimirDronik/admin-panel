<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface MegaDFormData {
  id: string;
  address: string;
  password: string;
  protocol: 'HTTP' | 'MQTT';
}

const formData = reactive<MegaDFormData>({
  id: '',
  address: '',
  password: '',
  protocol: 'HTTP',
});

interface FieldSettings {
  maxLength: number;
  inputWidth: string;
}

const protocolOptions: MegaDFormData['protocol'][] = ['HTTP', 'MQTT'];

const getFieldSettingsForMegaD = (code: keyof MegaDFormData): FieldSettings => {
  switch (code) {
    case 'id':
    case 'address':
      return { maxLength: 15, inputWidth: '18ch' };
    case 'password':
      return { maxLength: 6, inputWidth: '12ch' };
    case 'protocol':
      return { maxLength: 4, inputWidth: '12ch' };
    default:
      return { maxLength: 255, inputWidth: '100%' };
  }
};

const submitForm = () => {
  console.log('Form Data:', formData);
};
</script>

<template>
  <form @submit.prevent="submitForm" class="tw-ml-[25%] tw-mt-4 tw-text-lg tw-font-semibold">
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.id')" />
      <InputText
        id="id"
        v-model="formData.id"
        :maxlength="getFieldSettingsForMegaD('id').maxLength"
        :style="{ width: getFieldSettingsForMegaD('id').inputWidth }"
        class="tw-w-full"
      />
    </div>
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.address')" />
      <InputText
        id="address"
        v-model="formData.address"
        :maxlength="getFieldSettingsForMegaD('address').maxLength"
        :style="{ width: getFieldSettingsForMegaD('address').inputWidth }"
        class="tw-w-full"
      />
    </div>
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.password')" />
      <InputText
        id="password"
        v-model="formData.password"
        :maxlength="getFieldSettingsForMegaD('password').maxLength"
        :style="{ width: getFieldSettingsForMegaD('password').inputWidth }"
        class="tw-w-full"
      />
    </div>
    <div class="custom-grid">
      <SharedUIFormLabel :label="t('devices.protocol')" />
      <Select
        :options="protocolOptions"
        v-model="formData.protocol"
        class="tw-w-full"
        :style="{ width: getFieldSettingsForMegaD('protocol').inputWidth }"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { DynamicFormData } from '~/components/device/form/form.types';

const { t } = useI18n();
const storeRooms = useRoomsStore();

const props = defineProps<{
  isEditing: boolean;
}>();

const dynamicForm = defineModel<DynamicFormData>('dynamic-form', { required: true });

const emit = defineEmits(['update:valid']);

const flatForm = computed(() => ({
  storage_logs: dynamicForm.value.props.storage_logs,
  graph_date: dynamicForm.value.props.graph_date,
}));

const schema = z.object({
  storage_logs: z.preprocess((val) => Number(val) || 1, z.number().min(1).max(365)),
  graph_date: z.preprocess((val) => Number(val) || 1, z.number().min(1).max(365)),
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

const heatingOptions = [
  { label: 'Экономичный', value: 'eco' },
  { label: 'Ночной', value: 'night' },
  { label: 'Обычный', value: 'normal' },
];

const lightOptions = [
  { label: 'Ночной', value: 'night' },
  { label: 'Дневной', value: 'day' },
  { label: 'Вечерний', value: 'evening' },
];

const loggingOptions = [
  { label: 'Файл', value: 'file' },
  { label: 'База данных', value: 'db' },
];

const timeZoneOptions = [
  { label: 'Europe/Moscow (Москва)', value: 'Europe/Moscow' },
//   { label: 'Europe/Berlin (Берлин)', value: 'Europe/Berlin' },
//   { label: 'America/New York (Нью-Йорк)', value: 'America/New_York' },
//   { label: 'Asia/Tokyo (Токио)', value: 'Asia/Tokyo' },
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
      class="tw-mb-4"
      name="title"
      required
      :title="t('devices.title')"
      :value="dynamicForm.name"
    >
      <InputText
        v-model="dynamicForm.name"
        class="tw-w-3/4"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
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

    <Divider
      v-if="props.isEditing"
      class="tw-mt-0 tw-pb-3"
    />

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      required
      :title="t('devices.serverID')"
      :value="dynamicForm.props.server_id"
    >
      <InputText
        v-model="dynamicForm.props.server_id"
        class="tw-w-3/4"
        disabled
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      :title="t('devices.ecoMode')"
    >
      <ToggleSwitch v-model="dynamicForm.props.eco_mode" />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      :title="t('devices.guardMode')"
    >
      <ToggleSwitch v-model="dynamicForm.props.guard_mode" />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      :title="t('devices.nightMode')"
    >
      <ToggleSwitch v-model="dynamicForm.props.night_mode" />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      required
      :title="t('devices.heatingMode')"
    >
      <Select
        v-model="dynamicForm.props.heating_mode"
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="heatingOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      required
      :title="t('devices.lightMode')"
    >
      <Select
        v-model="dynamicForm.props.light_mode"
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="lightOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      required
      :title="t('devices.logging')"
    >
      <Select
        v-model="dynamicForm.props.logging"
        class="tw-w-3/4"
        option-label="label"
        option-value="value"
        :options="loggingOptions"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      name="storage_logs"
      :title="t('devices.storageLogs')"
    >
      <InputNumber
        v-model="dynamicForm.props.storage_logs"
        class="tw-w-3/4"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      name="graph_date"
      :title="t('devices.graphDate')"
    >
      <InputNumber
        v-model="dynamicForm.props.graph_date"
        class="tw-w-full"
      />
    </SharedUILabel>

    <SharedUILabel
      v-if="props.isEditing"
      class="tw-mb-4"
      required
      :title="t('devices.timeZone')"
    >
      <Select
        v-model="dynamicForm.props.time_zone"
        class="tw-w-full"
        option-label="label"
        option-value="value"
        :options="timeZoneOptions"
      />
    </SharedUILabel>
  </Form>
</template>

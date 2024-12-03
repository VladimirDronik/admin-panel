<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getDeviceFormComponent } from '@/utils/utils';

const { t } = useI18n();

const props = defineProps({
  deviceType: {
    type: String,
    required: true, // Передаем тип устройства
  },
});

// Определяем компонент формы на основе типа устройства
const FormComponent = computed(() => getDeviceFormComponent(props.deviceType));
</script>

<template>
  <div>
    <component :is="FormComponent" v-if="FormComponent" />
    <!-- <p v-else class="tw-mb-1.5tw-font-semibold tw-text-center tw-text-xl">{{ t('devices.formNotFound') }}</p> -->
  </div>
</template>

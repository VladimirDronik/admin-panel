<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { deviceFormMapping } from '@/components/forms/FormMappings';
import DefaultFormComponent from '../forms/byTypes/DefaultForm.vue';

const props = defineProps({
  deviceType: {
    type: String,
    required: true,
  },
});

const FormComponent = computed(() => {
  const mapping = deviceFormMapping.find((item) => item.type === props.deviceType);
  return mapping?.component || DefaultFormComponent;
});
</script>

<template>
  <div>
    <component :is="FormComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import { deviceFormMapping } from '@/components/forms/FormMappings';
import DefaultFormComponent from '../forms/byTypes/DefaultForm.vue';

const props = defineProps({
  deviceType: {
    type: String,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'update:valid']);

const FormComponent = computed(() => {
  const mapping = deviceFormMapping.find((item) => item.type === props.deviceType);
  return mapping?.component || DefaultFormComponent;
});

const updateModelValue = (newValue: unknown) => {
  console.log('Данные, полученные от формы:', newValue);
  emit('update:modelValue', newValue);
};

const updateValidity = (isValid: boolean) => {
  emit('update:valid', isValid);
};
</script>

<template>
  <div>
    <component :is="FormComponent" :isEditing="props.isEditing" @update:modelValue="updateModelValue" @update:valid="updateValidity" />
    <slot name="footer" />
  </div>
</template>

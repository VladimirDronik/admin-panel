<script setup lang="ts">
import { deviceFormMapping } from '~/components/forms/FormMappings';
import DefaultFormComponent from '../forms/byTypes/DefaultForm.vue';
import { type DynamicFormData, type AddFieldToDynamicFormPayload } from './form.types';

const props = withDefaults(defineProps<{
  addFieldToDynamicForm: AddFieldToDynamicFormPayload;
  deviceType: string;
  isEditing?: boolean;
}>(), {
  isEditing: false,
});

const dynamicForm = defineModel<DynamicFormData>('dynamic-form');

const emit = defineEmits(['update:valid']);

const FormComponent = computed(() => {
  const mapping = deviceFormMapping.find((item) => item.type === props.deviceType);
  return mapping?.component || DefaultFormComponent;
});

const updateValidity = (isValid: boolean) => {
  emit('update:valid', isValid);
};

</script>

<template>
  <div>
    <component
      :is="FormComponent"
      v-model:dynamic-form="dynamicForm"
      :add-field-to-dynamic-form="props.addFieldToDynamicForm"
      :is-editing="props.isEditing"
      @update:valid="updateValidity"
    />
    <slot name="footer" />
  </div>
</template>

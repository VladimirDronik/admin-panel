<script setup lang="ts">
import { deviceFormMapping } from '~/components/forms/FormMappings';
import DefaultFormComponent from '~/components/forms/byTypes/DefaultForm.vue';
import { type DynamicFormData, type AddFieldToDynamicFormPayload } from '~/components/device/form/form.types';

const {
  isEditing = false,
  deviceType,
  addFieldToDynamicForm,
} = defineProps<{
  addFieldToDynamicForm: AddFieldToDynamicFormPayload;
  deviceType: string;
  isEditing?: boolean;
}>();

const dynamicForm = defineModel<DynamicFormData>('dynamic-form');

const emit = defineEmits(['update:valid']);

const FormComponent = computed(() => {
  const mapping = deviceFormMapping.find((item) => item.type === deviceType);
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
      :add-field-to-dynamic-form="addFieldToDynamicForm"
      :is-editing="isEditing"
      @update:valid="updateValidity"
    />
    <slot name="footer" />
  </div>
</template>

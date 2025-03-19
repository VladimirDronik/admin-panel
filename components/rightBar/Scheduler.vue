<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

// Declare Options
const emit = defineEmits<{
  (e: 'update'): void
}>();

const { variant } = defineProps<{
  variant: string
}>();

const schedule = defineModel<any>('form', {
  required: true,
});

const isOpen = defineModel<boolean>('isShow', {
  required: true,
});

// Variables
const form = ref<any | null | undefined>({
  id: null,
});

// Watchers
watch(schedule, () => {
  if (schedule.value) form.value = { ...schedule.value };
  else {
    form.value = {
      title: '',
      timer: null,
      isActive: true,
      isSystem: false,
      isHide: false,
      type: 'switch',
    };
  }
});

</script>

<template>
  <LayoutRightbar
    v-if="form"
    v-model:is-open="isOpen"
    :title="variant === 'edit' ? t('Изменить задачу') : t('Добавить задачу')"
  >
    <SchedulerFormCreate
      v-if="variant === 'create'"
      :form
      @update="emit('update')"
    />
    <SchedulerFormChange
      v-else-if="variant === 'edit'"
      v-model:form="form"
      :is-open
      @update="emit('update')"
    />
  </LayoutRightbar>
</template>

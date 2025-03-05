<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';

// Declare Options
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: 'Удаление',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  subtitle: {
    type: String,
    default: '',
  },
  showBtn: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>();

const dialog = defineModel<boolean>({
  default: false,
});

// Composables
const { t } = useI18n();

// Methods
const deleteItem = () => {
  emit('delete', props.id);
  dialog.value = false;
};
</script>

<template>
  <div>
    <Button
      v-if="showBtn"
      :class="{ 'tw-cursor-not-allowed': disabled }"
      :disabled="disabled"
      :label="t('delete')"
      outlined
      @click="dialog = true"
    />

    <Dialog
      v-model:visible="dialog"
      dismissable-mask
      :header="title"
      modal
      :style="{
        'max-width': '800px',
        width: '100%',
        margin: '0 20px',
      }"
    >
      {{ props.subtitle }}
      <div>
        <Button
          class="tw-mr-2 tw-mt-4"
          color="primary"
          :label="t('delete')"
          :loading="loading"
          @click="deleteItem"
        />
        <Button
          color="primary"
          outlined
          variant="text"
          @click="dialog = false"
        >
          {{ t('cancel') }}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

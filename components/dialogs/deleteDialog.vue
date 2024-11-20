<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const dialog = defineModel<boolean>({
  required: true,
});

const { t } = useI18n();

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
});

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>();

const deleteItem = () => {
  emit('delete', props.id);
  dialog.value = false;
};
</script>

<template>
  <div>
    <Button
      v-if="showBtn"
      @click="dialog = true"
      :label="t('delete')"
      outlined
    />

    <Dialog
      v-model:visible="dialog"
      :header="title"
      :style="{
        'max-width': '800px',
        width: '100%',
        margin: '0 20px',
      }"
      modal
      dismissable-mask
    >
      <div>
        <Button
          @click="deleteItem"
          :loading="loading"
          color="primary"
          class="tw-mr-2"
          :label="t('delete')"
        />
        <Button
          @click="dialog = false"
          color="primary"
          variant="text"
          outlined
        >
          {{ t('cancel')}}
        </Button>
      </div>
    </Dialog>
  </div>
</template>

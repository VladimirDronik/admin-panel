<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const dialog = ref(false);

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
  subtitle: {
    type: String,
    default: '',
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
    <BaseDialog v-model="dialog" :width="800">
      <template v-slot:button>
        <v-btn color="error" @click="dialog = true">
          {{ t('delete')}}
        </v-btn>
      </template>
      <div class="tw-p-3">
        <p class="tw-mb-3 tw-text-2xl tw-font-semibold">
          {{ title }}
        </p>
        <p v-if="subtitle" class="tw-mb-8 tw-text-sm">
          {{ subtitle }}
        </p>
        <div>
          <v-btn @click="deleteItem" color="primary" class="tw-mr-2">
            {{ t('delete')}}
          </v-btn>
          <v-btn color="primary" variant="text" @click="dialog = false">
            {{ t('cancel')}}
          </v-btn>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

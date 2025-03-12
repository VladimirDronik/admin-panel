<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

const emit = defineEmits<{
  (e: 'update'): void
}>();

// Declare Options
defineProps({
  title: {
    type: String,
    default: 'pages.page',
  },
  total: {
    type: Number,
    default: -1,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isUpdating: {
    type: Boolean,
    default: false,
  },
  isUpdated: {
    type: Boolean,
    default: false,
  },
});

</script>

<template>
  <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between">
    <div class="tw-flex tw-items-center tw-gap-2">
      <!-- Title -->
      <h3
        v-if="title"
        class="tw-text-2xl tw-font-semibold"
      >
        {{ t(title) }}
        <!-- Total -->
        <span
          v-if="total !== -1"
          class="tw-relative tw-bottom-1.5 tw-text-base tw-font-normal"
        >
          {{ total }}
        </span>
        <!--  -->
      </h3>
      <ProgressSpinner
        v-if="isLoading"
        aria-label="Сохранение"
        stroke="#19B58F"
        stroke-width="3"
        style="width: 20px; height: 20px"
      />
    </div>
    <!--  -->
    <div class="tw-flex tw-items-center">
      <Button
        v-if="isUpdated"
        aria-label="Save"
        class="tw-mr-3"
        icon="pi pi-refresh"
        rounded
        text
        @click="emit('update')"
      />
      <slot />
    </div>
  </div>
</template>

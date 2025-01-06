<script setup lang="ts">

// Types
interface AddWidget {
  width: number;
  height: number;
}

// Declare Options
defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'add-widget', params: AddWidget): void
}>();

const isOpen = defineModel<boolean>('isOpen', {
  required: true,
});

const isUpdate = defineModel<boolean>('isUpdate', {
  required: true,
});

// Variables
const widgets = [
  {
    title: '1 X 4',
    params: { width: 4, height: 1 },
  },
  {
    title: '1 X 6',
    params: { width: 6, height: 1 },
  },
  {
    title: '2 X 2',
    params: { width: 2, height: 2 },
  },
  {
    title: '2 X 4',
    params: { width: 4, height: 2 },
  },
  {
    title: '2 X 6',
    params: { width: 6, height: 2 },
  },
  {
    title: '2 X 12',
    params: { width: 12, height: 2 },
  },
];
</script>

<template>
  <LayoutRightbar
    :is-open="isOpen"
    :is-update="isUpdate"
  >
    <div
      class="tw-min-h-80 tw-p-7"
      elevation="0"
    >
      <div class="tw-mb-2 tw-flex tw-items-center tw-justify-between">
        <h3 class="text-capitalize tw-text-3xl tw-font-semibold">
          {{ edit ? 'Изменить Виджет' : 'Добавить Виджет' }}
        </h3>
        <Button
          icon="pi pi-times"
          rounded
          severity="secondary"
          size="small"
          text
          @click="isOpen = false"
        />
      </div>
      <div v-if="!edit">
        <div class="tw-flex tw-flex-col tw-gap-2">
          <button
            v-for="widget in widgets"
            :key="widget.title"
            class="tw-flex tw-h-24 tw-w-full tw-items-center tw-justify-center tw-rounded-lg tw-bg-gray-200 tw-p-3 tw-text-2xl"
            type="button"
            @click="emit('add-widget', widget.params)"
          >
            {{ widget.title }}
          </button>
        </div>
      </div>
      <div v-else>
        Редактирование
      </div>
    </div>
  </LayoutRightbar>
</template>

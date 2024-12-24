<script lang="ts" setup>
// Builtin modules
import { useI18n } from 'vue-i18n';
import { IconFilterFilled } from '@tabler/icons-vue';

// Composables
const { t } = useI18n();

// Declare Options
defineProps({
  title: {
    type: String,
    required: true,
  },
});

// Variables
const popover = ref();

// Methods
const toggle = (event: any) => {
  popover.value.toggle(event);
};

</script>

<template>
  <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
    <p class="tw-font-semibold">
      {{ t(title) }}
    </p>
    <button
      class="tree-table__header-filter tw-ml-3 tw-bg-white"
      type="button"
      @click="toggle"
    >
      <IconFilterFilled class="tw-h-4 tw-w-4 tw-text-slate-400" />
    </button>
    <Popover ref="popover">
      <div class="category tw-flex tw-flex-col tw-gap-2 tw-p-2">
        <slot />
      </div>
    </Popover>
  </div>
</template>

<style>

</style>

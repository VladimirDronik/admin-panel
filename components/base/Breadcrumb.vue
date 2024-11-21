<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
// Types
import type { PropType } from 'vue';

// Composables
const { t } = useI18n();

interface Breadcrumb {
  text: string,
  disabled: boolean,
  href: string,
}

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
  breadcrumbs: {
    type: Object as PropType<Breadcrumb[]>,
    default() {
      return [];
    },
  },
});

</script>

<template>
  <div class="tw-mb-4 tw-flex tw-items-center tw-justify-between">
    <!-- Title -->
    <h3
      v-if="title"
      class="tw-text-2xl tw-font-semibold"
    >
      {{ t(title) }}
      <!-- Total -->
      <span class="tw-relative tw-bottom-1.5 tw-text-base tw-font-normal" v-if="total !== -1">
        {{ total }}
      </span>
      <!--  -->
    </h3>
    <!--  -->
    <slot />
  </div>
</template>

<style lang="scss">
.page-breadcrumb {
    .v-toolbar {
        background: transparent;
    }
}
</style>

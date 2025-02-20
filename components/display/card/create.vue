<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { IconPlus } from '@tabler/icons-vue';

// Composables
const { t } = useI18n();
const storeUser = useUserStore();

</script>

<template>
  <button
    class="tw-m-1.5"
    type="button"
  >
    <div
      class="tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-[15%] tw-p-3"
      :class="storeUser.isDark ? 'tw-bg-[#323232]' : 'tw-bg-[#D6E4E1]'"
    >
      <IconPlus
        height="60"
        stroke-width="1.5"
        :style="{ color: storeUser.isDark ? '#9B9B9B' : '#83A39B' }"
        width="60"
      />
    </div>
    <h5 class="tw-w-28 tw-truncate tw-text-center">
      {{ t('add') }}
    </h5>
  </button>
</template>

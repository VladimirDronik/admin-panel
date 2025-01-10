<script setup lang="ts">
// Builtin modules
import { useI18n } from 'vue-i18n';
// Static Data modules
import sidebarData from './sidebarItem';

// Composables
const { t } = useI18n();
const route = useRoute();

// Declare Options
const open = defineModel<boolean>('open', {
  required: true,
  default: false,
});

// Variables
const sidebar = shallowRef(sidebarData);

// Computed Properties
const to = computed(() => route.path);
</script>

<template>
  <div
    class="tw-fixed tw-inset-y-0 tw-left-0 tw-w-full tw-max-w-80"
    :class="{ '!tw-max-w-20': !open }"
  >
    <div class="border-base tw-h-full tw-min-w-full tw-overflow-hidden !tw-rounded-none tw-border-r tw-p-5 tw-pt-6 !tw-shadow-none">
      <div class="tw-mb-5">
        <Logo v-if="open" />
        <LogoRtlLogo v-else />
      </div>
      <div
        v-for="item in sidebar"
        :key="item.title"
      >
        <div v-if="item.title">
          <Button
            v-tooltip="{
              value: t(item.title),
              disabled: open,
              background: ' #000000',
            }"
            as="router-link"
            class="text-base tw-mb-1 tw-w-full !tw-justify-start tw-text-black"
            :class="{ '!tw-justify-center': !open }"
            :text="to !== item.to"
            :to="item.to"
          >
            <component
              :is="item.icon"
              class="iconClass tw-min-w-5"
              size="20"
              stroke-width="1.5"
            />
            {{ open ? t(item.title) : '' }}
          </Button>
        </div>
        <p
          v-else-if="item.header"
          class="tw-mb-3 tw-pt-3 tw-font-semibold"
          :class="{ 'tw-text-center': !open }"
        >
          {{ open ? t(item.header) : '...' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.router-link-active {
    color: white !important;
  }

.p-dark {

  & .router-link-active {
    background-color: var(--p-surface-800) !important;
    border-color: var(--p-surface-800) !important;
    color: var(--p-primary-700) !important;
  }
}
</style>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
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
    <Card class="tw-h-full tw-min-w-full tw-overflow-hidden !tw-rounded-none tw-border-r !tw-shadow-none">
      <template #content>
        <div class="tw-mb-7 ">
          <Logo v-if="open" />
          <LogoRtlLogo v-else />
        </div>
        <div
          v-for="item in sidebar"
          :key="item.title"
        >
          <div v-if="!item.header">
            <Button
              v-tooltip="{
                value: t(item.title),
                disabled: open,
                background: ' #000000',
              }"
              as="router-link"
              class="tw-mb-1 tw-w-full !tw-justify-start tw-text-black"
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
            v-else
            class="tw-mb-3 tw-pt-3 tw-font-semibold"
            :class="{ 'tw-text-center': !open }"
          >
            {{ open ? t(item.header) : '...' }}
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style>
.router-link-active {
  color: white !important;
}
</style>

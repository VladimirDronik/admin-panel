<script setup>
import { useI18n } from 'vue-i18n';
import sidebarData from './vertical-sidebar/sidebarItem';

// Composables
const { t } = useI18n();

const open = defineModel('open', {
  required: true,
});

const sidebar = shallowRef(sidebarData);

const route = useRoute();

const to = computed(() => route.path);

</script>

<template>
  <div :class="{ '!tw-max-w-20': !open }" class="tw-fixed tw-inset-y-0 tw-left-0 tw-w-full tw-max-w-96">
    <Card class="tw-h-full tw-min-w-full tw-overflow-hidden !tw-rounded-none">
      <template #content>
        <div class="tw-mb-7 ">
          <LayoutFullLogo v-if="open" />
          <LayoutFullLogoRtlLogo v-else />
        </div>
        <div v-for="item in sidebar" :key="item.title">
          <div v-if="!item.header">
            <Button
              :text="to !== item.to"
              :to="item.to"
              :class="{ 'tw-justify-center': !open }"
              as="router-link"
              class="tw-mb-1 tw-w-full tw-justify-start tw-text-black"
            >
              <component
                :is="item.icon"
                size="20"
                stroke-width="1.5"
                class="iconClass tw-min-w-5"
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

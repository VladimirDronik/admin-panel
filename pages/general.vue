<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.general')),
});

const layout = ref([
  {
    x: 0, y: 0, w: 4, h: 2, i: 0,
  },
  {
    x: 4, y: 0, w: 4, h: 2, i: 1,
  },
  {
    x: 8, y: 0, w: 4, h: 2, i: 2,
  },
  {
    x: 0, y: 2, w: 6, h: 1, i: 3,
  },
  {
    x: 0, y: 3, w: 6, h: 1, i: 4,
  },
  {
    x: 6, y: 2, w: 6, h: 2, i: 5,
  },
  {
    x: 0, y: 4, w: 3, h: 2, i: 6,
  },
  {
    x: 3, y: 4, w: 3, h: 2, i: 7,
  },
  {
    x: 6, y: 4, w: 3, h: 2, i: 8,
  },
  {
    x: 9, y: 4, w: 3, h: 2, i: 9,
  },
]);

</script>

<template>
  <div>
    <BaseBreadcrumb title="pages.general">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить виджет"
      />
    </BaseBreadcrumb>
    <grid-layout
      v-model:layout="layout"
      :col-num="12"
      :row-height="100"
    >
      <template #default="{ gridItemProps }">
        <grid-item
          class="rounded-lg tw-flex tw-items-end tw-justify-end tw-p-3"
          v-for="item in layout"
          :key="item.i"
          v-bind="gridItemProps"
          :isResizable="false"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          <Button icon="pi pi-cog" text rounded size="large" />
        </grid-item>
      </template>
    </grid-layout>
  </div>
</template>

<style>
.vue-grid-item.vue-grid-placeholder {
    background: var(--p-primary-color) !important;
    border-radius: 8px;
}
</style>

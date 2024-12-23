<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { GridLayout, GridItem } from 'vue3-grid-layout-next';

interface AddWidget {
  width: number;
  height: number;
}

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.general')),
});

const cols = 12;

const edit = ref(false);
const isOpen = ref(false);
const isUpdate = ref(false);

const layout = ref([
  {
    x: 0, y: 0, w: 4, h: 2, i: '0',
  },
  {
    x: 4, y: 0, w: 4, h: 2, i: '1',
  },
  {
    x: 8, y: 0, w: 4, h: 2, i: '2',
  },
  {
    x: 0, y: 2, w: 6, h: 1, i: '3',
  },
  {
    x: 0, y: 3, w: 6, h: 1, i: '4',
  },
  {
    x: 6, y: 2, w: 6, h: 2, i: '5',
  },
  {
    x: 0, y: 4, w: 3, h: 2, i: '6',
  },
  {
    x: 3, y: 4, w: 3, h: 2, i: '7',
  },
  {
    x: 6, y: 4, w: 3, h: 2, i: '8',
  },
  {
    x: 9, y: 4, w: 3, h: 2, i: '9',
  },
]);

const openCreateRightBar = () => {
  isOpen.value = true;
  edit.value = false;
};

const openUpdateRightBar = () => {
  isOpen.value = true;
  edit.value = true;
};

const addWidget = (params: AddWidget) => {
  layout.value.push({
    x: (layout.value.length * 2) % (cols || 12),
    y: layout.value.length + (cols || 12),
    w: params.width,
    h: params.height,
    i: String(layout.value.length),
  });
};

</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.general">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить виджет"
        @click="openCreateRightBar"
      />
    </SharedUIBreadcrumb>
    <GridLayout
      v-model:layout="layout"
      :col-num="cols"
      :row-height="100"
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        class="tw-flex tw-items-end tw-justify-end tw-rounded-lg tw-bg-gray-200 tw-p-3"
        :h="item.h"
        :i="item.i"
        :is-resizable="false"
        :w="item.w"
        :x="item.x"
        :y="item.y"
      >
        <Button
          icon="pi pi-cog"
          rounded
          size="large"
          text
          @click="openUpdateRightBar"
        />
      </GridItem>
    </GridLayout>

    <template #rightbar>
      <RightBarGeneral
        v-model:is-open="isOpen"
        v-model:is-update="isUpdate"
        :edit="edit"
        @add-widget="addWidget"
      />
    </template>
  </SharedUIPanel>
</template>

<style>
.vue-grid-item.vue-grid-placeholder {
    background: var(--p-primary-color) !important;
    border-radius: 8px;
}
</style>

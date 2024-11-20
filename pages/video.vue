<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { checkStatusTextSmall, checkStatusColor } from '~/helpers/rooms';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.video')),
});

const items = [
  {
    name: 'Камера №1',
    status: 'ON',
    id: 1,
  },
  {
    name: 'Камера №2',
    status: 'ON',
    id: 2,
  },
  {
    name: 'Камера №3',
    status: 'ON',
    id: 3,
  },
  {
    name: 'Камера №4',
    status: 'ON',
    id: 4,
  },
  {
    name: 'Камера №5',
    status: 'ON',
    id: 5,
  },
  {
    name: 'Камера №6',
    status: 'ON',
    id: 6,
  },
];
</script>

<template>
  <div>
    <BaseBreadcrumb title="pages.video">
      <Button
        class="text-capitalize"
        icon="pi pi-plus"
        label="Добавить устройство"
      />
    </BaseBreadcrumb>

    <div class="tw-mb-5 tw-flex tw-gap-2">
      <Select placeholder="Выберите Категорию" />
      <InputText placeholder="Поиск" />
    </div>

    <div class="tw-grid tw-w-full tw-grid-cols-3 tw-justify-between tw-gap-5">
      <div v-for="item in items" :key="item.id" class="tw-relative tw-aspect-video tw-w-full tw-rounded tw-bg-slate-200">
        <div class="tw-absolute tw-bottom-2 tw-left-2 tw-rounded-full tw-bg-slate-300 tw-px-3 tw-py-2 tw-text-sm">
          {{ item.name }}
        </div>
        <div class="tw-absolute tw-right-2 tw-top-2 tw-flex tw-items-center tw-rounded-full tw-bg-slate-300 tw-px-3 tw-py-2 tw-text-sm">
          <div
            class="tw-mr-2 tw-h-2.5 tw-w-2.5 tw-rounded-full"
            :class="checkStatusColor(item.status)"
          />
          {{ checkStatusTextSmall(item.status)}}
        </div>
        <Button class="tw-absolute tw-bottom-2 tw-right-2" icon="pi pi-cog" text rounded size="large" />
      </div>
    </div>
  </div>
</template>

<style>

</style>

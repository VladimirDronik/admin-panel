<script lang="ts" setup>

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
      <div class="tw-aspect-video tw-w-full tw-rounded tw-bg-slate-300" />
      <div class="tw-aspect-video tw-w-full tw-rounded tw-bg-slate-300" />
      <div class="tw-aspect-video tw-w-full tw-rounded tw-bg-slate-300" />
      <div class="tw-aspect-video tw-w-full tw-rounded tw-bg-slate-300" />
      <div class="tw-aspect-video tw-w-full tw-rounded tw-bg-slate-300" />
      <div class="tw-aspect-video tw-w-full tw-rounded tw-bg-slate-300" />
    </div>
  </div>
</template>

<style>

</style>

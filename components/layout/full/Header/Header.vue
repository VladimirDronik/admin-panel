<script lang="ts" setup>

const open = defineModel<boolean>('open', {
  required: true,
});

</script>

<template>
  <div
    class="tw-sticky tw-top-0 tw-z-30 tw-flex tw-h-20 tw-items-center !tw-rounded-none tw-border-b tw-bg-white tw-px-6 !tw-shadow-none"
  >
    <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
      <Button
        class="tw-aspect-square tw-h-9 tw-w-9"
        icon="pi pi-align-justify"
        rounded
        severity="secondary"
        size="small"
        @click="open = !open"
      />
      <div class="tw-flex tw-items-center">
        <LayoutFullHeaderLanguage class="tw-mr-2" />

        <LayoutFullHeaderNotification class="tw-mr-2" />

        <LayoutFullHeaderProfile />
      </div>
    </div>
  </div>
</template>

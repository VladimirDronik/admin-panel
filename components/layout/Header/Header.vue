<script lang="ts" setup>
// Composables
const storeUser = useUserStore();

// Declare Options
const open = defineModel<boolean>('open', {
  required: true,
});
</script>

<template>
  <div class="border-base bg-base tw-sticky tw-top-0 tw-z-30 tw-flex tw-h-16 tw-items-center !tw-rounded-none tw-border-b tw-bg-white tw-px-6 !tw-shadow-none">
    <div class="tw-flex tw-w-full tw-items-center tw-justify-between">
      <Button
        class="tw-aspect-square tw-size-9"
        data-test="sidebar-btn"
        icon="pi pi-align-justify"
        size="small"
        text
        @click="open = !open"
      />
      <div class="tw-flex tw-items-center">
        <Button
          class="tw-mr-2 tw-aspect-square"
          :icon="storeUser.isDark ? 'pi pi-moon' : 'pi pi-sun'"
          size="small"
          text
          @click="storeUser.toggleDark()"
        />
        <LayoutHeaderLanguage class="tw-mr-2" />

        <!-- <LayoutHeaderNotification class="tw-mr-2" /> -->

        <LayoutHeaderProfile />
      </div>
    </div>
  </div>
</template>

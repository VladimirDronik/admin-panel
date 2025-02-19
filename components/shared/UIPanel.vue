<script setup lang="ts">
// Builtin modules
const isUpdate = defineModel<boolean>('isUpdate', {
  default: false,
});
</script>

<template>
  <SharedUILoader :is-update="isUpdate">
    <div class="panel-wrapper tw-relative tw-flex">
      <PerfectScrollbar class="tw-w-full tw-px-6 tw-pt-4">
        <div class="tw-pb-10">
          <slot />
        </div>
      </PerfectScrollbar>
      <slot name="rightbar" />
    </div>
  </SharedUILoader>
</template>

<style lang="scss">
.panel-wrapper {
  min-height: calc(100vh - 56px);
  max-height: calc(100vh - 56px);
  padding-bottom: 0;
  overflow: hidden;

  & .ps__rail-x {
    display: none;
  }
}
</style>

<template>
  <div class="panel-wrapper tw-relative">
    <div class="tw-px-6 tw-pt-6">
      <slot />
    </div>
    <!-- <div class="tw-absolute tw-inset-y-0 tw-right-0 tw-z-20 tw-bg-white">
      <slot name="rightbar" />
    </div> -->
    <slot name="rightbar" />
  </div>
</template>

<style>
.panel-wrapper {
  min-height: calc(100vh - 90px);
  padding-bottom: 0;
  overflow: hidden;
}
</style>

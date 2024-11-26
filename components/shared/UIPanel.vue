<script setup lang="ts">

const isUpdate = defineModel('isUpdate', {
  default: false,
});
</script>

<template>
  <SharedUILoader :isUpdate="isUpdate">
    <div class="panel-wrapper tw-relative tw-flex">
      <div class="tw-w-full tw-px-6 tw-pt-6">
        <slot />
      </div>
      <slot name="rightbar" />
    </div>
  </SharedUILoader>
</template>

<style>
.panel-wrapper {
  min-height: calc(100vh - 90px);
  padding-bottom: 0;
  overflow: hidden;
}
</style>

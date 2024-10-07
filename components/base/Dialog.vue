<script setup lang="ts">
const dialog = defineModel<boolean>();

defineProps({
  width: {
    type: Number,
    default: 500,
  },
});
</script>

<template>
  <slot name="button" />
  <v-dialog v-model="dialog" :max-width="width">
    <perfect-scrollbar class="max-h-80 tw-max-h-full">
      <div class="tw-rounded tw-bg-white tw-p-3">
        <slot />
      </div>
    </perfect-scrollbar>
  </v-dialog>
</template>

<style lang="scss" scoped>
.max-h-80 {
  max-height: 80vh;
}
</style>

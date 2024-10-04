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
    <perfect-scrollbar class="tw-max-h-80">
      <div class="tw-rounded tw-bg-white tw-p-3">
        <slot />
      </div>
    </perfect-scrollbar>
  </v-dialog>
</template>

<style lang="scss" scoped>
.tw-max-h-80 {
  min-height: 80vh;
}
</style>

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
  <div>
    <slot name="button" />
    <v-dialog v-model="dialog" :max-width="width">
      <v-card class="tw-bg-white tw-p-4">
        <slot />
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.max-h-80 {
  max-height: 80vh;
}
</style>

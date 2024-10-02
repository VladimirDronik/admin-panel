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
    <div class="tw-rounded tw-bg-white tw-p-3">
      <slot />
    </div>
    <!-- <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="showBtn"
        v-bind="activatorProps"
        :color="colorBtn"
        :text="titleBtn"
        :loading="loadingBtn"
      />
    </template> -->

  </v-dialog>
</template>

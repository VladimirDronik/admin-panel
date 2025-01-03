<script setup lang="ts">

// Declare Options
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="tw-relative tw-w-full">
    <transition
      mode="out-in"
      name="smooth-loader"
    >
      <div
        v-if="isUpdate"
        class="bg-base tw-absolute tw-inset-0 tw-z-40 tw-w-full tw-overflow-hidden tw-bg-white"
        data-test="loader"
      >
        <div class="tw-flex tw-h-full tw-items-center tw-justify-center">
          <ProgressSpinner
            stroke="#19B58F"
            stroke-width="3"
            style="width: 30px; height: 30px"
          />
        </div>
      </div>
    </transition>
    <slot />
  </div>
</template>

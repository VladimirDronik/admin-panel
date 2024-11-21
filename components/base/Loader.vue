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
  <div>
    <div
      v-show="!isLoading"
      class="tw-relative"
    >
      <transition
        name="smooth-loader"
        mode="out-in"
      >
        <div
          v-if="isUpdate"
          data-test="loader"
          class="tw-absolute tw-inset-0 tw-z-40 tw-overflow-hidden tw-bg-white"
        >
          <div class="tw-flex tw-h-full tw-items-center tw-justify-center">
            <ProgressSpinner strokeWidth="3" style="width: 30px; height: 30px" fill="#19B58F" />
          </div>
        </div>
      </transition>
      <slot />
    </div>
  </div>
</template>

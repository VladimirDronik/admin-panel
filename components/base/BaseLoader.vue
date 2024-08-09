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
          class="tw-absolute tw-inset-0 tw-z-40 tw-overflow-hidden tw-bg-white tw-opacity-80"
        >
          <div class="tw-flex tw-h-full tw-items-center tw-justify-center">
            <v-progress-circular
              :size="60"
              :width="6"
              color="primary"
              indeterminate
            />
          </div>
        </div>
      </transition>
      <slot />
    </div>
  </div>
</template>

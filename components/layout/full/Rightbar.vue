<script setup lang="ts">
// Variables
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

// Declare Options
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

// Hooks
onMounted(() => {
  window.onresize = () => {
    width.value = window.innerWidth;
  };
  window.onresize = () => {
    height.value = window.innerHeight;
  };
});

</script>

<template>
  <div
    :style="{ width: `${width / 3}px` }"
    :class="{ 'rightbar-active': isOpen }"
    class="rightbar tw-absolute tw-inset-y-0 tw-right-0 tw-z-20 tw-translate-x-full tw-border-l tw-bg-white"
  >
    <BaseLoader :isUpdate="isUpdate">
      <ScrollPanel :style="{ height: `${height - 90}px`, width: '100%' }">
        <slot />
      </ScrollPanel>
    </BaseLoader>
  </div>
</template>

<style scoped lang="scss">

.rightbar {
  transition: transform .15s linear;
  transform: translateX(101%) !important;

  &-active {
    transform: translateX(0) !important;
  }
}
</style>

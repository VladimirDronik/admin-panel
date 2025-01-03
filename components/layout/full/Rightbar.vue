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
    class="bg-base border-base rightbar tw-w-full tw-border-l tw-bg-white"
    :class="{ 'rightbar-active': isOpen }"
    :style="{ 'max-width': `${isOpen ? width / 3 : 0}px` }"
  >
    <SharedUILoader :is-update="isUpdate">
      <ScrollPanel :style="{ height: `${height - 90}px`, width: '100%' }">
        <slot />
      </ScrollPanel>
    </SharedUILoader>
  </div>
</template>

<style scoped lang="scss">
.rightbar {
  transition: max-width .1s linear;
}
</style>

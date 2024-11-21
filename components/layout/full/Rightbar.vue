<script setup lang="ts">
// import { useDisplay } from 'vuetify';
import { useAuthStore } from '#imports';

// const { width } = useDisplay();

const storeUser = useAuthStore();

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

onMounted(() => {
  window.onresize = () => {
    width.value = window.innerWidth;
  };
  window.onresize = () => {
    height.value = window.innerHeight;
  };
});

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
</script>

<template>
  <div
    :style="{ width: `${width / 3}px` }"
    :class="{ 'rightbar-active': isOpen }"
    class="tw-absolute tw-inset-y-0 tw-right-0 tw-z-20 tw-translate-x-full tw-border-l tw-bg-white"
  >
    <BaseLoader :isUpdate="isUpdate">
      <ScrollPanel :style="{ height: `${height - 90}px`, width: '100%' }">
        <slot />
      </ScrollPanel>
    </BaseLoader>
  </div>
</template>

<style scoped lang="scss">
.rightbar-active {
  transition: transform .15s linear;
  transform: translateX(0) !important;
}
</style>

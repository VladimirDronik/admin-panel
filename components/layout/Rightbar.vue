<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';

const { width, height } = useWindowSize();

// Declare Options
defineProps<{
  title?: string,
  isUpdate?: boolean,
}>();

const isOpen = defineModel<boolean>('isOpen');

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
    :style="{
      'max-width': `${isOpen ? width / 3 : 0}px`,
    }"
  >
    <SharedUILoader :is-update="isUpdate">
      <ScrollPanel :style="{ height: `${height - 90}px`, width: '100%' }">
        <div class="tw-min-h-80 tw-p-6">
          <div
            v-if="title"
            class="tw-mb-4 tw-flex tw-items-center tw-justify-between"
          >
            <h3 class="text-capitalize tw-text-2xl tw-font-semibold">
              {{ title }}
            </h3>
            <Button
              icon="pi"
              rounded
              size="small"
              text
              variant="text"
              @click="isOpen = false"
            >
              <IconX class="white" />
            </Button>
          </div>
          <slot />
        </div>
      </ScrollPanel>
    </SharedUILoader>
  </div>
</template>

<style scoped lang="scss">
.rightbar {
  transition: max-width .1s linear;
}
</style>

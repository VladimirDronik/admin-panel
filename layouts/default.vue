<script setup lang="ts">
// Builtin modules
import { useStorage } from '@vueuse/core';

// Composables
const userStore = useUserStore();
const localState = useStorage('touch-on', {
  token: '',
  openSidebar: true,
  language: 'ru',
});

// Variables
const open = ref<boolean>(!!localState.value.openSidebar);

// Watchers
watch(open, (newValue) => localState.value.openSidebar = newValue);

</script>

<template>
  <div>
    <!-- Sidebar -->
    <LayoutSidebar
      v-model:open="open"
      class="tw-z-40"
    />
    <!--  -->
    <div
      class="tw-pl-80"
      :class="{ '!tw-pl-20': !open }"
    >
      <LayoutHeader v-model:open="open" />
      <!-- Notifications -->
      <Toast :base-z-index="99999" />
      <!--  -->

      <slot />
    </div>
  </div>
</template>

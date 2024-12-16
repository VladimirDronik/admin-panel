<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const open = ref<boolean>(!!userStore.userLocal?.openSidebar);

watch(open, (newValue) => {
  localStorage.setItem(userStore.localStorageName, JSON.stringify({
    ...userStore.userLocal,
    openSidebar: newValue,
  }));
  if (userStore.userLocal) {
    userStore.userLocal = {
      ...userStore.userLocal,
      openSidebar: newValue,
    };
  }
});

</script>

<template>
  <div>
    <!-- Sidebar -->
    <LayoutFullSidebar v-model:open="open" class="tw-z-40" />
    <!--  -->
    <div class="tw-pl-80" :class="{ '!tw-pl-20': !open }">
      <LayoutFullHeader v-model:open="open" />
      <!-- Notifications -->
      <Toast :baseZIndex="99999" />
      <!--  -->

      <slot />
    </div>
  </div>
</template>

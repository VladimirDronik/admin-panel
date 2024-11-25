<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const authStore = useUserStore();

const open = ref<boolean>(!!authStore.userLocal?.openSidebar);

watch(open, (newValue) => authStore.changeSideBar(newValue));

</script>

<template>
  <div>
    <!-- Layout -->
    <LayoutFullSidebar v-model:open="open" class="tw-z-40" />
    <LayoutFullHeader v-model:open="open">
      <!-- Notifications -->
      <Toast :baseZIndex="99999" />
      <!--  -->
      <slot />
    </LayoutFullHeader>
    <!--  -->
  </div>
</template>

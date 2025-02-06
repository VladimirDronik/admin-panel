<script setup lang="ts">
// Composables
const storeUser = useUserStore();

// Variables
const open = ref<boolean>(!!storeUser.localState.openSidebar);

// Watchers
watch(open, (newValue) => storeUser.localState.openSidebar = newValue);
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

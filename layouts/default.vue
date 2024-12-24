<script setup lang="ts">

// Composables
const userStore = useUserStore();

// Variables
const open = ref<boolean>(!!userStore.userLocal?.openSidebar);

// Watchers
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
    <LayoutFullSidebar
      v-model:open="open"
      class="tw-z-40"
    />
    <!--  -->
    <div
      class="tw-pl-80"
      :class="{ '!tw-pl-20': !open }"
    >
      <LayoutFullHeader v-model:open="open" />
      <!-- Notifications -->
      <Toast :base-z-index="99999" />
      <!--  -->

      <slot />
    </div>
  </div>
</template>

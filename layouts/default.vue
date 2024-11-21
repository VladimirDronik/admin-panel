<script setup lang="ts">

const open = ref(true);

</script>

<template>
  <div>
    <!-- Layout -->
    <LayoutFullSidebar v-model:open="open" class="tw-z-40" />
    <LayoutFullHeader v-model:open="open">
      <Toast :baseZIndex="99999" />
      <slot />
    </LayoutFullHeader>
    <!--  -->

    <!-- Notifications -->

    <!--  -->
  </div>
</template>

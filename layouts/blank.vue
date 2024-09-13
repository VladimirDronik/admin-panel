// ===============================|| Blank Layout ||=============================== //
<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});
</script>
<template>
  <v-app class="cardBordered">
    <NuxtPage />
  </v-app>
</template>

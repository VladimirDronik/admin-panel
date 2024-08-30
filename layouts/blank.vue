// ===============================|| Blank Layout ||=============================== //
<script setup lang="ts">
import { RouterView } from 'vue-router';

definePageMeta({
  middleware: ['auth'],
});
</script>
<template>
  <v-app class="cardBordered">
    <RouterView />
  </v-app>
</template>

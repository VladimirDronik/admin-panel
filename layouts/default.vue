<script setup lang="ts">
import { RouterView } from 'vue-router';

const title = ref('Modernize - Nuxt3 Typescript based Free Admin Dashboard Template');
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => (titleChunk
    ? `${titleChunk} - Nuxt3 Typescript based Free Admin Dashboard Template`
    : 'Modernize - Nuxt3 Typescript based Free Admin Dashboard Template'),
});
</script>

<template>
  <v-locale-provider>
    <v-app>
      <LayoutFullMain />
      <v-main>
        <v-container fluid class="page-wrapper">
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

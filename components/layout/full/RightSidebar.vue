<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useAuthStore } from '#imports';

const { width } = useDisplay();

const storeUser = useAuthStore();

</script>

<template>
  <v-navigation-drawer
    v-model="storeUser.isActiveRightSidebar"
    location="right"
    app
    temporary
    elevation="10"
    :width="width / 3"
  >
    <v-card elevation="0">
      <div id="right-sidebar-content" />
    </v-card>
  </v-navigation-drawer>

</template>

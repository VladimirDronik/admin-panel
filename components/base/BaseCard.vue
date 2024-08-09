<script setup lang="ts">

// Declare Options
defineProps({
  title: {
    type: String,
    default: '',
  },
});

</script>

<template>
  <v-card
    elevation="10"
    class="overflow-visible"
  >
    <!-- Title -->
    <div v-if="title">
      <v-card-item class="px-6 py-4">
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>
      </v-card-item>
      <v-divider />
    </div>
    <!--  -->

    <!-- Card Body -->
    <v-card-text class="!tw-p-3 md:!tw-p-6">
      <slot />
    </v-card-text>
    <!--  -->
  </v-card>
</template>

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
    class="overflow-visible !tw-p-3 md:!tw-p-6"
  >
    <!-- Title -->
    <div v-if="title">
      <v-card-item class="px-6 py-4">
        <v-card-title>
          <p class="text-h5" data-test="title">
            {{ title }}
          </p>
        </v-card-title>
      </v-card-item>
      <v-divider />
    </div>
    <!--  -->

    <!-- Body -->
    <div>
      <slot />
    </div>
    <!--  -->
  </v-card>
</template>

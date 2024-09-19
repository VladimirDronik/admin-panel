<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next';

definePageMeta({
  middleware: ['auth'],
});

const data = ref([
  {
    title: 'Этаж 1',
    items: [
      'Кухня',
      'Гостинная',
      'Туалет',
    ],
  },
  {
    title: 'Этаж 2',
    items: [
      'Спальня',
      'Десткая',
      'Кабинет',
    ],
  },
  {
    title: 'Этаж 3',
  },
]);
</script>

<template>
  <BaseBreadcrumb title="pages.rooms" />
  <VueDraggableNext>
    <div v-for="place in data" :key="place.title">
      <v-expansion-panels v-if="place.items" class="tw-mb-2">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <p class="tw-text-lg">
              {{ place.title }}
            </p>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <VueDraggableNext>
              <div class="tw-cursor-pointer tw-py-2 tw-pl-2 tw-text-base" v-for="room in place.items" :key="room">
                {{ room }}
                <v-divider />
              </div>
            </VueDraggableNext>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card v-else class="tw-mb-2 tw-py-4 tw-pl-6 tw-text-lg">
        {{ place.title }}
      </v-card>
    </div>
  </VueDraggableNext>
</template>

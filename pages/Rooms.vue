<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next';
import { IconArrowsVertical } from '@tabler/icons-vue';
import _ from 'lodash';

definePageMeta({
  middleware: ['auth'],
});

// Composables
const storeRooms = useRoomsStore();

// Variables
const data = ref(storeRooms.list);
const loading = ref(false);

// Watchers
watchEffect(() => {
  data.value = storeRooms.list;
});

const save = _.debounce(async () => {
  loading.value = true;
  await storeRooms.changeRooms(data.value);
  loading.value = false;
});

watch(data, () => save);
</script>

<template>
  <BaseBreadcrumb title="pages.rooms" :total="storeRooms.total">
    <DialogsRoomCreateDialog />
  </BaseBreadcrumb>
  <VueDraggableNext v-model="data">
    <div v-for="place in data" :key="place.id">
      <v-expansion-panels v-if="place.rooms_in_group" class="tw-mb-2">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <p class="tw-flex tw-text-lg">
              <!-- <IconArrowsVertical stroke={2} class="handle" /> -->
              {{ place.name }}
            </p>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <VueDraggableNext v-model="place.rooms_in_group">
              <div class="tw-cursor-pointer tw-py-2 tw-pl-2 tw-text-base" v-for="room in place.rooms_in_group" :key="room.id">
                {{ room.name }}
                <v-divider />
              </div>
            </VueDraggableNext>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card v-else class="tw-mb-2 tw-py-4 tw-pl-6 tw-text-lg">
        {{ place.name }}
      </v-card>
    </div>
  </VueDraggableNext>
  <!-- <VueDraggableNext v-model="data">
    <Accordion :value="[]" multiple>
      <AccordionPanel :value="index" v-for="(place, index) in data" :key="place.id">
        <AccordionHeader>
          {{ place.name }}
        </AccordionHeader>
        <AccordionContent>
          <VueDraggableNext>
            <Accordion :value="[]" multiple>
              <AccordionPanel :value="index" v-for="(room, index) in place.rooms_in_group" :key="room.id">
                <AccordionHeader>
                  <div class="tw-cursor-pointer tw-py-2 tw-pl-2 tw-text-base">
                    {{ room.name }}
                  </div>
                </AccordionHeader>
                <AccordionContent>
                  <VueDraggableNext />
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </VueDraggableNext>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </VueDraggableNext> -->
</template>

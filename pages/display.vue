<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { VueDraggableNext } from 'vue-draggable-next';
// Types modules
import type { APIData } from '~/types/StoreTypes';
import { type DisplayData, displayRequestSchema, type RoomBtnsData } from '~/types/DisplayTypes';
// Helpers modules
import { roomColor } from '~/helpers/rooms';

// Composables
const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.display')),
});

// Variables
const apiDisplays = ref<APIData<DisplayData>>();

const id = ref<number>(0);
const edit = ref(false);
const isShow = ref(false);

const showPanel = (item_id: number | null = null) => {
  isShow.value = true;
  if (item_id) {
    edit.value = true;
    id.value = item_id;
  } else {
    edit.value = false;
  }
  isShow.value = true;
};

onBeforeMount(async () => {
  // Get Buttons
  const dataDeleteDevice: unknown = await useAPI(
    'http://10.35.16.1:8081/private/cp',
    {
      watch: false,
    },
    displayRequestSchema,
  );

  apiDisplays.value = dataDeleteDevice as APIData<DisplayData>;
  //
});

</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.display">
      <DialogsDisplayCreateDialog />
    </SharedUIBreadcrumb>
    <div class="tw-flex tw-flex-col tw-gap-2">
      <div
        v-for="rooms in apiDisplays?.data?.response.room_items"
        :key="rooms.id"
        class="tw-rounded-md tw-border tw-p-3"
      >
        <div class="tw-mb-2 tw-flex tw-w-full tw-items-center tw-justify-between">
          <div class=" tw-flex tw-items-center">
            <h4 class="tw-mr-2 tw-text-xl" :style="{ color: roomColor(rooms.style) }">
              {{ rooms.name }}
            </h4>
            <div
              v-for="sensor in rooms.sensors"
              :key="sensor.id_item"
              class="tw-mr-2 tw-flex tw-items-center"
            >
              <img
                :src="`scenario_items/${sensor.icon}.png`"
                alt=""
                class="tw-mr-0.5"
              >
              {{sensor.current}}
              <span v-if="sensor.type === 'temperature'">
                °
              </span>
              <span v-else-if="sensor.type === 'humidity'">
                %
              </span>
            </div>
          </div>
          <Button
            @click="showPanel()"
            label="Добавить кнопку"
            icon="pi pi-plus"
            size="small"
          />
        </div>
        <div class="tw-flex tw-flex-wrap tw-gap-3 tw-pt-2">
          <VueDraggableNext
            v-model="rooms.items"
            :animation="300"
            class="tw-gap-3"
          >
            <button
              v-for="items in rooms.items"
              @click="showPanel(items.item_id)"
              :key="items.item_id"
              type="button"
              class="tw-m-1"
            >
              <div
                class="tw tw-relative tw-flex tw-aspect-square tw-w-24 tw-items-center tw-justify-center tw-rounded-md tw-border tw-p-3"
                :class="{ '!tw-border-inherit': !(items.status === 'on') }"
                :style="{ borderColor: roomColor(rooms.style) }"
              >
                <img
                  :src="`items/${items.icon}.png`"
                  alt=""
                  :class="{ '!tw-opacity-60': !(items.status === 'on') }"
                >
                <Badge
                  v-if="items.group_elements"
                  :style="{ backgroundColor: roomColor(rooms.style) }"
                  :class="{ '!tw-bg-gray-400': !(items.status === 'on') }"
                  class="tw-absolute -tw-right-2 -tw-top-2 tw-rounded-full"
                  rounded
                >
                  {{ items.group_elements.length }}
                </Badge>
              </div>
              <h5 class="tw-w-24 tw-truncate tw-text-center">
                {{ items.title }}
              </h5>
            </button>
          </VueDraggableNext>
        </div>
      </div>
    </div>

    <template #rightbar>
      <RightBarDisplay
        v-model:edit="edit"
        v-model:id="id"
        v-model:is-show="isShow"
      />
    </template>
  </SharedUIPanel>
</template>

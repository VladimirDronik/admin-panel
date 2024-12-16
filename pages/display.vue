<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { VueDraggableNext } from 'vue-draggable-next';
import { IconPlus } from '@tabler/icons-vue';
// Types modules
import type { APIData } from '~/types/StoreTypes';
import { type DisplayData, displayRequestSchema, type RoomBtnsData } from '~/types/DisplayTypes';
// Helpers modules
import { itemColor, roomTextColor } from '~/helpers/rooms';

// Composables
const { t } = useI18n();

useHead({
  titleTemplate: computed(() => t('pages.display')),
});

// Variables
const apiDisplays = ref<APIData<DisplayData>>();

const id = ref<number>(0);
const zoneId = ref<number>(0);

const variant = ref('');
const isShow = ref(false);

const showItemPanel = (zone_id: number, item_id: number | null = null) => {
  zoneId.value = zone_id;
  if (item_id) {
    variant.value = 'Edit Item';
    id.value = item_id;
  } else {
    variant.value = 'Create Item';
  }
  isShow.value = true;
};

const showScenarioPanel = (item_id: number) => {
  id.value = item_id;
  variant.value = 'Edit Scenario';
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
      <PerfectScrollbar class="tw-flex tw-gap-2 tw-rounded-md tw-border tw-p-3">
        <button
          v-for="scenario in apiDisplays?.data?.response.scenario_items"
          @click="showScenarioPanel(scenario.id)"
          :key="scenario.id"
          type="button"
          class="tw-relative tw-aspect-square tw-w-32 tw-min-w-32 tw-rounded-md tw-border-2 tw-p-1"
        >
          <div class="tw-flex tw-h-full tw-w-full tw-items-center tw-justify-between tw-pt-1">
            <div class="tw-h-full tw-pt-2">
              <img
                :src="`scenario_items/${scenario.icon}.png`"
                alt=""
                class="tw-aspect-square tw-w-12"
              >
              <h4
                class="tw-absolute tw-bottom-2 tw-left-1.5 tw-right-0 tw-mr-2 tw-truncate tw-text-left tw-text-primary"
                :style="{ color: roomTextColor(scenario.color) }"
              >
                {{ scenario.title }}
              </h4>
              <!-- <Button class="tw-aspect-square tw-w-8" outlined icon="pi pi-plus" size="small" /> -->
            </div>
          </div>
        </button>
      </PerfectScrollbar>
      <div
        v-for="rooms in apiDisplays?.data?.response.room_items"
        :key="rooms.id"
        class="tw-rounded-md tw-border tw-p-3"
      >
        <div class="tw-flex tw-w-full tw-items-center tw-justify-between tw-pl-1.5 tw-pt-1">
          <div class=" tw-flex tw-items-center">
            <h4 class="tw-mr-2 tw-text-xl" :style="{ color: itemColor(rooms.style) }">
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
            <Button class="tw-aspect-square tw-w-8" outlined icon="pi pi-plus" size="small" />
          </div>
        </div>
        <div class="tw-pt-2">
          <VueDraggableNext
            v-model="rooms.items"
            :animation="300"
            class="tw-gap-3"
          >
            <button
              v-for="items in rooms.items"
              @click="showItemPanel(rooms.id, items.item_id)"
              :key="items.item_id"
              type="button"
              class="tw-m-1.5"
            >
              <div
                class="tw tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3"
                :class="{ '!tw-border-inherit': !(items.status === 'on') }"
                :style="{ borderColor: itemColor(rooms.style, items.color) }"
              >
                <img
                  :src="`items/${items.icon}.png`"
                  alt=""
                  class="tw-w-20"
                  :class="{ '!tw-opacity-60': !(items.status === 'on') }"
                >
                <Badge
                  v-if="items.group_elements"
                  :style="{ backgroundColor: itemColor(rooms.style, items.color) }"
                  :class="{ '!tw-bg-gray-400': !(items.status === 'on') }"
                  class="tw-absolute -tw-right-2.5 -tw-top-2.5 tw-rounded-full"
                  rounded
                >
                  {{ items.group_elements.length }}
                </Badge>
              </div>
              <h5 class="tw-w-28 tw-truncate tw-text-center">
                {{ items.title }}
              </h5>
            </button>
            <button
              @click="showItemPanel(rooms.id)"
              type="button"
              class="tw-m-1.5"
            >
              <div
                class="tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3"
              >
                <IconPlus
                  width="80"
                  height="80"
                  stroke-width="1.5"
                />
              </div>
              <h5 class="tw-w-28 tw-truncate tw-text-center">
                Добавить
              </h5>
            </button>
          </VueDraggableNext>
        </div>
      </div>
    </div>

    <template #rightbar>
      <RightBarDisplay
        @update="apiDisplays?.refresh"
        :variant="variant"
        :zoneId="zoneId"
        v-model:id="id"
        v-model:is-show="isShow"
      />
    </template>
  </SharedUIPanel>
</template>

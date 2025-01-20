<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { IconPlus } from '@tabler/icons-vue';
import { useStorage } from '@vueuse/core'
import { VueDraggableNext } from 'vue-draggable-next';
// Static Data modules
import { paths } from '~/utils/endpoints';
// Types modules
import type { APIData } from '~/types/StoreTypes';
import { type DisplayData, displayRequestSchema } from '~/types/DisplayTypes';

// Composables
const { t } = useI18n();
const storeRooms = useRoomsStore();
const localState = useStorage('touch-on', {
  token: '',
  openSidebar: true,
  language: 'ru',
})

useHead({
  titleTemplate: computed(() => t('pages.display')),
});

// Variables

const id = ref<number>(0);
const zoneId = ref<number>(0);

const variant = ref('');
const isShow = ref(false);

// Apis
const apiItems = ref<APIData<DisplayData>>();

// Computed
const itemIds = computed(() => apiItems.value?.data?.response.room_items.map((item) => item.id) ?? []);

const filteredRooms = computed(() => {
  let result: any[] = []
  const items = apiItems.value?.data?.response.room_items
  const filteredRooms = storeRooms.apiRooms?.data?.response.filter((item) => !itemIds.value.includes(item.id))
  if (items) result = [...result, ...items]
  if (filteredRooms) result = [...result, ...filteredRooms]
  return result
})

// Methods
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

const updateOrder = async (roomList: any, id: number) => {
  await $fetch(paths.privateItemsOrder, {
    method: 'PATCH',
    body: {
      zone_id: id,
      item_ids: roomList.map((item: any) => item.item_id),
    },
    headers: {
      token: localState.value.token ?? '',
    },
  });
}

// Hooks
onBeforeMount(async () => {
  await storeRooms.getRoomsApi();
  // Get Buttons
  const dataItemsGet: unknown = await useAPI(
    paths.privateCp,
    {
      watch: false,
    },
    displayRequestSchema,
  );

  apiItems.value = dataItemsGet as APIData<DisplayData>;
  //
});

</script>

<template>
  <SharedUIPanel :is-update="apiItems?.pending">
    <SharedUIBreadcrumb title="pages.display">
      <DialogsRoomCreateDialog @update="storeRooms.getRoomsApi" />
    </SharedUIBreadcrumb>
    <div class="tw-flex tw-flex-col tw-gap-2">
      <PerfectScrollbar
        v-if="apiItems?.data?.response.scenario_items?.length"
        class="border-base tw-flex tw-gap-2 tw-rounded-md tw-border tw-p-3"
      >
        <DisplayScenarioCard
          v-for="scenario in apiItems?.data?.response.scenario_items"
          :key="scenario.item_id"
          :color="scenario.color"
          :icon="scenario.icon"
          :title="scenario.title"
          @click="showScenarioPanel(scenario.item_id)"
        />
      </PerfectScrollbar>
      <div
        v-for="rooms in filteredRooms"
        :key="rooms.id"
        class="border-base tw-rounded-md tw-border tw-p-3"
      >
        <DisplayItemHeader
          :name="rooms.name"
          :sensors="rooms.sensors"
          :style="rooms.style"
        />
        <div class="tw-pt-2">
          <VueDraggableNext
            v-model="rooms.items"
            :animation="300"
            class="tw-gap-3"
            @change="updateOrder(rooms.items, rooms.id)"
          >
            <DisplayItemCard
              v-for="items in rooms.items"
              :key="items.item_id"
              :color="items.color"
              :group-elements="items.group_elements"
              :icon="items.icon"
              :status="items.status"
              :style="rooms.style"
              :title="items.title"
              @click="showItemPanel(rooms.id, items.item_id)"
            />
            <button
              class="tw-m-1.5"
              type="button"
              @click="showItemPanel(rooms.id)"
            >
              <div
                class="tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border-2 tw-p-3"
              >
                <IconPlus
                  height="80"
                  stroke-width="1.5"
                  width="80"
                />
              </div>
              <h5 class="tw-w-28 tw-truncate tw-text-center">
                {{ t('add') }}
              </h5>
            </button>
          </VueDraggableNext>
        </div>
      </div>
    </div>

    <template #rightbar>
      <RightBarDisplay
        v-model:id="id"
        v-model:is-show="isShow"
        :variant="variant"
        :zone-id="zoneId"
        @update="apiItems?.refresh"
      />
    </template>
  </SharedUIPanel>
</template>

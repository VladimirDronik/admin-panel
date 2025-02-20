<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { IconPlus } from '@tabler/icons-vue';
import { VueDraggableNext } from 'vue-draggable-next';
// Types modules
import type { Request } from '~/types/StoreTypes';
import { type DisplayData, displayRequestSchema } from '~/types/DisplayTypes';

// Composables
const { t } = useI18n();
const storeUser = useUserStore();
const storeDevices = useDevicesStore();

const {
  zoneId,
  itemId,
  scenarioId,
  isShow,
  variant,
  showItemPanel,
  showScenarioPanel,
} = useRightBar();

const {
  dataRooms,
  dataItems,
  statusItems,
  statusRooms,
  filteredRooms,
  update,
} = await useGetData();

useHead({
  titleTemplate: computed(() => t('pages.display')),
});

const isLoadingOrder = ref(false);

const updateOrder = async (roomList: any, id: number) => {
  isLoadingOrder.value = true;
  await api(paths.privateItemsOrder, {
    method: 'PATCH',
    body: {
      zone_id: id,
      item_ids: roomList.map((item: any) => item.item_id),
    },
    headers: {
      token: storeUser.localState.token ?? '',
    },
  });
  isLoadingOrder.value = false;
};

async function useGetData() {
  const createdData = await Promise.all([
    useAPI<Request<DisplayData>>(
      paths.privateCp,
      { watch: false },
      displayRequestSchema,
    ),
    useAPI<Request<RoomItem[]>>(
      paths.privateRoomsList,
      { watch: false },
      roomRequestSchema,
    ),
    storeDevices.getDevicesApi(),
  ]);

  const [
    {
      data: dataItems,
      status: statusItems,
      refresh: refrechItems,
    }, {
      data: dataRooms,
      status: statusRooms,
      refresh: refreshRooms,
    },
  ] = createdData;

  const itemIds = computed(() => dataItems.value?.response.room_items.map((item) => item.id) ?? []);

  const update = async () => {
    await Promise.all([
      refrechItems(),
      refreshRooms(),
      storeDevices.getDevicesApi(),
    ]);
  };

  const filteredRooms = computed(() => {
    let result: any[] = [];
    const items = dataItems.value?.response.room_items;
    const filteredRooms = dataRooms.value?.response.filter((item) => !itemIds.value.includes(item.id));
    if (items) result = [...result, ...items];
    if (filteredRooms) result = [...result, ...filteredRooms];
    return result;
  });

  return {
    dataItems,
    dataRooms,
    statusItems,
    statusRooms,
    filteredRooms,
    update,
  };
}

function useRightBar() {
  const zoneId = ref<number>(0);
  const isShow = ref(false);
  const variant = ref('');

  const itemId = ref<number>(0);
  const scenarioId = ref<number>(0);

  const showScenarioPanel = (item_id: number) => {
    scenarioId.value = item_id;
    variant.value = 'Edit Scenario';
    isShow.value = true;
  };

  const showItemPanel = (zone_id: number, item_id: number | null = null) => {
    zoneId.value = zone_id;
    if (item_id) {
      variant.value = 'Edit Item';
      itemId.value = item_id;
    } else {
      variant.value = 'Create Item';
    }
    isShow.value = true;
  };

  return {
    zoneId,
    itemId,
    scenarioId,
    isShow,
    variant,
    showItemPanel,
    showScenarioPanel,
  };
}
</script>

<template>
  <SharedUIPanel :is-update="statusItems === 'pending' || statusRooms === 'pending'">
    <SharedUIBreadcrumb
      :is-loading="isLoadingOrder"
      title="pages.display"
    >
      <RoomDialogCreate @update="update" />
    </SharedUIBreadcrumb>
    <div class="tw-flex tw-flex-col tw-gap-2">
      <div class="border-base tw-rounded-md tw-border tw-p-3">
        <h2 class="tw-mb-2 tw-text-xl">
          Сценарии
        </h2>
        <PerfectScrollbar
          v-if="dataItems?.response.scenario_items?.length"
          class="tw-flex tw-flex-wrap"
        >
          <DisplayCardScenario
            v-for="scenario in dataItems?.response.scenario_items"
            :key="scenario.item_id"
            :color="scenario.color"
            :icon="scenario.icon"
            :title="scenario.title"
            @click="showScenarioPanel(scenario.item_id)"
          />
          <button
            class="tw-m-1.5"
            type="button"
          >
            <div
              class="tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-[15%] tw-p-3"
              :class="storeUser.isDark ? 'tw-bg-[#323232]' : 'tw-bg-[#D6E4E1]'"
            >
              <IconPlus
                height="60"
                stroke-width="1.5"
                :style="{ color: storeUser.isDark ? '#9B9B9B' : '#83A39B' }"
                width="60"
              />
            </div>
            <h5 class="tw-w-28 tw-truncate tw-text-center">
              {{ t('add') }}
            </h5>
          </button>
        </PerfectScrollbar>
      </div>
      <div
        v-for="rooms in filteredRooms"
        :key="rooms.id"
        class="border-base tw-rounded-md tw-border tw-p-3"
      >
        <DisplayItemHeader
          :name="rooms.name"
          :rooms="dataRooms?.response"
          :sensors="rooms.sensors"
          :style="rooms.style"
          :zone-id="rooms.id"
          @update="update"
        />
        <div class="tw-pt-2">
          <VueDraggableNext
            v-model="rooms.items"
            :animation="300"
            class="tw-gap-3"
            @change="updateOrder(rooms.items, rooms.id)"
          >
            <DisplayCardItem
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
                class="tw-relative tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-[15%] tw-p-3"
                :class="storeUser.isDark ? 'tw-bg-[#323232]' : 'tw-bg-[#D6E4E1]'"
              >
                <IconPlus
                  height="60"
                  stroke-width="1.5"
                  :style="{ color: storeUser.isDark ? '#9B9B9B' : '#83A39B' }"
                  width="60"
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
        v-model:is-show="isShow"
        :item-id="itemId"
        :rooms="dataRooms?.response"
        :scenario-id="scenarioId"
        :variant="variant"
        :zone-id="zoneId"
        @update="update"
      />
    </template>
  </SharedUIPanel>
</template>

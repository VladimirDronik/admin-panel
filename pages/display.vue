<script lang="ts" setup>
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';

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
  dataGetGroupRooms,
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
      {
        watch: false,
        query: {
          with_empty_rooms: true,
          with_disabled_items: true,
        },
      },
      displayRequestSchema,
    ),
    useAPI<Request<RoomItem[]>>(
      paths.privateRoomsList,
      { watch: false },
      roomRequestSchema,
    ),
    useAPI<Request<any>>(
      paths.privateRoomsList,
      {
        query: {
          type_zones: 'groups_only',
        },
        watch: false,
      },
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
    {
      data: dataGetGroupRooms,
      refresh: refreshGetGroupRooms,
    },
  ] = createdData;

  const update = async () => {
    await Promise.all([
      refrechItems(),
      refreshRooms(),
      refreshGetGroupRooms(),
      storeDevices.getDevicesApi(),
    ]);
  };

  return {
    dataItems,
    dataRooms,
    statusItems,
    statusRooms,
    dataGetGroupRooms,
    update,
  };
}

function useRightBar() {
  const zoneId = ref<number>(0);
  const isShow = ref(false);
  const variant = ref('');

  const itemId = ref<number>(0);
  const scenarioId = ref<number>(0);

  const showScenarioPanel = (item_id?: number) => {
    if (item_id !== undefined) {
      scenarioId.value = item_id;
      variant.value = 'Edit Scenario';
    } else {
      variant.value = 'Create Scenario';
    }
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
  <SharedUIPanel
    :is-error="statusItems === 'error' || statusRooms === 'error'"
    :is-update="statusItems === 'pending' || statusRooms === 'pending'"
    @update="update"
  >
    <SharedUIBreadcrumb
      :is-loading="isLoadingOrder"
      is-updated
      title="pages.display"
      @update="update()"
    >
      <RoomDialogCreate
        :group-rooms="dataGetGroupRooms"
        @update="update"
      />
    </SharedUIBreadcrumb>
    <div class="tw-flex tw-flex-col tw-gap-2">
      <div class="border-base tw-rounded-md tw-border tw-p-3">
        <h2 class="tw-mb-2 tw-text-xl">
          Сценарии
        </h2>
        <PerfectScrollbar class="tw-flex tw-flex-wrap">
          <DisplayCardScenario
            v-for="scenario in dataItems?.response?.scenario_items"
            :key="scenario.item_id"
            :color="scenario.color"
            :icon="scenario.icon"
            :title="scenario.title"
            @click="showScenarioPanel(scenario.item_id)"
          />
          <DisplayCardCreate @click="showScenarioPanel()" />
        </PerfectScrollbar>
      </div>
      <div
        v-for="rooms in dataItems?.response.room_items"
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
            <DisplayCardCreate @click="showItemPanel(rooms.id)" />
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

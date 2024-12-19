<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { VueDraggableNext } from 'vue-draggable-next';
import { IconPlus } from '@tabler/icons-vue';
import _ from 'lodash';
// Types modules
import type { APIData } from '~/types/StoreTypes';
import { type DisplayData, displayRequestSchema } from '~/types/DisplayTypes';
import { paths } from '~/utils/endpoints';

// Composables
const { t } = useI18n();
const storeUser = useUserStore();

useHead({
  titleTemplate: computed(() => t('pages.display')),
});

// Variables
const apiItems = ref<APIData<DisplayData>>();
const apiItemsOrder = ref<APIData<any>>();

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

const roomIds = computed(() => {
  if (!apiItems.value?.data) return [];
  return apiItems.value.data.response.room_items.map((room) => ({
    zone_id: room.id,
    item_ids: room.items.map((item) => item.item_id),
  }));
});

watch(roomIds, async (newValue, oldValue) => {
  const result = newValue.find((item, index) => _.isEqual(item, oldValue[index]));
  if (result) {
    await $fetch(paths.privateItemsOrder, {
      method: 'PATCH',
      body: result,
      headers: {
        token: storeUser.userLocal?.token ?? '',
      },
    });
    // await apiItems.value?.refresh();
  }
});

</script>

<template>
  <SharedUIPanel>
    <SharedUIBreadcrumb title="pages.display">
      <DialogsDisplayCreateDialog />
    </SharedUIBreadcrumb>
    <div class="tw-flex tw-flex-col tw-gap-2">
      <PerfectScrollbar class="tw-flex tw-gap-2 tw-rounded-md tw-border tw-p-3">
        <DisplayScenarioCard
          v-for="scenario in apiItems?.data?.response.scenario_items"
          @click="showScenarioPanel(scenario.id)"
          :key="scenario.id"
          :icon="scenario.icon"
          :title="scenario.title"
          :color="scenario.color"
        />
      </PerfectScrollbar>
      <div
        v-for="rooms in apiItems?.data?.response.room_items"
        :key="rooms.id"
        class="tw-rounded-md tw-border tw-p-3"
      >
        <DisplayItemHeader
          :name="rooms.name"
          :style="rooms.style"
          :sensors="rooms.sensors"
        />
        <div class="tw-pt-2">
          <VueDraggableNext
            v-model="rooms.items"
            :animation="300"
            class="tw-gap-3"
          >
            <DisplayItemCard
              v-for="items in rooms.items"
              @click="showItemPanel(rooms.id, items.item_id)"
              :key="items.item_id"
              :icon="items.icon"
              :title="items.title"
              :status="items.status"
              :style="rooms.style"
              :color="items.color"
              :groupElements="items.group_elements"
            />
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
        @update="apiItems?.refresh"
        :variant="variant"
        :zoneId="zoneId"
        v-model:id="id"
        v-model:is-show="isShow"
      />
    </template>
  </SharedUIPanel>
</template>

<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { VueDraggableNext } from 'vue-draggable-next';
import { IconGripVertical, IconChevronDown, IconChevronUp } from '@tabler/icons-vue';
// Static Data modules
import { paths } from '~/utils/endpoints';
// Helpers modules
import { roomColor } from '~/helpers/rooms';
// Types modules
import type { RoomItem } from '~/stores/rooms/roomsTypes';
import type { APIData } from '~/types/StoreTypes';

// Composables
const { t } = useI18n();
const storeRooms = useRoomsStore();

useHead({
  titleTemplate: computed(() => t('pages.rooms')),
});

// Declare Options
definePageMeta({
  middleware: ['auth'],
});

// Variables
const isLoading = ref(false);

const orderRooms = ref<APIData<RoomItem[]>>();

const form = ref<RoomItem | null>();
const isUpdateRightBar = ref(false);

// Computed
const roomIds = computed(() => storeRooms.apiRooms?.data?.response.map((item) => {
  if (item.is_group) {
    // return {
    //   id: item.id,
    //   rooms_in_group: roomIds(item.rooms_in_group)
    // }
  }
  return item.id;
}));

// Methods
const openRightBar = (item: RoomItem) => {
  isUpdateRightBar.value = true;
  form.value = item;
};

const save = async () => {
  await orderRooms.value?.refresh();
  await storeRooms.getRoomsApi();
};

// Watchers
watch(roomIds, (newValue, oldValue) => {
  if (oldValue && !_.isEqual(newValue, oldValue)) save();
});

// Hooks
onBeforeMount(async () => {
  await storeRooms.getRoomsApi();
  const data: unknown = await useAPI(
    paths.privateZonesOrder,
    {
      body: roomIds,
      method: 'PATCH',
      immediate: false,
      watch: false,
    },
  );

  orderRooms.value = data as APIData<RoomItem[]>;
});
</script>

<template>
  <SharedUIPanel :is-update="storeRooms.apiRooms?.pending">
    <SharedUIBreadcrumb title="pages.rooms">
      <DialogsRoomCreateDialog />
    </SharedUIBreadcrumb>
    <div v-if="storeRooms.apiRooms?.data">
      <VueDraggableNext
        v-model="storeRooms.apiRooms.data.response"
        :animation="300"
        handle=".handle-list"
      >
        <div
          v-for="place in storeRooms.apiRooms.data.response"
          :key="place.id"
        >
          <Accordion
            v-if="place.is_group"
            class="tw-mb-2"
            collapse-icon="none"
            expand-icon="none"
            multiple
            :value="[]"
          >
            <AccordionPanel :value="place.id">
              <AccordionHeader>
                <div class="header__arrow">
                  <IconChevronUp
                    class="header__arrow-up tw-w-6"
                    stroke="{2}"
                  />
                  <IconChevronDown
                    class="header__arrow-down tw-w-6"
                    stroke="{2}"
                  />
                </div>
                <div
                  class="header-list tw-flex tw-w-full tw-justify-between"
                  @click.stop="openRightBar(place)"
                  @keydown.stop="openRightBar(place)"
                >
                  <div class=" tw-flex tw-items-center">
                    <div
                      class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full"
                      :style="{ backgroundColor: roomColor(place.style) }"
                    />
                    <p class=" tw-text-lg tw-font-normal tw-text-black">
                      {{ place.name }}
                    </p>
                  </div>
                  <IconGripVertical class="handle-list tw-w-5 tw-text-black" />
                </div>
              </AccordionHeader>
              <AccordionContent>
                <VueDraggableNext
                  v-model="place.rooms_in_group"
                  :animation="300"
                  handle=".handle-item"
                >
                  <div
                    v-for="room in place.rooms_in_group"
                    :key="room.id"
                    class="room-item tw-flex tw-items-center tw-rounded-md tw-py-4 tw-pl-6 tw-text-lg"
                    @click="openRightBar(room)"
                    @keydown="openRightBar(room)"
                  >
                    <div class="tw-flex tw-w-full tw-justify-between">
                      <div class="tw-flex tw-items-center">
                        <div
                          class="tw-mx-2 tw-h-4 tw-w-4 tw-rounded-full"
                          :style="{ backgroundColor: roomColor(room.style) }"
                        />
                        <p class="tw-text-lg tw-font-normal tw-text-black">
                          {{ room.name }}
                        </p>
                      </div>
                      <IconGripVertical class="handle-item tw-w-5" />
                    </div>
                  </div>
                </VueDraggableNext>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <div
            v-else
            class="room-item tw-mb-2 tw-flex tw-items-center tw-rounded-md tw-py-4 !tw-pl-9 tw-text-lg"
            @click="openRightBar(place)"
            @keydown="openRightBar(place)"
          >
            <div
              class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full"
              :style="{ backgroundColor: roomColor(place.style) } "
            />
            <div class="tw-flex tw-w-full tw-justify-between">
              <p class=" tw-text-lg tw-font-normal tw-text-black">
                {{ place.name }}
              </p>
              <IconGripVertical class="handle-list tw-w-5" />
            </div>
          </div>
        </div>
      </VueDraggableNext>
    </div>

    <template #rightbar>
      <RightBarRoom
        v-model:form="form"
        v-model:is-show="isUpdateRightBar"
        v-model:is-update="isLoading"
      />
    </template>
  </SharedUIPanel>
</template>

<style lang="scss">
.room-item {
  border: 1px solid #E0ECE9 !important;
  padding: 12px 18px;
  cursor: pointer;
  transition: background-color .15s linear;
  &:hover {
    background-color: rgb(var(--v-theme-lightprimary)) !important;
  }
}

.p-accordioncontent-content .room-item {
  padding: 12px 18px !important;
  cursor: pointer;
  background-color: #F3F6F5 !important;
  &:not(:last-child):not(:first-child) {
    border-radius: 0 !important;
    border-top: none !important;
    border-bottom: 1px solid #E0ECE9 !important;
  }
  &:last-child {
    border-top: none !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
  &:first-child {
    border-bottom: 1px solid #E0ECE9 !important;
    border-top: none !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  &:hover {
    background-color: rgb(var(--v-theme-lightprimary)) !important;
  }
}

.p-accordionpanel-active .p-accordionheader {
  background-color: #F3F6F5 !important;
}

.p-accordionheader {
  border-bottom-left-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
  border: 1px solid #E0ECE9 !important;
  padding: 0 !important;

  &:hover {
    background-color: rgb(var(--v-theme-lightprimary)) !important;
  }
}

.header-list {
  padding: 12px 18px;
  padding-left: 0;
}

.header__arrow {
  padding: 12px 8px;
  padding-right: 0;
  margin-right: 4px;
}

.header__arrow-up {
  display: none;
}

.p-accordionpanel-active .header__arrow-up {
  display: block;
}

.p-accordionpanel-active .header__arrow-down {
  display: none;
}

.p-accordionpanel {
  border: none !important;
}

.p-accordioncontent-content {
  padding: 0 !important;
}
</style>

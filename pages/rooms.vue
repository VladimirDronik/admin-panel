<script setup lang="ts">
// Builtin modules
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { VueDraggableNext } from 'vue-draggable-next';
import { IconGripVertical, IconChevronDown, IconChevronUp } from '@tabler/icons-vue';
// Helpers modules
import { roomColor } from '~/helpers/rooms';
// Types modules
import type { RoomItem } from '~/stores/rooms/roomsTypes';
import type { Request } from '~/types/StoreTypes';

definePageMeta({
  middleware: ['auth'],
});

const { t } = useI18n();
useHead({
  titleTemplate: computed(() => t('pages.rooms')),
});

const {
  form,
  isUpdateRightBar,
  openRightBar,
} = useRightbar();

const {
  roomIds,
  dataRooms,
  statusRooms,
  refreshRooms,
} = await useWorkWithRoomApi();

const {
  execute: executeOrder,
} = await useAPI(
  paths.privateZonesOrder,
  {
    body: roomIds,
    method: 'PATCH',
    immediate: false,
    watch: false,
  },
);

function useRightbar() {
  const form = ref<RoomItem | null>();
  const isUpdateRightBar = ref(false);

  const openRightBar = (item: RoomItem) => {
    isUpdateRightBar.value = true;
    form.value = item;
  };

  return {
    form,
    isUpdateRightBar,
    openRightBar,
  };
}

async function useWorkWithRoomApi() {
  const {
    data: dataRooms,
    status: statusRooms,
    refresh: refreshRooms,
  } = await useAPI<Request<RoomItem[]>>(
    paths.privateRoomsList,
    { watch: false },
    roomRequestSchema,
  );

  const roomIds = computed(() => dataRooms?.value?.response.map((item: any) => item.id));

  watch(roomIds, (newValue: any, oldValue: any) => {
    if (oldValue && !_.isEqual(newValue, oldValue)) executeOrder();
  });

  return {
    roomIds,
    dataRooms,
    statusRooms,
    refreshRooms,
  };
}
</script>

<template>
  <SharedUIPanel :is-update="statusRooms === 'pending'">
    <SharedUIBreadcrumb title="pages.rooms">
      <RoomDialogCreate @update="refreshRooms" />
    </SharedUIBreadcrumb>
    <div v-if="dataRooms">
      <VueDraggableNext
        v-model="dataRooms.response"
        :animation="300"
        handle=".handle-list"
      >
        <div
          v-for="place in dataRooms.response"
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
                      class="tw-mr-2 tw-size-4 tw-rounded-full"
                      :style="{ backgroundColor: roomColor(place.style) }"
                    />
                    <p class="text-base tw-text-lg tw-font-normal tw-text-black">
                      {{ place.name }}
                    </p>
                  </div>
                  <IconGripVertical class="text-base handle-list tw-w-5 tw-text-black" />
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
                    class="room-item tw-flex tw-items-center tw-rounded-md tw-py-4 !tw-pl-[26px] tw-text-lg"
                    @click="openRightBar(room)"
                    @keydown="openRightBar(room)"
                  >
                    <div class="tw-flex tw-w-full tw-justify-between">
                      <div class="tw-flex tw-items-center">
                        <div
                          class="tw-mx-2 tw-size-4 tw-rounded-full"
                          :style="{ backgroundColor: roomColor(room.style) }"
                        />
                        <p class="text-base tw-text-lg tw-font-normal">
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
              class="tw-mr-2 tw-size-4 tw-rounded-full"
              :style="{ backgroundColor: roomColor(place.style) } "
            />
            <div class="tw-flex tw-w-full tw-justify-between">
              <p class="text-base tw-text-lg tw-font-normal tw-text-black">
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
        @update="refreshRooms"
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

.p-dark .p-accordionheader {
  border: 1px solid var(--p-surface-600) !important;
  background: var(--p-surface-900) !important;
}
.p-dark .room-item {
  background: var(--p-surface-900) !important;
  border: 1px solid var(--p-surface-600) !important;
}

.p-dark .p-accordioncontent-content .room-item {
  &:not(:last-child):not(:first-child) {
    border-radius: 0 !important;
    border-top: none !important;
    border-bottom: 1px solid var(--p-surface-600) !important;
  }
  &:last-child {
    border-top: none !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
  &:first-child {
    border-bottom: 1px solid var(--p-surface-600) !important;
    border-top: none !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
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

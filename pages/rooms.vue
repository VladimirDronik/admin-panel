<script setup lang="ts">
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { VueDraggableNext } from 'vue-draggable-next';
import { IconGripVertical, IconChevronDown, IconChevronUp } from '@tabler/icons-vue';
// Helpers
import { roomColor } from '~/helpers/rooms';
// Types
import type { Room } from '~/types/RoomsTypes';

// Composables
const { t } = useI18n();
const storeRooms = useRoomsStore();

// Declare Options
definePageMeta({
  middleware: ['auth'],
});

useHead({
  titleTemplate: computed(() => t('pages.rooms')),
});

// Variables
const data = ref(storeRooms.list);

const isUpdate = ref(false);
const isLoading = ref(false);

const form = ref<Room | null>();
const isUpdateRightBar = ref(false);

// methods
const openRightBar = (item: Room) => {
  isUpdateRightBar.value = true;
  form.value = item;
};

const roomIds = (list: Room[]) => list.map((item) => {
  if (item.is_group) {
    // return {
    //   id: item.id,
    //   rooms_in_group: roomIds(item.rooms_in_group)
    // }
  }
  return item.id;
});

const save = _.debounce(async () => {
  if (!_.isEqual(storeRooms.list, data.value)) {
    isLoading.value = true;
    const dataId = roomIds(data.value);
    await storeRooms.changeRooms(dataId);
    isLoading.value = false;
  }
}, 1000);

const created = async () => {
  isUpdate.value = true;
  await storeRooms.getRoomsApi();
  isUpdate.value = false;
};

// Watchers
watch(data, save);

watchEffect(() => {
  data.value = storeRooms.list;
});

created();
</script>

<template>
  <BasePanel>
    <BaseBreadcrumb title="pages.rooms" :total="storeRooms.total">
      <DialogsRoomCreateDialog />
    </BaseBreadcrumb>
    <VueDraggableNext v-model="data" handle=".handle-list" :animation="300">
      <div v-for="place in data" :key="place.id">
        <Accordion v-if="place.is_group" expandIcon="none" collapseIcon="none" :value="[]" multiple class="tw-mb-2">
          <AccordionPanel :value="place.id">
            <AccordionHeader>
              <div class="header__arrow">
                <IconChevronUp stroke={2} class="header__arrow-up tw-w-6" />
                <IconChevronDown stroke={2} class="header__arrow-down tw-w-6" />
              </div>
              <div
                @click.stop="openRightBar(place)"
                @keydown.stop="openRightBar(place)"
                class="header-list tw-flex tw-w-full tw-justify-between"
              >
                <div class=" tw-flex tw-items-center">
                  <div :style="{ backgroundColor: roomColor(place.style) }" class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full" />
                  <p class=" tw-text-lg tw-font-normal tw-text-black">
                    {{ place.name }}
                  </p>
                </div>
                <IconGripVertical class="handle-list tw-w-5 tw-text-black" />
              </div>
            </AccordionHeader>
            <AccordionContent>
              <VueDraggableNext v-model="place.rooms_in_group" handle=".handle-item" :animation="300">
                <div
                  @click="openRightBar(room)"
                  @keydown="openRightBar(room)"
                  v-for="room in place.rooms_in_group"
                  :key="room.id"
                  class="room-item tw-flex tw-items-center tw-rounded-md tw-py-4 tw-pl-6 tw-text-lg"
                >
                  <div class="tw-flex tw-w-full tw-justify-between">
                    <div class="tw-flex tw-items-center">
                      <div :style="{ backgroundColor: roomColor(room.style) }" class="tw-mx-2 tw-h-4 tw-w-4 tw-rounded-full" />
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
          @click="openRightBar(place)"
          @keydown="openRightBar(place)"
          class="room-item tw-mb-2 tw-flex tw-items-center tw-rounded-md tw-py-4 !tw-pl-9 tw-text-lg"
        >
          <div
            :style="{ backgroundColor: roomColor(place.style) } "
            class="tw-mr-2 tw-h-4 tw-w-4 tw-rounded-full"
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
    <RightSidebarRoom
      v-model:is-update="isLoading"
      v-model:form="form"
      v-model:is-show="isUpdateRightBar"
    />
  </BasePanel>
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

import { defineStore } from 'pinia';
// Static Data
import { paths } from '~/staticData/endpoints';
// Helpers
import { filterInListRoom } from '~/helpers/rooms';
// Types
import type { APIData } from '~/types/StoreTypes';
import { roomRequestSchema, type RoomItem } from './roomsTypes';

export const useRoomsStore = defineStore('Rooms', () => {
  // Variables
  const apiRooms = ref<APIData<RoomItem[]> | null>();

  // Computed
  const getRoomsSelect = computed(() => filterInListRoom(apiRooms.value?.data?.response ?? []));

  // Methods
  const getRoomsApi = async (params = {}) => {
    if (apiRooms.value) {
      apiRooms.value.refresh();
    } else {
      const data: unknown = await useAPI(
        paths.privateRoomsList,
        {
          params,
        },
        roomRequestSchema,
      );

      apiRooms.value = data as APIData<RoomItem[]>;
    }
  };

  return {
    apiRooms,
    getRoomsApi,
    getRoomsSelect,
  };
});

import { defineStore } from 'pinia';
// Static Data
import { paths } from '~/staticData/endpoints';
// Helpers
import { filterInListRoom } from '~/helpers/rooms';
// Types
import type { APIDataResponse } from '~/types/StoreTypes';
import { roomRequestSchema, type RoomItem } from './roomsTypes';

export const useRoomsStore = defineStore('Rooms', () => {
  // Variables
  const rooms = ref<APIDataResponse<RoomItem[]> | null>();

  // Computed
  const getRoomsSelect = computed(() => filterInListRoom(rooms.value?.data?.response ?? []));

  // Methods
  const getRoomsApi = async (params = {}) => {
    if (rooms.value) {
      rooms.value.refresh();
    } else {
      const data: unknown = await useAPI(
        paths.privateRoomsList,
        {
          params,
        },
        roomRequestSchema,
      );

      rooms.value = data as APIDataResponse<RoomItem[]>;
    }
  };

  return {
    rooms,
    getRoomsApi,
    getRoomsSelect,
  };
});

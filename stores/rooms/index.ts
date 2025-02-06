import { defineStore } from 'pinia';
// Helpers
import { filterInListRoom } from '~/helpers/rooms';
// Types
import type { APIData } from '~/types/StoreTypes';
import { roomRequestSchema, type RoomItem, type SelectRoom } from './roomsTypes';

export const useRoomsStore = defineStore('Rooms', () => {
  // Variables
  const apiRooms = ref<APIData<RoomItem[]> | null>();

  // Computed
  const getRoomsSelect = computed<SelectRoom[]>(() => filterInListRoom(apiRooms.value?.data?.response ?? []));
  const getGroupRooms = computed<RoomItem[]>(() => apiRooms.value?.data?.response.filter((room) => room.is_group) ?? []);
  const getRooms = computed<RoomItem[]>(() => apiRooms.value?.data?.response ?? []);

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
    getRooms,
    apiRooms,
    getRoomsApi,
    getRoomsSelect,
    getGroupRooms,
  };
});

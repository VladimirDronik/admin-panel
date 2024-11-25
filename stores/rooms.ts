import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/Api';
import { useUserStore } from '~/stores/user';
// Helpers
import { filterInListRoom } from '~/helpers/rooms';
// Types
import type { Room, RequestData } from '~/types/RoomsTypes';
import type { Devices } from '~/types/DevicesTypes';

export const useRoomsStore = defineStore('Rooms', () => {
  // Composables
  const { api } = useApiInstant();
  const storeUser = useUserStore();

  // Variables
  const list = ref<Room[]>([]);
  const total = ref<number>(0);
  const item = ref<Devices | null>(null);

  // Computed
  const getRoomsSelect = computed(() => filterInListRoom(list.value));

  // Methods
  const getRoomsApi = async (params = {}) => {
    const data: RequestData = await api.get('http://10.35.16.1:8081/private/rooms-list-all', {
      params,
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    list.value = data.data.response;
    total.value = data.data.response.length;
    return data;
  };

  const changeRooms = async (params = {}) => {
    const data: RequestData = await api.patch(
      'http://10.35.16.1:8081/private/zones/order',
      params,
      {
        headers: {
          'api-key': 'c041d36e381a835afce48c91686370c8',
          token: storeUser.userLocal?.token,
        },
      },
    );

    await getRoomsApi();
    return data;
  };
  const changeRoomApi = async (params = {}) => {
    const data: RequestData = await api.patch('http://10.35.16.1:8081/private/rooms-list-all', {
      data: params,
      headers: {
        'api-key': 'c041d36e381a835afce48c91686370c8',
        token: storeUser.userLocal?.token,
      },
    });

    await getRoomsApi();
    return data;
  };

  return {
    list,
    total,
    item,
    changeRooms,
    getRoomsApi,
    changeRoomApi,
    getRoomsSelect,
  };
});

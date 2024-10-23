import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/api/apiInstant';
// Helpers
import { filterInListRoom } from '~/helpers/rooms';
// Types
import type { Room, RequestData } from '~/types/RoomsTypes';
import type { Devices } from '~/types/DevicesTypes';

export const useRoomsStore = defineStore('Rooms', () => {
  const storeAuth = useAuthStore();
  const { api } = useApiInstant();

  const list = ref<Room[]>([]);
  const total = ref<number>(0);
  const item = ref<Devices | null>(null);

  const getRoomsSelect = computed(() => filterInListRoom(list.value));

  const getRoomsApi = async (params = {}) => {
    const data: RequestData = await api.get('http://10.35.16.1:8081/private/rooms-list-all', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    list.value = data.data.response;
    total.value = data.data.response.length;
    return data;
  };

  const changeRooms = async (params = {}) => {
    const data: RequestData = await api.patch(
      'http://10.35.16.1:8081/private/rooms-list-all',
      params,
      {
        headers: {
          'api-key': 'c041d36e381a835afce48c91686370c8',
          token: storeAuth.token,
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
        token: storeAuth.token,
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

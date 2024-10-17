import { method } from 'lodash';
import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/api/apiInstant';
// import api from '~/utils/api';

interface Devices {
  id: number,
  type: number,
  protocol: number,
  state: number,
  name: number,
  address: number,
  module: number,
  category: string,
  zone_id: number
  status: string
  children?: Devices[]
  props?: {
    code: string,
    data_type: string,
    editable: number,
    name: string,
    required: true,
    value: string,
    values: string[]
    visible: number,
  }[]
}

interface Room {
  id: number
  is_group: boolean
  rooms_in_group?: Room[]
  sort: number
  style: string
  name: string
}

interface RequestData {
  response: Room[]
}

export const useRoomsStore = defineStore('Rooms', () => {
  const storeAuth = useAuthStore();
  const { api } = useApiInstant();

  const list = ref<Room[]>([]);
  const total = ref<number>(0);
  const item = ref<Devices | null>(null);

  const getRoomsApi = async (params = {}) => {
    const data: RequestData = await api('http://10.35.16.1:8081/private/rooms-list-all', {
      params,
      headers: {
        token: storeAuth.token,
      },
    });

    list.value = data.response;
    total.value = data.response.length;
    return data;
  };

  const changeRooms = async (params = {}) => {
    const data: RequestData = await api('http://10.35.16.1:8081/private/rooms-list-all', {
      method: 'PATCH',
      body: params,
      // params: {
      //   list: params,
      //   total: total.value,
      // },
      headers: {
        // 'api-key': 'c041d36e381a835afce48c91686370c8',
        token: storeAuth.token,
      },
    });

    await getRoomsApi();
    return data;
  };
  const changeRoomApi = async (params = {}) => {
    const data: RequestData = await api('http://10.35.16.1:8081/private/rooms-list-all', {
      method: 'PATCH',
      body: params,
      headers: {
        // 'api-key': 'c041d36e381a835afce48c91686370c8',
        token: storeAuth.token,
      },
    });

    await getRoomsApi();
    return data;
  };

  const findRoom = (list: Room[], id: number) => {
    let result = list.find((item) => item.id === id);
    if (result) return result;
    list.forEach((item) => {
      if (item.rooms_in_group) {
        const resultGroups = findRoom(item.rooms_in_group, id);
        if (resultGroups) {
          result = resultGroups;
        }
      }
    });
    if (result) return result;
  };

  return {
    list,
    total,
    item,
    findRoom,
    changeRooms,
    changeRoomApi,
    getRoomsApi,
  };
});

import { defineStore } from 'pinia';
import api from '~/utils/api';

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
  data: {
    response: Room[]
  }
}

export const useRoomsStore = defineStore('Rooms', () => {
  const list = ref<Room[]>([]);
  const total = ref<number>(0);
  const item = ref<Devices | null>(null);

  const storeAuth = useAuthStore();

  const getRoomsApi = async (params = {}) => {
    const { data }: RequestData = await api.get('http://10.35.16.1:8091/private/rooms-list-all', {
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
    const { data }: RequestData = await api.put('http://178.57.106.190:18091/private/rooms-list-all', {
      params,
      headers: {
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
    getRoomsApi,
  };
});

import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/api/apiInstant';

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
  rooms_in_group: Room[]
  sort: number
  style: string
  name: string
}

interface RequestData {
  data: {
    response: Room[]
  }
}

function filterRoom(rooms: Room[] | undefined): any {
  if (!rooms) return [];
  const result: any[] = [];
  rooms.forEach((item) => {
    if (item.rooms_in_group?.length) {
      result.push({
        title: item.name,
        props: {
          value: item.id,
        },
      });
      // result = result.concat(item.rooms_in_group.map((item) => ({
      //   title: item.name,
      //   props: {
      //     value: item.id,
      //   },
      // })));
    } else {
      result.push({
        title: item.name,
        props: {
          value: item.id,
        },
      });
    }
  });
  return result;
}

function findRoom(list: Room[], id: number) {
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
}

export const useRoomsStore = defineStore('Rooms', () => {
  const storeAuth = useAuthStore();
  const { api } = useApiInstant();

  const list = ref<Room[]>([]);
  const total = ref<number>(0);
  const item = ref<Devices | null>(null);

  const getRoomsSelect = computed(() => filterRoom(list.value));

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
    findRoom,
    changeRooms,
    getRoomsApi,
    changeRoomApi,
    getRoomsSelect,
  };
});

import { defineStore } from 'pinia';
import api from '~/utils/api';

const storeAuth = useAuthStore();

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

interface State {
  list: Room[],
  item: Devices | null,
  total: number,
}

export const useRoomsStore = defineStore({
  id: 'Rooms',
  state: (): State => ({
    list: [],
    total: 0,
    item: null,
  }),
  actions: {
    async getRoomsApi(params = {}) {
      const { data }: RequestData = await api.get('http://10.35.16.1:8091/private/rooms-list-all', {
        params,
        headers: {
          token: storeAuth.token,
        },
      });
      console.log(data);
      this.list = data.response;
      this.total = data.response.length;
      return data;
    },
  },
});

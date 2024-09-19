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

interface RequestData {
  data: {
    data: {
      list: Devices[]
      total: number
    }
  }
}

interface State {
  list: Devices[],
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
      });

      this.list = data.data.list;
      this.total = data.data.total;
      return data;
    },
  },
});

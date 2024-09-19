import axios from 'axios';
import { defineStore } from 'pinia';
import { Title } from '#build/components';
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
  types: any | null,
}

function filterDevices(devices: Devices[], level: number, key: string): any {
  return devices.map((item, index) => {
    if (item.children) {
      return {
        key: level === 0 ? String(index) : `${key}-${index}}`,
        data: {
          id: item.id,
          category: item.category,
          name: item.name,
          type: item.type,
          address: item?.zone_id ?? '-',
          status: item?.status ?? '-',
        },
        children: filterDevices(item.children, level + 1, level === 0 ? String(index) : `0${`-${index}`.repeat(level)}`),
      };
    }
    return {
      key: level === 0 ? String(index) : `${key}-${index}`,
      data: {
        id: item.id,
        category: item.category,
        name: item.name,
        type: item.type,
        address: item?.zone_id ?? '-',
        status: item?.status ?? '-',
      },
    };
  });
}

export const useDevicesStore = defineStore({
  id: 'Controllers',
  state: (): State => ({
    list: [],
    total: 0,
    item: null,
    types: null,
  }),
  getters: {
    getDevices(): any {
      return filterDevices(this.list, 0, '');
    },
  },
  actions: {
    async getDevicesApi(params = {}) {
      const { data }: { data: any} = await axios.get('http://10.35.16.1:8088/objects', {
        params,
      });

      this.list = data.data.list;
      this.total = data.data.total;
      return data;
    },

    async getTypesApi(params = {}) {
      const { data }: RequestData = await axios.get('http://10.35.16.1:8088/objects/types', {
        params,
      });

      this.types = data.data;
      return data;
    },

    async getControllerDetailsApi(id: number) {
      const { data }: { data: {data: Devices}} = await axios.get(`http://10.35.16.1:8088/objects/${id}`);

      this.item = data.data;
      return data;
    },

    async logoutApi() {
      const { data } = await api.post('api/public/user/logout');
      return data;
    },
  },
});

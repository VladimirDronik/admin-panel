import axios from 'axios';
import { defineStore } from 'pinia';
import api from '~/utils/api';

interface Controllers {
  id: number,
  type: number,
  protocol: number,
  state: number,
  name: number,
  address: number,
  module: number,
  category: string,
  props: {
    address: {
      value: boolean
    },
    status: {
      value: boolean
    },
  },
  children?: Controllers[]
}

interface RequestData {
  data: {
    data: {
      list: Controllers[]
      total: number
    }
  }
}

interface State {
  list: Controllers[],
  total: number,
}

function filterControllers(controllers: Controllers[], level: number, key: string): any {
  return controllers.map((item, index) => {
    if (item.children) {
      return {
        key: level === 0 ? String(index) : `${key}-${index}}`,
        data: {
          id: item.id,
          category: item.category,
          name: item.name,
          type: item.type,
          address: item.props?.address?.value ?? '-',
          status: item.props?.status?.value ?? '-',
        },
        children: filterControllers(item.children, level + 1, level === 0 ? String(index) : `0${`-${index}`.repeat(level)}`),
      };
    }
    return {
      key: level === 0 ? String(index) : `${key}-${index}`,
      data: {
        id: item.id,
        category: item.category,
        name: item.name,
        type: item.type,
        address: item.props?.address?.value ?? '-',
        status: item.props?.status?.value ?? '-',
      },
    };
  });
}

export const useControllersStore = defineStore({
  id: 'Controllers',
  state: (): State => ({
    list: [],
    total: 0,
  }),
  getters: {
    getControllers(): any {
      return filterControllers(this.list, 0);
    },
  },
  actions: {
    async getControllersApi(params = {}) {
      const { data }: RequestData = await axios.get('http://10.35.16.1:8088/objects?limit=20&offset=0', {
        params,
      });

      this.list = data.data.list;
      this.total = data.data.total;
      return data;
    },

    async logoutApi() {
      const { data } = await api.post('api/public/user/logout');
      return data;
    },
  },
});

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
}

interface RequestData {
  data: Controllers
}

interface State {
  list: Controllers[],
  total: number,
}

export const useControllersStore = defineStore({
  id: 'Controllers',
  state: (): State => ({
    list: [],
    total: 0,
  }),
  actions: {
    async getControllersApi(params = {}) {
      const { data }: RequestData = await api.get('controllers-list', {
        params,
      });
      return data;
    },

    async logoutApi() {
      const { data } = await api.post('api/public/user/logout');
      return data;
    },
  },
});

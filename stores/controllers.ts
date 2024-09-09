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
      const { data }: RequestData = await axios.get('http://10.35.16.1:8088/objects/controllers?offset=0&limit=20', {
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

import { defineStore } from 'pinia';
import api from '~/utils/api';

export const useAuthStore = defineStore({
  id: 'auth',
  actions: {
    async loginApi(params = {}) {
      const { data } = await api.get('token', {
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

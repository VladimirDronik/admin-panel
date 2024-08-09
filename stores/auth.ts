import { defineStore } from 'pinia';
import api from '@/api';

export const useAuthStore = defineStore({
  id: 'auth',
  actions: {
    async loginApi(params = {}) {
      const { data } = await api.post('auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return data;
    },

    async logoutApi() {
      const { data } = await api.post('api/public/user/logout');
      return data;
    },
  },
});

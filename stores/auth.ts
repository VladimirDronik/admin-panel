import { defineStore } from 'pinia';
import api from '~/utils/api';

interface State {
  user: null | object
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): State => ({
    user: null,
  }),
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

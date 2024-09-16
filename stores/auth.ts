import { defineStore } from 'pinia';
import api from '~/utils/api';

interface State {
  user: null | object,
  isActiveRightSidebar: boolean,
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): State => ({
    user: null,
    isActiveRightSidebar: false,
  }),
  actions: {
    async loginApi(params = {}) {
      const { data } = await api.get(
        'token',
        {
          params,
          headers: {
            'api-key': 'c041d36e381a835afce48c91686370c8',
          },
        },
      );
      return data;
    },

    async logoutApi() {
      const { data } = await api.post('api/public/user/logout');
      return data;
    },
  },
});

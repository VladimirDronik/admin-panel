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
        'http://10.35.16.1:8091/token',
        {
          params,
          headers: {
            'api-key': 'c041d36e381a835afce48c91686370c8',
          },
        },
      );
      localStorage.setItem('token', data.response.api_access_token);
      this.user = data;
      return data;
    },

    async logoutApi() {
      const { data } = await api.post('api/public/user/logout');
      return data;
    },
  },
});

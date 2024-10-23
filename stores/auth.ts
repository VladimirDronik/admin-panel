import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/api/apiInstant';

interface State {
  user: null | object,
  token: string | null,
  isActiveRightSidebar: boolean,
}

interface Request {
  data: {
    response: {
      api_access_token: string;
    };
  }
}

export const useAuthStore = defineStore('Auth', () => {
  const { api } = useApiInstant();

  const user = ref();
  const token = ref(localStorage.getItem('token') ?? null);
  const isActiveRightSidebar = ref(false);

  const loginApi = async (params = {}) => {
    const { data }: Request = await api.get(
      'http://178.57.106.190:18081/token',
      {
        params,
        headers: {
          'api-key': 'c041d36e381a835afce48c91686370c8',
        },
      },
    );
    localStorage.setItem('token', data.response.api_access_token);
    token.value = data.response.api_access_token;
    user.value = data;
    return data;
  };

  // const logoutApi = async () => {
  //   const { data } = await api.post('api/public/user/logout');
  //   return data;
  // }

  return {
    user,
    token,
    isActiveRightSidebar,
    loginApi,
  };
});

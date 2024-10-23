import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/api/apiInstant';
// Types
import type { Request } from '~/types/AuthTypes';

export const useAuthStore = defineStore('Auth', () => {
  // Composables
  const { api } = useApiInstant();
  const router = useRouter();

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

  const logoutApi = async () => {
    router.push({ name: 'auth-Login' });
    // const { data } = await api.post('api/public/user/logout');
    // return data;
  };

  return {
    user,
    token,
    isActiveRightSidebar,
    loginApi,
    logoutApi,
  };
});

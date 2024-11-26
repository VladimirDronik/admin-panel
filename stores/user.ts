import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/Api';
// Static Data
import { auth } from '~/staticData/endpoints';
// Types
import type { Request } from '~/types/AuthTypes';

interface LocalData {
  token: string | null;
  openSidebar: boolean;
  language: string;
}

const localStorageName = 'touchOn';

export const useUserStore = defineStore('User', () => {
  // Composables
  const { api } = useApiInstant();
  const router = useRouter();

  // Variables
  const user = ref();
  const userLocal = ref<LocalData>();

  const localStorageData = localStorage.getItem(localStorageName);
  const localData = (localStorageData ? JSON.parse(localStorageData) : null) as LocalData | null;
  if (localData) userLocal.value = localData;

  // Methods
  const loginApi = async (params = {}) => {
    const { data }: Request = await api.get(
      auth,
      {
        params,
        headers: {
          'api-key': 'c041d36e381a835afce48c91686370c8',
        },
      },
    );

    if (localData) {
      localStorage.setItem(localStorageName, JSON.stringify({
        ...localData,
        token: data.response.api_access_token,
      }));
      userLocal.value = {
        ...localData,
        token: data.response.api_access_token,
      };
    } else {
      localStorage.setItem(localStorageName, JSON.stringify({
        token: data.response.api_access_token,
        openSidebar: true,
        language: 'ru',
      }));
      userLocal.value = {
        token: data.response.api_access_token,
        openSidebar: true,
        language: 'ru',
      };
    }
    user.value = data;
    return data;
  };

  const changeSideBar = (value: boolean) => {
    localStorage.setItem(localStorageName, JSON.stringify({
      ...userLocal.value,
      openSidebar: value,
    }));
    if (userLocal.value) {
      userLocal.value = {
        ...userLocal.value,
        openSidebar: value,
      };
    }
  };
  const changeLanguage = (value: string) => {
    localStorage.setItem(localStorageName, JSON.stringify({
      ...userLocal.value,
      language: value,
    }));
    if (userLocal.value) {
      userLocal.value = {
        ...userLocal.value,
        language: value,
      };
    }
  };

  const logoutApi = async () => {
    router.push({ name: 'auth-login' });
    // const { data } = await api.post('api/public/user/logout');
    // return data;
  };

  return {
    user,
    userLocal,
    loginApi,
    logoutApi,
    changeSideBar,
    changeLanguage,
  };
});

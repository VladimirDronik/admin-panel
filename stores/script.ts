import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/Api';
import { useUserStore } from '~/stores/user';
// Types
import type {
  Script, RequestScript,
} from '~/types/DevicesTypes';

export const useScriptStore = defineStore('ScriptStore', () => {
  // Composables
  const { api } = useApiInstant();
  const storeUser = useUserStore();

  const list = ref<Script[]>([]);
  const total = ref<number>(0);

  const getScriptsApi = async (params = {}) => {
    const { data }: { data: { data: RequestScript } } = await api.get('http://10.35.16.1:8082/scripts', {
      params,
      headers: {
        token: storeUser.userLocal?.token,
      },
    });

    list.value = data.data.list;
    total.value = data.data.total;
    return data;
  };

  return {
    list,
    total,
    getScriptsApi,
  };
});

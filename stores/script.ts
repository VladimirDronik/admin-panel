import { defineStore } from 'pinia';
import { useApiInstant } from '~/composables/api/instant';
// Types
import type {
  Script, RequestScript,
} from '~/types/DevicesTypes';

export const useScriptStore = defineStore('ScriptStore', () => {
  // Composables
  const storeAuth = useAuthStore();
  const { api } = useApiInstant();

  const list = ref<Script[]>([]);
  const total = ref<number>(0);

  const getScriptsApi = async (params = {}) => {
    const { data }: { data: { data: RequestScript } } = await api.get('http://10.35.16.1:8082/scripts', {
      params,
      headers: {
        token: storeAuth.token,
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

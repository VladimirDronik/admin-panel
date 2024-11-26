import { defineStore } from 'pinia';
import { useAPI } from '~/composables/NewApi';
import type { APIData } from '~/types/StoreTypes';
import { scriptRequestSchema, type ScriptData } from './scriptTypes';

export const useScriptStore = defineStore('ScriptStore', () => {
  const scripts = ref<APIData<ScriptData> | null>();

  const getScriptsApi = async (params = {}) => {
    const data: unknown = await useAPI(
      'http://10.35.16.1:8082/scripts',
      {
        params,
      },
      scriptRequestSchema,
    );

    scripts.value = data as APIData<ScriptData>;
  };

  return {
    scripts,
    getScriptsApi,
  };
});

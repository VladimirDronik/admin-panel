import { defineStore } from 'pinia';
// Composables modules
import { useAPI } from '~/composables/NewApi';
// Static Data modules
import { paths } from '~/utils/endpoints';
// Types and Schemes
import type { APIData } from '~/types/StoreTypes';
import { scriptRequestSchema, type ScriptData } from './scriptTypes';

export const useScriptStore = defineStore('ScriptStore', () => {
  const scripts = ref<APIData<ScriptData> | null>();

  const getScriptsApi = async (params = {}) => {
    if (scripts.value) {
      scripts.value.refresh();
    } else {
      const data: unknown = await useAPI(
        paths.scripts,
        {
          params,
        },
        scriptRequestSchema,
      );

      scripts.value = data as APIData<ScriptData>;
    }
  };

  return {
    scripts,
    getScriptsApi,
  };
});

import { defineStore } from 'pinia';
import type { LocalData } from './userTypes';

export const useUserStore = defineStore('User', () => {
  // Variables
  const userLocal = ref<LocalData>();

  const localStorageName = 'touchOn';

  const localStorageData = localStorage.getItem(localStorageName);
  const localData = (localStorageData ? JSON.parse(localStorageData) : null) as LocalData | null;

  if (localData) userLocal.value = localData;

  return {
    userLocal,
    localStorageName,
  };
});

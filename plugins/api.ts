import { useStorage } from '@vueuse/core';

export default defineNuxtPlugin(() => {
  const localState = useStorage('touch-on', {
    token: '',
    openSidebar: true,
    language: 'ru',
  });

  const router = useRouter();

  const api = $fetch.create({
    onRequest({ options }) {
      if (localState.value.token) options.headers.set('api-key', 'c041d36e381a835afce48c91686370c8');
      if (localState.value.token) options.headers.set('token', localState.value.token);
    },
    async onResponseError({ response, error }) {
      console.error('Ошибка', error);
      if (response.status === 401) router.push({ name: 'auth-login' });
      return Promise.reject(error);
    },
  });

  return {
    provide: {
      api,
    },
  };
});

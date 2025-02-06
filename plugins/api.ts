export default defineNuxtPlugin(() => {
  const storeUser = useUserStore();

  const router = useRouter();

  const api = $fetch.create({
    onRequest({ options }) {
      if (storeUser.localState.token) options.headers.set('api-key', 'c041d36e381a835afce48c91686370c8');
      if (storeUser.localState.token) options.headers.set('token', storeUser.localState.token);
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

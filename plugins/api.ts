export default defineNuxtPlugin((nuxtApp) => {
  const storeUser = useUserStore();

  const router = useRouter();

  const api = $fetch.create({
    onRequest({ request, options, error }) {
      if (storeUser.userLocal?.token) options.headers.set('api-key', 'c041d36e381a835afce48c91686370c8');
      if (storeUser.userLocal?.token) options.headers.set('token', storeUser.userLocal?.token);
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

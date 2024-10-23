import axios from 'axios';

export const useApiInstant = () => {
  const runtimeConfig = useRuntimeConfig();

  const router = useRouter();

  const api = axios.create({
    baseURL: runtimeConfig.public.backendApi,
    timeout: 10000,
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Ошибка', error);
      if (error.response.status === 401) router.push({ name: 'auth-Login' });
      return Promise.reject(error);
    },
  );

  return {
    api,
  };
};

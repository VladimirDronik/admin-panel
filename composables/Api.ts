// Builtin modules
import axios from 'axios';

export const useApiInstant = () => {
  // Composables
  const router = useRouter();

  // Config
  const api = axios.create({
    timeout: 100000,
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Ошибка', error);
      if (error.response.status === 401) router.push({ name: 'auth-login' });
      return Promise.reject(error);
    },
  );

  return {
    api,
  };
};

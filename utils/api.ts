import axios from 'axios';
import { globalRouter } from './router';

const runtimeConfig = useRuntimeConfig();

const route = useRoute();

const axiosInstance = axios.create({
  baseURL: runtimeConfig.public.backendApi,
  timeout: 20000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error, 'Ошибка');
    if (error.response.status === 401) {
      console.log(error.response.status, 'Ошибка');
      globalRouter.router?.push({ name: 'auth-Login' });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

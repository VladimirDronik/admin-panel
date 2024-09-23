import axios from 'axios';

const runtimeConfig = useRuntimeConfig();

const axiosInstance = axios.create({
  baseURL: runtimeConfig.public.backendApi,
  timeout: 20000,
});

export default axiosInstance;

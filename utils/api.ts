import axios from 'axios';
import * as https from 'https';

const runtimeConfig = useRuntimeConfig();

const axiosInstance = axios.create({
  baseURL: runtimeConfig.public.backendApi,
  timeout: 20000,
  headers: {
    'api-key': 'c041d36e381a835afce48c91686370c8',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTEiLCJuYW1lIjoicG9zdG1hbiIsImlhdCI6MTgxNjIzOTAyMn0.EV3V9kvAZgSO_-u1wzP4bQwv2TuryQyegP3dr-n2ESA',
  },
  // withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

export default axiosInstance;

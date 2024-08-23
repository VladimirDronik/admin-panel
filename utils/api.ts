import axios from 'axios';
import * as https from 'https';

const runtimeConfig = useRuntimeConfig();

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// https.globalAgent.options = {};
// https.globalAgent.options.rejectUnauthorized = false;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const axiosInstance = axios.create({
  baseURL: runtimeConfig.public.backendApi,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: agent,
});

export default axiosInstance;

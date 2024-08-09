import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_API,
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

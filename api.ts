import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://178.57.106.190:18091',
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

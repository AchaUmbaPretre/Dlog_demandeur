import axios from 'axios';
import config from './../config';
import {store} from '../redux/store';

const api = axios.create({
  baseURL: config.REACT_APP_SERVER_DOMAIN,
});

// Ajouter le token automatiquement
api.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

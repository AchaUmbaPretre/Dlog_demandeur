import axios from 'axios';
import config from '../config';

const { REACT_APP_SERVER_DOMAIN } = config;
const BASE_URL = `${REACT_APP_SERVER_DOMAIN}/api/client`;

export const getClient = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    throw error;
  }
};

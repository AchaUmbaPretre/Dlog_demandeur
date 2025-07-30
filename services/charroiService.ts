import axios, { AxiosResponse } from 'axios';
import config from '../config';

const { REACT_APP_SERVER_DOMAIN } = config;
const BASE_URL = `${REACT_APP_SERVER_DOMAIN}/api/charroi`;

/**
 * Requête générique GET
 */
const fetchData = async (endpoint: string): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(`${BASE_URL}/${endpoint}`);
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${endpoint} :`, error);
    throw error;
  }
};

export const getCatVehicule = () => fetchData('cat_vehicule');
export const getVehiculeDispo = () => fetchData('vehicule_dispo');
export const getChauffeur = () => fetchData('chauffeur');
export const getServiceDemandeur = () => fetchData('serviceDemadeur');
export const getMotif = () => fetchData('motif');
export const getDestination = () => fetchData('destination');

export const getBandeSortieUnique = async (id: number): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(`${BASE_URL}/bande_sortie_unique`, {
      params: { userId: id },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la bande sortie unique :", error);
    throw error;
  }
};

export const getDemandeVehiculeUserOne = async (id: number): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(`${BASE_URL}/demande_vehiculeUserOne`, {
      params: { userId: id },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes :", error);
    throw error;
  }
};


export const postValidationDemande = async (
  data: Record<string, any>
): Promise<AxiosResponse<any>> => {
  try {
    return await axios.post(`${BASE_URL}/validation_demande`, data);
  } catch (error) {
    console.error("Erreur lors de l'envoi de validation :", error);
    throw error;
  }
};


export const postDemandeVehicule = async (
  data: Record<string, any>
): Promise<AxiosResponse<any>> => {
  try {
    return await axios.post(`${BASE_URL}/demande_vehicule`, data);
  } catch (error) {
    console.error("Erreur lors de l'envoi de demande :", error);
    throw error;
  }
};
import axios from 'axios';
import { apiUrl } from '../config';
const token = localStorage.getItem('token');

export function petitionSubmit(payload) {
  return axios
    .post(`${apiUrl}common/petition`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(error);
      throw new Error('Error logging in');
    });
}

export function getPetition(payload) {
  return axios
    .post(`${apiUrl}common/petition-details`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(error);
      throw new Error('Error logging in');
    });
}

export function getCombinedDocx(payload) {
  return axios
    .post(`${apiUrl}common/complie-petition`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(error);
      throw new Error('Error logging in');
    });
}

export function getAllPetition(payload) {
  return axios
    .post(`${apiUrl}common/get-petitions`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(error);
      throw new Error('Error logging in');
    });
}

export function deletePetition(payload) {
  return axios
    .post(`${apiUrl}common/delete-petitions`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(error);
      throw new Error('Error logging in');
    });
}

export function getFinalDoc(payload) {
  return axios
    .post(`${apiUrl}common/get-final-doc`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(error);
      throw new Error('Error logging in');
    });
}

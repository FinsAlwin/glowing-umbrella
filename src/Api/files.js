import axios from 'axios';
import { apiUrl } from '../config';
const token = localStorage.getItem('token');

export function createFile(payload) {
  return axios
    .post(`${apiUrl}common/create-file`, payload, {
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

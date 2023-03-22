import axios from 'axios';
import { apiUrl } from '../config';

export function login(username, password) {
  return axios
    .post(`${apiUrl}user/signin`, {
      username: username,
      password: password,
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(error);
      throw new Error('Error logging in');
    });
}

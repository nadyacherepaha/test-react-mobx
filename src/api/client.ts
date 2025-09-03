import axios from 'axios';
import { API_BASE } from '../config';

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: false,
});

export function setAuthHeader(token: string | null) {
    if (token) {
        api.defaults.headers.common['Authorization'] = token;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

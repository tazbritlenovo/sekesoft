import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // ndrysho me IP VPS më vonë
});

export const login = (name, pin) => API.post('/auth/login', { name, pin });
export const getTables = (token) => API.get('/tables', { headers: { Authorization: `Bearer ${token}` } });
// ... mund të shtojmë më shumë më vonë

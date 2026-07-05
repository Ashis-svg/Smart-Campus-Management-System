import axios from 'axios';

const BASE = 'http://localhost:3000';

export const fetchMessData = (id) =>
  axios.get(`${BASE}/student/mess/${id}`);

export const postMessData = (id, payload) =>
  axios.post(`${BASE}/student/mess/${id}`, payload);
import axios from 'axios';

const BASE = 'https://smart-campus-management-system-oj0v.onrender.com';

export const fetchMessData = (id) =>
  axios.get(`${BASE}/student/mess/${id}`);

export const postMessData = (id, payload) =>
  axios.post(`${BASE}/student/mess/${id}`, payload);
import axios from 'axios';

const BASE = 'https://smart-campus-management-system-oj0v.onrender.com';

export const registerStudent = (payload) =>
  axios.post(`${BASE}/student/register`, payload);

export const registerAdmin = (payload) =>
  axios.post(`${BASE}/admin/register`, payload);
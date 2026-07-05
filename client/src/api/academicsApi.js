import axios from 'axios';

const BASE = 'https://smart-campus-management-system-oj0v.onrender.com';

export const fetchAcademicsData = (id) =>
  axios.get(`${BASE}/student/academics/${id}`);
import axios from 'axios';

const BASE = 'http://localhost:3000';

export const fetchAcademicsData = (id) =>
  axios.get(`${BASE}/student/academics/${id}`);
import axios from 'axios';

const API = 'https://smart-campus-management-system-oj0v.onrender.com';

export const getComplaints = (id) =>
  axios.get(`${API}/student/complaint/${id}`);

export const submitPersonalComplaint = (id, payload) =>
  axios.post(`${API}/student/complaint/${id}`, payload);

export const resolveComplaint = (id, c_id) =>
  axios.patch(`${API}/student/complaint/${id}/resolve/${c_id}`);

export const submitGeneralComplaint = (id, payload) =>
  axios.post(`${API}/student/complaint/${id}/general`, payload);

export const voteComplaint = (id, c_id, vote_type) =>
  axios.post(`${API}/student/complaint/${id}/vote`, { c_id, vote_type }); 
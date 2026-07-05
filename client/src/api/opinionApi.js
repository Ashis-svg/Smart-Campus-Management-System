import axios from 'axios';

const BASE = 'https://smart-campus-management-system-oj0v.onrender.com';

export const fetchOpinions = (userType, userId) =>
  axios.get(`${BASE}/opinion/${userType}/${userId}`);

export const postOpinion = (userType, userId, opinion_text) =>
  axios.post(`${BASE}/opinion/${userType}/${userId}`, { opinion_text });

export const editOpinion = (userType, userId, opinion_id, opinion_text) =>
  axios.patch(`${BASE}/opinion/${userType}/${userId}/${opinion_id}`, { opinion_text });

export const removeOpinion = (userType, userId, opinion_id) =>
  axios.delete(`${BASE}/opinion/${userType}/${userId}/${opinion_id}`);

export const voteOpinion = (userType, userId, opinion_id, vote_type) =>
  axios.post(`${BASE}/opinion/${userType}/${userId}/vote`, { opinion_id, vote_type });
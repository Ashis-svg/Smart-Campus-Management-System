import axios from 'axios';

const BASE = 'https://smart-campus-management-system-oj0v.onrender.com';

export const fetchAcademicsData = (adminId) =>
  axios.get(`${BASE}/admin/academics/${adminId}`);

export const cancelClass = (adminId, courseId, day) =>
  axios.patch(`${BASE}/admin/academics/${adminId}/class/${courseId}/cancel`, { day });

export const restoreClass = (adminId, courseId, day) =>
  axios.patch(`${BASE}/admin/academics/${adminId}/class/${courseId}/restore`, { day });

export const publishNotice = (adminId, notice) =>
  axios.post(`${BASE}/admin/academics/${adminId}/notice`, notice);

export const removeNotice = (adminId, noticeId) =>
  axios.delete(`${BASE}/admin/academics/${adminId}/notice/${noticeId}`);
import axios from 'axios';

const BASE = 'https://smart-campus-management-system-oj0v.onrender.com';

export const fetchHalls = () =>
  axios.get(`${BASE}/admin/mess/halls`);

export const fetchAdminMessData = (adminId, hallNo) =>
  axios.get(`${BASE}/admin/mess/${adminId}`, { params: { hall_no: hallNo } });

// notice is expected to already include hall_no (see useAdminMessData.publishNotice)
export const postNotice = (adminId, notice) =>
  axios.post(`${BASE}/admin/mess/${adminId}/notice`, notice);

export const removeNotice = (adminId, notice_id, hallNo) =>
  axios.delete(`${BASE}/admin/mess/${adminId}/notice/${notice_id}`, { params: { hall_no: hallNo } });

export const patchMenu = (adminId, menuData) =>
  axios.patch(`${BASE}/admin/mess/${adminId}/menu`, menuData);
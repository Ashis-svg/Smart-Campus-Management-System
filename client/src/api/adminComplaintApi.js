import axios from 'axios';

const BASE = 'http://localhost:3000';

export const fetchHalls = () =>
  axios.get(`${BASE}/admin/complaint/halls`);

export const fetchPersonalComplaints = (adminId, hallNo) =>
  axios.get(`${BASE}/admin/complaint/${adminId}`, { params: { hall_no: hallNo } });

export const resolvePersonalComplaint = (adminId, c_id, hallNo) =>
  axios.patch(`${BASE}/admin/complaint/${adminId}/resolve/${c_id}`, null, {
    params: { hall_no: hallNo },
  });

export const fetchGeneralComplaints = (adminId, hallNo, floor) =>
  axios.get(`${BASE}/admin/complaint/${adminId}/general`, {
    params: { hall_no: hallNo, floor },
  });

export const resolveGeneralComplaint = (adminId, c_id, hallNo) =>
  axios.patch(`${BASE}/admin/complaint/${adminId}/general/${c_id}/resolve`, null, {
    params: { hall_no: hallNo },
  });

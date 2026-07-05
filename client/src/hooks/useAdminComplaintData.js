import { useState, useEffect, useCallback } from 'react';
import { FLOORS } from '../constants/complaintConstants';
import {
  fetchHalls,
  fetchPersonalComplaints,
  resolvePersonalComplaint,
  fetchGeneralComplaints,
  resolveGeneralComplaint,
} from '../api/adminComplaintApi';

export const useAdminComplaintData = (adminId) => {
  const [halls,        setHalls]        = useState([]);
  const [hallNo,       setHallNo]       = useState(null);
  const [hallsLoading, setHallsLoading] = useState(true);

  const [floor,          setFloor]          = useState(FLOORS[0]);
  const [unresolved,     setUnresolved]     = useState([]);
  const [resolved,       setResolved]       = useState([]);
  const [generalList,    setGeneralList]    = useState([]);

  const [personalLoading, setPersonalLoading] = useState(false);
  const [generalLoading,  setGeneralLoading]  = useState(false);
  const [toast,           setToast]           = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Load the hall list once, default to the first hall.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchHalls();
        if (res.data.success) {
          setHalls(res.data.halls);
          if (res.data.halls.length > 0) setHallNo(res.data.halls[0]);
        }
      } catch (err) {
        console.error('useAdminComplaintData halls:', err);
        showToast('Failed to load halls.', false);
      } finally {
        setHallsLoading(false);
      }
    })();
  }, []);

  const loadPersonal = useCallback(async () => {
    if (!hallNo) return;
    setPersonalLoading(true);
    try {
      const res = await fetchPersonalComplaints(adminId, hallNo);
      if (res.data.success) {
        setUnresolved(res.data.unresolved || []);
        setResolved(res.data.resolved || []);
      }
    } catch (err) {
      console.error('useAdminComplaintData personal:', err);
      showToast('Failed to load complaints.', false);
    } finally {
      setPersonalLoading(false);
    }
  }, [adminId, hallNo]);

  const loadGeneral = useCallback(async () => {
    if (!hallNo || !floor) return;
    setGeneralLoading(true);
    try {
      const res = await fetchGeneralComplaints(adminId, hallNo, floor);
      if (res.data.success) setGeneralList(res.data.complaints || []);
    } catch (err) {
      console.error('useAdminComplaintData general:', err);
      showToast('Failed to load general complaints.', false);
    } finally {
      setGeneralLoading(false);
    }
  }, [adminId, hallNo, floor]);

  useEffect(() => { loadPersonal(); }, [loadPersonal]);
  useEffect(() => { loadGeneral(); }, [loadGeneral]);

  const resolvePersonal = async (c_id) => {
    try {
      const res = await resolvePersonalComplaint(adminId, c_id, hallNo);
      if (res.data.success) {
        showToast('Marked as resolved.');
        loadPersonal();
      } else {
        showToast(res.data.message, false);
      }
    } catch {
      showToast('Failed to resolve.', false);
    }
  };

  const resolveGeneral = async (c_id) => {
    try {
      const res = await resolveGeneralComplaint(adminId, c_id, hallNo);
      if (res.data.success) {
        showToast('Marked as resolved.');
        loadGeneral();
      } else {
        showToast(res.data.message, false);
      }
    } catch {
      showToast('Failed to resolve.', false);
    }
  };

  return {
    halls, hallNo, setHallNo, hallsLoading,
    floor, setFloor, floors: FLOORS,

    unresolved, resolved, personalLoading,
    generalList, generalLoading,

    toast,
    resolvePersonal, resolveGeneral,
  };
};

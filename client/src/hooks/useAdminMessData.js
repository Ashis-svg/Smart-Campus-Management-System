import { useState, useEffect, useCallback } from 'react';
import {
  fetchHalls,
  fetchAdminMessData,
  postNotice,
  removeNotice,
  patchMenu,
} from '../api/adminMessApi';

export const useAdminMessData = (adminId) => {
  const [halls,            setHalls]            = useState([]);
  const [hallNo,           setHallNo]            = useState(null);
  const [hallsLoading,     setHallsLoading]      = useState(true);

  const [todayAttendance,  setTodayAttendance]  = useState(null);
  const [weekAttendance,   setWeekAttendance]   = useState(null);
  const [todayRating,      setTodayRating]      = useState(null);
  const [weekRating,       setWeekRating]       = useState(null);
  const [todayFeedback,    setTodayFeedback]    = useState([]);
  const [weekFeedback,     setWeekFeedback]     = useState([]);
  const [todayMenu,        setTodayMenu]        = useState([]);
  const [tomorrowMenu,     setTomorrowMenu]     = useState([]);
  const [notices,          setNotices]          = useState([]);
  const [loading,          setLoading]          = useState(false);
  const [toast,            setToast]            = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Load the hall list once, and default to the first hall so the admin
  // isn't staring at an empty screen — they can switch via the selector.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchHalls();
        if (res.data.success) {
          setHalls(res.data.halls);
          if (res.data.halls.length > 0) setHallNo(res.data.halls[0]);
        }
      } catch (err) {
        console.error('useAdminMessData halls:', err);
        showToast('Failed to load halls.', false);
      } finally {
        setHallsLoading(false);
      }
    })();
  }, []);

  const loadData = useCallback(async () => {
    if (!hallNo) return;
    setLoading(true);
    try {
      const res = await fetchAdminMessData(adminId, hallNo);
      if (!res.data.success) return;
      const d = res.data;
      setTodayAttendance(d.todayAttendance);
      setWeekAttendance(d.weekAttendance);
      setTodayRating(d.todayRating);
      setWeekRating(d.weekRating);
      setTodayFeedback(d.todayFeedback   || []);
      setWeekFeedback(d.weekFeedback     || []);
      setTodayMenu(d.todayMenu           || []);
      setTomorrowMenu(d.tomorrowMenu     || []);
      setNotices(d.notices               || []);
    } catch (err) {
      console.error('useAdminMessData:', err);
      showToast('Failed to load dashboard.', false);
    } finally {
      setLoading(false);
    }
  }, [adminId, hallNo]);

  const publishNotice = async (notice) => {
    try {
      await postNotice(adminId, { ...notice, hall_no: hallNo });
      showToast('Notice published!');
      loadData();
    } catch {
      showToast('Failed to publish notice.', false);
    }
  };

  const deleteNotice = async (notice_id) => {
    try {
      await removeNotice(adminId, notice_id, hallNo);
      showToast('Notice deleted.');
      loadData();
    } catch {
      showToast('Failed to delete notice.', false);
    }
  };

  const updateMenu = async (menuData) => {
    try {
      // menuData already carries hall_no from the menu row being edited
      // (see MenuSection's EditModal), so it always matches the row it
      // came from even if the admin somehow switches halls mid-edit.
      await patchMenu(adminId, menuData);
      showToast('Menu updated!');
      loadData();
    } catch {
      showToast('Failed to update menu.', false);
    }
  };

  useEffect(() => { if (hallNo) loadData(); }, [hallNo, loadData]);

  return {
    loading, hallsLoading, toast,
    halls, hallNo, setHallNo,
    todayAttendance, weekAttendance,
    todayRating, weekRating,
    todayFeedback, weekFeedback,
    todayMenu, tomorrowMenu,
    notices,
    publishNotice, deleteNotice, updateMenu,
  };
};
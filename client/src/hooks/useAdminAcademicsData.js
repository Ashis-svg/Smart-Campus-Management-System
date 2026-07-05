import { useState, useEffect, useCallback } from 'react';
import {
  fetchAcademicsData,
  cancelClass as cancelClassApi,
  restoreClass as restoreClassApi,
  publishNotice as publishNoticeApi,
  removeNotice,
} from '../api/adminAcademicsApi';

export const useAdminAcademicsData = (adminId) => {
  const [todayClasses,    setTodayClasses]    = useState([]);
  const [tomorrowClasses, setTomorrowClasses] = useState([]);
  const [notices,         setNotices]         = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [toast,           setToast]           = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      const res = await fetchAcademicsData(adminId);
      if (!res.data.success) return;
      setTodayClasses(res.data.todayClasses       || []);
      setTomorrowClasses(res.data.tomorrowClasses || []);
      setNotices(res.data.notices                 || []);
    } catch (err) {
      console.error('useAcademicsData:', err);
      showToast('Failed to load dashboard.', false);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  // Single handler for both directions — the caller just tells us whether
  // the class is currently cancelled, and we flip it.
  const toggleClass = async (course_id, day, cancelled) => {
    try {
      if (cancelled) {
        await restoreClassApi(adminId, course_id, day);
        showToast('Class restored.');
      } else {
        await cancelClassApi(adminId, course_id, day);
        showToast('Class cancelled.');
      }
      loadData();
    } catch {
      showToast('Failed to update class status.', false);
    }
  };

  const publishNotice = async (notice) => {
    try {
      await publishNoticeApi(adminId, notice);
      showToast('Notice published!');
      loadData();
    } catch {
      showToast('Failed to publish notice.', false);
    }
  };

  const deleteNotice = async (notice_id) => {
    try {
      await removeNotice(adminId, notice_id);
      showToast('Notice deleted.');
      loadData();
    } catch {
      showToast('Failed to delete notice.', false);
    }
  };

  useEffect(() => { loadData(); }, [loadData]);

  return {
    loading, toast,
    todayClasses, tomorrowClasses,
    notices,
    toggleClass,
    publishNotice, deleteNotice,
  };
};
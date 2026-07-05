import { useState, useEffect, useCallback } from 'react';
import { fetchAcademicsData } from '../api/academicsApi';

export const useAcademicsData = (id) => {
  const [todayClasses,        setTodayClasses]        = useState([]);
  const [tomorrowClasses,     setTomorrowClasses]     = useState([]);
  const [attendance,          setAttendance]          = useState([]);
  const [attendancePercentage,setAttendancePercentage]= useState([]);
  const [notices,             setNotices]             = useState([]);
  const [loading,             setLoading]             = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await fetchAcademicsData(id);
      if (!res.data.success) return;
      const d = res.data;
      setTodayClasses(d.todayClasses               || []);
      setTomorrowClasses(d.tomorrowClasses         || []);
      setAttendance(d.attendance                   || []);
      setAttendancePercentage(d.attendancePercentage || []);
      setNotices(d.notices                         || []);
    } catch (err) {
      console.error('useAcademicsData:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  return {
    loading,
    todayClasses,
    tomorrowClasses,
    attendance,
    attendancePercentage,
    notices,
  };
};
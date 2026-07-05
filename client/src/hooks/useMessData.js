import { useState, useEffect, useCallback } from 'react';
import { fetchMessData, postMessData } from '../api/messApi';

const defaultAttendance = { breakfast: 0, lunch: 0, dinner: 0 };

export const useMessData = (id) => {
  const [hallNo, setHallNo] = useState(null);
  const [menu, setMenu] = useState([]);
  const [attendance, setAttendance] = useState(defaultAttendance);
  const [totalAttendance, setTotalAttendance] = useState(defaultAttendance);
  const [myRating, setMyRating] = useState(0);
  const [todayAverageRating, setTodayAverageRating] = useState(0);
  const [weeklyAverageRating, setWeeklyAverageRating] = useState(0);
  const [myTodayFeedback, setMyTodayFeedback] = useState('');
  const [myWeekFeedback, setMyWeekFeedback] = useState([]);
  const [todayFeedback, setTodayFeedback] = useState([]);
  const [weekFeedback, setWeekFeedback] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await fetchMessData(id);
      if (!res.data.success) return;

      const d = res.data;
      setHallNo(d.hallNo ?? null);
      setMenu(d.menu);
      setAttendance(d.attendance       || defaultAttendance);
      setTotalAttendance(d.totalAttendance || defaultAttendance);
      setMyRating(d.myRating?.rating                 || 0);
      setTodayAverageRating(d.todayAverageRating?.avg_rating || 0);
      setWeeklyAverageRating(d.weeklyAverageRating?.avg_rating || 0);
      setMyTodayFeedback(d.myTodayFeedback?.message  || '');
      setMyWeekFeedback(d.myWeekFeedback             || []);
      setTodayFeedback(d.todayFeedback               || []);
      setWeekFeedback(d.weekFeedback                 || []);
      setNotices(d.notices                           || []);
    } catch (err) {
      console.error('useMessData fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Submit any payload to the POST endpoint, then refetch
  const submitData = useCallback(async (payload) => {
    try {
      await postMessData(id, payload);
    } catch (err) {
      console.error('useMessData submit error:', err);
    } finally {
      loadData();
    }
  }, [id, loadData]);

  const submitFeedback = (formData) => submitData({ formData });
  const submitAttendance = (meal, status) => submitData({ attendence: [meal, status] });

  useEffect(() => { loadData(); }, [loadData]);

  return {
    loading,
    hallNo,
    menu,
    attendance,
    totalAttendance,
    myRating,
    todayAverageRating,
    weeklyAverageRating,
    myTodayFeedback,
    myWeekFeedback,
    todayFeedback,
    weekFeedback,
    notices,
    submitFeedback,
    submitAttendance,
  };
};
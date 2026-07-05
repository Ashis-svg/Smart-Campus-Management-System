import { useState, useEffect, useCallback } from 'react';
import {
  fetchOpinions,
  postOpinion,
  editOpinion,
  removeOpinion,
  voteOpinion,
} from '../api/opinionApi';

export const useOpinionData = (userType, userId) => {
  const [myOpinions,        setMyOpinions]        = useState([]);
  const [allOpinions,       setAllOpinions]        = useState([]);
  const [trendingOpinions,  setTrendingOpinions]   = useState([]);
  const [loading,           setLoading]            = useState(true);
  const [toast,             setToast]              = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      const res = await fetchOpinions(userType, userId);
      if (!res.data.success) return;
      setMyOpinions(res.data.myOpinions             || []);
      setAllOpinions(res.data.allOpinions           || []);
      setTrendingOpinions(res.data.trendingOpinions || []);
    } catch (err) {
      console.error('useOpinionData:', err);
      showToast('Failed to load opinions.', false);
    } finally {
      setLoading(false);
    }
  }, [userType, userId]);

  const addOpinion = async (opinion_text) => {
    try {
      await postOpinion(userType, userId, opinion_text);
      showToast('Opinion posted!');
      loadData();
    } catch {
      showToast('Failed to post opinion.', false);
    }
  };

  const updateOpinion = async (opinion_id, opinion_text) => {
    try {
      await editOpinion(userType, userId, opinion_id, opinion_text);
      showToast('Opinion updated!');
      loadData();
    } catch {
      showToast('Failed to update opinion.', false);
    }
  };

  const deleteOpinion = async (opinion_id) => {
    try {
      await removeOpinion(userType, userId, opinion_id);
      showToast('Opinion deleted.');
      loadData();
    } catch {
      showToast('Failed to delete opinion.', false);
    }
  };

  const vote = async (opinion_id, vote_type) => {
    try {
      await voteOpinion(userType, userId, opinion_id, vote_type);
      loadData();
    } catch {
      showToast('Failed to vote.', false);
    }
  };

  useEffect(() => { loadData(); }, [loadData]);

  return {
    loading, toast,
    myOpinions, allOpinions, trendingOpinions,
    addOpinion, updateOpinion, deleteOpinion, vote,
  };
};
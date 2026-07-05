import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getComplaints,
  submitPersonalComplaint,
  resolveComplaint as resolveComplaintApi,
  submitGeneralComplaint,
  voteComplaint,
} from '../api/complaintApi';

const PAGE_SIZE = 3;

export const useComplaintData = (id) => {
  const [tab, setTab] = useState('personal');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [pForm, setPForm] = useState({ c_type: '', description: '' });
  const [pSubmitting, setPSubmitting] = useState(false);

  const [gForm, setGForm] = useState({ floor: '', complaint: '' });
  const [gSubmitting, setGSubmitting] = useState(false);

  const [myVisible, setMyVisible] = useState(PAGE_SIZE);
  const [generalVisible, setGeneralVisible] = useState(PAGE_SIZE);

  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const res = await getComplaints(id);
      if (res.data.success) setData(res.data);
    } catch {
      showToast('Failed to load data.', false);
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const submitPersonal = async (e) => {
    e.preventDefault();
    if (!pForm.c_type || !pForm.description.trim()) {
      return showToast('Fill all fields.', false);
    }
    setPSubmitting(true);
    try {
      const res = await submitPersonalComplaint(id, pForm);
      if (res.data.success) {
        showToast('Complaint submitted!');
        setPForm({ c_type: '', description: '' });
        loadData();
      } else {
        showToast(res.data.message, false);
      }
    } catch {
      showToast('Failed to submit.', false);
    } finally {
      setPSubmitting(false);
    }
  };

  const resolveComplaint = async (c_id) => {
    try {
      const res = await resolveComplaintApi(id, c_id);
      if (res.data.success) {
        showToast('Marked as resolved.');
        loadData();
      } else {
        showToast(res.data.message, false);
      }
    } catch {
      showToast('Failed to resolve.', false);
    }
  };

  const submitGeneral = async (e) => {
    e.preventDefault();
    if (!gForm.floor || !gForm.complaint.trim()) {
      return showToast('Fill all fields.', false);
    }
    setGSubmitting(true);
    try {
      const res = await submitGeneralComplaint(id, gForm);
      if (res.data.success) {
        showToast('General complaint submitted!');
        setGForm({ floor: '', complaint: '' });
        loadData();
      } else {
        showToast(res.data.message, false);
      }
    } catch {
      showToast('Failed to submit.', false);
    } finally {
      setGSubmitting(false);
    }
  };

  const vote = async (c_id, vote_type) => {
    try {
      const res = await voteComplaint(id, c_id, vote_type);
      if (res.data.success) loadData();
      else showToast(res.data.message, false);
    } catch {
      showToast('Failed to vote.', false);
    }
  };

  const sortedGeneral = useMemo(
    () =>
      [...(data?.generalComplaints ?? [])].sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      ),
    [data]
  );

  return {
    tab,
    setTab,
    data,
    loading,
    toast,

    pForm,
    setPForm,
    pSubmitting,
    submitPersonal,

    gForm,
    setGForm,
    gSubmitting,
    submitGeneral,

    myVisible,
    setMyVisible,
    generalVisible,
    setGeneralVisible,
    pageSize: PAGE_SIZE,

    sortedGeneral,
    resolveComplaint,
    vote,
  };
};
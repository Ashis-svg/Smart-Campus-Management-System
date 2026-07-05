import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAdminComplaintData } from '../../hooks/useAdminComplaintData';

import HallSelector from '../../components/adminMess/HallSelector'; // reused as-is, it's generic
import Toast from '../../components/complain/Toast';           // reused as-is, it's generic
import AdminComplaintTabs from '../../components/adminComplain/AdminComplaintTabs (1)';
import PersonalComplaintsPanel from '../../components/adminComplain/PersonalComplaintsPanel (1)';
import GeneralComplaintsPanel from '../../components/adminComplain/GeneralComplaintsPanel (2)';

const AdminComplaint = () => {
  const { id: adminId } = useParams();
  const [tab, setTab] = useState('personal');

  const {
    halls, hallNo, setHallNo, hallsLoading,
    floor, setFloor, floors,

    unresolved, resolved, personalLoading,
    generalList, generalLoading,

    toast,
    resolvePersonal, resolveGeneral,
  } = useAdminComplaintData(adminId);

  if (hallsLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400 text-base">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-600 text-white px-8 py-7">
        <h1 className="text-xl font-bold tracking-tight m-0">Complaint Dashboard</h1>
        <p className="text-sm opacity-75 mt-1">Review and resolve student complaints.</p>
      </div>

      <HallSelector halls={halls} hallNo={hallNo} onChange={setHallNo} />
      <AdminComplaintTabs tab={tab} setTab={setTab} />

      <div className="max-w-3xl mx-auto px-6 pt-7">
        {tab === 'personal' && (
          <PersonalComplaintsPanel
            unresolved={unresolved}
            resolved={resolved}
            loading={personalLoading}
            onResolve={resolvePersonal}
          />
        )}

        {tab === 'general' && (
          <GeneralComplaintsPanel
            floors={floors}
            floor={floor}
            setFloor={setFloor}
            generalList={generalList}
            loading={generalLoading}
            onResolve={resolveGeneral}
          />
        )}
      </div>

      <Toast toast={toast} />
    </div>
  );
};

export default AdminComplaint;
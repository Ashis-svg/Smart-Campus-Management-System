import React from 'react';
import { useParams } from 'react-router-dom';

import { useComplaintData } from '../../hooks/useComplaintData';

import ComplaintHeader from '../../components/complain/ComplaintHeader';
import ComplaintTabs from '../../components/complain/ComplaintTabs';
import PersonalComplaintForm from '../../components/complain/PersonalComplaintForm';
import MyComplaintsList from '../../components/complain/MyComplaintsList';
import GeneralComplaintForm from '../../components/complain/GeneralComplaintForm';
import GeneralComplaintsFeed from '../../components/complain/GeneralComplaintsFeed';
import Toast from '../../components/complain/Toast';

const StudentComplain = () => {
  const { id } = useParams();
  const {
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
    pageSize,

    sortedGeneral,
    resolveComplaint,
    vote,
  } = useComplaintData(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-400 text-base">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">
      <ComplaintHeader student={data?.student} />
      <ComplaintTabs tab={tab} setTab={setTab} />

      <div className="max-w-3xl mx-auto px-6 pt-7">
        {tab === 'personal' && (
          <>
            <PersonalComplaintForm
              pForm={pForm}
              setPForm={setPForm}
              pSubmitting={pSubmitting}
              onSubmit={submitPersonal}
            />

            <MyComplaintsList
              complaints={data?.myComplaints ?? []}
              visible={myVisible}
              onShowMore={setMyVisible}
              onResolve={resolveComplaint}
              pageSize={pageSize}
            />

            <GeneralComplaintsFeed
              complaints={sortedGeneral}
              visible={generalVisible}
              onShowMore={setGeneralVisible}
              readOnly
              title="All Students' Complaints"
              emptyText="No complaints raised yet."
              pageSize={pageSize}
            />
          </>
        )}

        {tab === 'general' && (
          <>
            <GeneralComplaintForm
              gForm={gForm}
              setGForm={setGForm}
              gSubmitting={gSubmitting}
              onSubmit={submitGeneral}
              title="Raise a General Complaint"
            />

            <GeneralComplaintsFeed
              complaints={sortedGeneral}
              visible={generalVisible}
              onShowMore={setGeneralVisible}
              onVote={vote}
              title="Community Complaints"
              subtitle="Sorted by community votes. Up-vote issues you've also experienced."
              emptyText="No general complaints yet. Be the first to raise one."
              pageSize={pageSize}
            />
          </>
        )}
      </div>

      <Toast toast={toast} />
    </div>
  );
};

export default StudentComplain;
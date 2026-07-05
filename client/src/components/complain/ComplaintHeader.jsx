import React from 'react';

const ComplaintHeader = ({ student }) => (
  <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-600 text-white px-8 py-7">
    <h1 className="text-xl font-bold tracking-tight m-0">Complaint Portal</h1>
    <p className="text-sm opacity-75 mt-1">
      {student?.name} · Room {student?.room_no}
    </p>
  </div>
);

export default ComplaintHeader;
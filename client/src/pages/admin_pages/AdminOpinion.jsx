import React from 'react';
import { useParams } from 'react-router-dom';
import OpinionBoard from '../../components/opinion/OpinionBoard';

const AdminOpinion = () => {
  // Route param is :id, matching every other admin page in this app.
  const { id } = useParams();
  return <OpinionBoard userType="ADMIN" userId={id} />;
};

export default AdminOpinion;
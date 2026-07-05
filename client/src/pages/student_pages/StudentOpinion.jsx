import React from 'react';
import { useParams } from 'react-router-dom';
import OpinionBoard from '../../components/opinion/OpinionBoard';

const StudentOpinion = () => {
  const { id } = useParams();
  return <OpinionBoard userType="STUDENT" userId={id} />;
};

export default StudentOpinion;
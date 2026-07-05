import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home             from './pages/Home';
import Error            from './pages/Error';

// Student
import StudentLayout    from './pages/student_pages/StudentLayout';
import StudentHome      from './pages/student_pages/StudentHome';
import StudentLogin     from './pages/student_pages/StudentLogin';
import StudentRegister  from './pages/student_pages/StudentRegister';
import StudentMess      from './pages/student_pages/StudentMess';
import StudentComplain  from './pages/student_pages/StudentComplain';
import StudentAcademics from './pages/student_pages/StudentAcademics';
import StudentOpinion   from './pages/student_pages/StudentOpinion';

// Admin
import AdminLayout      from './pages/admin_pages/AdminLayout';
import AdminLogin       from './pages/admin_pages/AdminLogin';
import AdminRegister    from './pages/admin_pages/AdminRegister';
import AdminHome        from './pages/AdminHome';
import AdminMess        from './pages/admin_pages/AdminMess';
import AdminComplaint   from './pages/admin_pages/AdminComplaint';
import AdminAcademics   from './pages/admin_pages/AdminAcademics';
import AdminOpinion     from './pages/admin_pages/AdminOpinion';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Home />} />

      {/* Auth — no navbar */}
      <Route path="/student/login"    element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />
      <Route path="/admin/login"      element={<AdminLogin />} />
      <Route path="/admin/register"   element={<AdminRegister />} />

      {/* Student pages — wrapped in shared navbar */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="home/:id"      element={<StudentHome />} />
        <Route path="mess/:id"      element={<StudentMess />} />
        <Route path="complaint/:id" element={<StudentComplain />} />
        <Route path="academics/:id" element={<StudentAcademics />} />
        <Route path="opinion/:id"   element={<StudentOpinion />} />
      </Route>

      {/* Admin pages — wrapped in shared navbar */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path=":id"           element={<AdminHome />} />
        <Route path="mess/:id"      element={<AdminMess />} />
        <Route path="complaint/:id" element={<AdminComplaint />} />
        <Route path="academics/:id" element={<AdminAcademics />} />
        <Route path="opinion/:id"   element={<AdminOpinion />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
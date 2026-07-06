import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAdmin } from '../../api/registerApi';

const inputCls = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";
const labelCls = "text-xs font-semibold text-slate-500 mb-1 block";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ admin_id: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.admin_id.trim() || !form.email.trim() || !form.password) {
      return setError('All fields are required.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setSubmitting(true);
    try {
      const res = await registerAdmin({
        admin_id: form.admin_id.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (res.data.success) {
        navigate('/admin/login', { state: { registered: true } });
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h1 className="text-xl font-bold text-[#1e3a5f] mb-1">Admin Registration</h1>
        <p className="text-sm text-slate-400 mb-6">
          Use the admin ID and email on file with the institute.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={labelCls}>Admin ID</label>
            <input name="admin_id" className={inputCls} value={form.admin_id} onChange={handleChange} placeholder="e.g. ADM1023" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input name="email" type="email" className={inputCls} value={form.email} onChange={handleChange} placeholder="you@nitdgp.ac.in" />
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <input name="password" type="password" className={inputCls} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
          </div>
          <div>
            <label className={labelCls}>Confirm Password</label>
            <input name="confirmPassword" type="password" className={inputCls} value={form.confirmPassword} onChange={handleChange} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Registering…' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-5 text-center">
          Already registered?{' '}
          <Link to="/admin/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
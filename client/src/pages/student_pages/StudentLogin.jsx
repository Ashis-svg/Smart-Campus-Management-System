import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const inputCls = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ reg_no: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://smart-campus-management-system-oj0v.onrender.com/student/login', formData);
      if (res.data.success) {
        navigate(`/student/home/${formData.reg_no}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">

      {/* Top bar */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-blue-600 text-white px-8 py-4">
        <span className="text-base font-bold tracking-tight">Campus Media</span>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm p-8">

          <h1 className="text-xl font-bold text-[#1e3a5f] text-center mb-1">Student Login</h1>
          <p className="text-sm text-slate-400 text-center mb-7">Sign in to your campus portal</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Registration Number
              </label>
              <input
                type="text"
                name="reg_no"
                value={formData.reg_no}
                onChange={handleChange}
                placeholder="e.g. 22BCS001"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={inputCls}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default StudentLogin;
import { useNavigate } from "react-router-dom";

const PORTALS = [
  {
    role:    'Student',
    icon:    '🎓',
    accent:  'border-blue-200 hover:border-blue-400',
    badge:   'bg-blue-50 text-blue-700',
    actions: [
      { label: 'Login',    path: '/student/login',    style: 'bg-blue-600 hover:bg-blue-700 text-white'  },
      { label: 'Register', path: '/student/register', style: 'bg-white hover:bg-slate-50 text-blue-600 border border-blue-200' },
    ],
  },
  {
    role:    'Admin',
    icon:    '🛡️',
    accent:  'border-slate-200 hover:border-slate-400',
    badge:   'bg-slate-100 text-slate-600',
    actions: [
      { label: 'Login',    path: '/admin/login',    style: 'bg-[#1e3a5f] hover:bg-[#162d4a] text-white'  },
      { label: 'Register', path: '/admin/register', style: 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200' },
    ],
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-blue-600 text-white px-8 py-5 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Campus Media</h1>
        <p className="text-sm opacity-70 mt-1">Smart Campus Management System</p>
      </div>

      {/* Portal cards */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center mb-8">
            Select your portal
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PORTALS.map((portal) => (
              <div
                key={portal.role}
                className={`bg-white border-2 ${portal.accent} rounded-2xl p-7 shadow-sm transition-all duration-150`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl">{portal.icon}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${portal.badge}`}>
                    {portal.role}
                  </span>
                </div>

                <h2 className="text-base font-bold text-[#1e3a5f] mb-1">
                  {portal.role} Portal
                </h2>
                <p className="text-sm text-slate-400 mb-5">
                  {portal.role === 'Student'
                    ? 'Access mess, complaints, academics and more.'
                    : 'Manage students, menus, complaints and reports.'}
                </p>

                <div className="flex gap-2">
                  {portal.actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition cursor-pointer ${action.style}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
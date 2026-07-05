import React from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home',       path: (id) => `/student/home/${id}`      },
  { label: 'Mess',       path: (id) => `/student/mess/${id}`       },
  { label: 'Complaint',  path: (id) => `/student/complaint/${id}`  },
  { label: 'Academics',  path: (id) => `/student/academics/${id}`  },
  { label: 'Opinions',   path: (id) => `/student/opinion/${id}`    },
];

const StudentLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 font-sans">

      {/* ── Top navbar ── */}
      <nav className="bg-gradient-to-r from-[#1e3a5f] to-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">

          {/* Brand */}
          <button
            onClick={() => navigate(`/student/home/${id}`)}
            className="text-base font-bold tracking-tight cursor-pointer bg-transparent border-none text-white"
          >
            Campus Media
          </button>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.path(id)}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

        </div>
      </nav>

      {/* ── Page content ── */}
      <Outlet />

    </div>
  );
};

export default StudentLayout;
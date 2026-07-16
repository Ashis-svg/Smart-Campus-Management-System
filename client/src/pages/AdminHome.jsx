import React from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_SECTIONS = [
  {
    title: "Mess Management",
    role: "MESS_MANAGER",
    icon: "🍽️",
    description: "Manage mess menu, notices, ratings and attendance.",
    path: "mess",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Academics",
    role: "PROFESSOR",
    icon: "📚",
    description: "Manage timetable, class status and attendance.",
    path: "academics",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Complaint Management",
    role: "WARDEN",
    icon: "🛠️",
    description: "Resolve student complaints and manage hostel issues.",
    path: "complaint",
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Hostel Management",
    role: "HOSTEL_MANAGER",
    icon: "🏠",
    description: "Manage hostel information and hostel administration.",
    path: "hostel",
    color: "from-purple-500 to-pink-600",
  },
];

const AdminHome = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));

  if (!admin) {
    navigate("/admin/login");
    return null;
  }

  const visibleSections = ADMIN_SECTIONS.filter((section) =>
    admin.roles.includes(section.role)
  );

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-blue-600 text-white shadow">

        <div className="max-w-7xl mx-auto px-8 py-6">

          <h1 className="text-3xl font-bold">
            Campus Media Admin Portal
          </h1>

          <p className="opacity-80 mt-1">
            Welcome, {admin.name}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {admin.roles.map((role) => (
              <span
                key={role}
                className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
              >
                {role.replace("_", " ")}
              </span>
            ))}
          </div>

        </div>

      </div>

      {/* Dashboard */}

      <div className="max-w-7xl mx-auto p-8">

        <h2 className="text-2xl font-bold text-slate-700 mb-8">
          Available Modules
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">

          {visibleSections.map((section) => (

            <div
              key={section.role}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden"
              onClick={() =>
                navigate(`/admin/${section.path}/${admin.admin_id}`)
              }
            >

              <div
                className={`bg-gradient-to-r ${section.color} text-white p-6`}
              >
                <div className="text-5xl">
                  {section.icon}
                </div>

                <h2 className="text-2xl font-bold mt-3">
                  {section.title}
                </h2>
              </div>

              <div className="p-6">

                <p className="text-gray-600">
                  {section.description}
                </p>

                <button
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold cursor-pointer"
                >
                  Open Module
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminHome;
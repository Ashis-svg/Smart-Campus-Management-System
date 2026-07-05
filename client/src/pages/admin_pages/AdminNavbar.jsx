import React from "react";
import { Link, useParams } from "react-router-dom";

const AdminNavbar = () => {
  const { id } = useParams();

  return (
    <nav className="bg-[#1e3a5f] text-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <h1 className="text-xl font-bold">
          Campus Media Admin
        </h1>

        <div className="flex gap-6">

          <Link
            to={`/admin/${id}`}
            className="hover:text-blue-200"
          >
            Dashboard
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("admin");
              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
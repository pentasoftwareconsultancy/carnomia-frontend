import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FiLogOut, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ role, links }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={clsx(
        "bg-gray-800 shadow-md h-screen flex flex-col justify-between transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-green-600"
          >
            {collapsed ? <FiArrowRight size={20} /> : <FiArrowLeft size={20} />}
          </button>
        </div>
        <ul className="space-y-2">
          {links.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-400 text-white transition-all",
                  location.pathname === to && "bg-green-100 font-semibold text-green-700",
                  collapsed && "justify-center"
                )}
              >
                <Icon size={20} />
                {!collapsed && <span>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className={clsx(
            "w-full flex items-center px-3 py-2 text-red-500 rounded-lg hover:bg-red-100 transition-all",
            collapsed && "justify-center"
          )}
        >
          <FiLogOut size={20} className={collapsed ? "" : "mr-2"} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

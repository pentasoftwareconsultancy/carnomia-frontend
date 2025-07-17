import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../../context/AuthContext";
import { sidebarLinks } from "../constants/sidebarLinks";

const DashboardLayout = ({ role }) => {
  const { user } = useAuth();
  const currentRole = role || user?.role || "customer";
  const links = sidebarLinks[currentRole] || [];

  console.log("DashboardLayout rendering for role:", currentRole, "Links:", links);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />
      {/* Sidebar + Main content */}
      <div className="flex flex-1">
        {/* Sidebar with dynamic role-based links */}
        <Sidebar role={currentRole} links={links} />
        <main className="flex-1 p-4 overflow-y-auto bg-[#F1FFE0]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
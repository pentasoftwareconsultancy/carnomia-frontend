import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../../core/contexts/AuthContext";
import { sidebarLinks } from "../constants/sidebarLinks";

const DashboardLayout = ({ role }) => {
  const { user } = useAuth();
  const currentRole = role || user?.role || "customer";
  const links = sidebarLinks[currentRole] || [];

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (shown always on large screens, toggle on mobile) */}
        <Sidebar
          role={currentRole}
          links={links}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-4 bg-[#F1FFE0]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import {
FiFileText,
FiCheckCircle,
FiDollarSign,
FiMessageCircle,
FiBriefcase,
FiClock,
FiUsers,
FiSettings,
FiBarChart2,
FiList,
FiUserCheck,
FiLogOut,
} from "react-icons/fi";

export const sidebarLinks = {
  customer: [
    { label: "Recent Requests", to: "recent-request", icon: FiFileText },
    { label: "All Requests", to: "all-request", icon: FiCheckCircle },
    { label: "Completed Requests", to: "completed-request", icon: FiCheckCircle },
    { label: "Contact Support", to: "contact-support", icon: FiMessageCircle },
  ],
  engineer: [
    { label: "Assigned Jobs", to: "assigned", icon: FiBriefcase },
    { label: "Ongoing Jobs", to: "ongoing-job", icon: FiClock },
    { label: "Completed Jobs", to: "completed-job", icon: FiCheckCircle },
    { label: "View Payments", to: "payment-status", icon: FiDollarSign },
    { label: "Contact Support", to: "contact-support", icon: FiMessageCircle },
  ],
  admin: [
    { label: "Dashboard", to: "", icon: FiBarChart2 },
    { label: "Inspection Reports", to: "inspection-report", icon: FiFileText },
    { label: "Payment Management", to: "payment-management", icon: FiDollarSign },
    { label: "Analytics", to: "analytics", icon: FiBarChart2 },
  ],
  superadmin: [
    { label: "Dashboard", to: "", icon: FiBarChart2 },
    { label: "Manage Users", to: "manage-users", icon: FiUsers },
    { label: "Customize", to: "customize", icon: FiList },
    { label: "Inspection Reports", to: "inspection-report", icon: FiFileText },
    { label: "Payment Management", to: "payment-management", icon: FiDollarSign },
    { label: "Analytics", to: "analytics", icon: FiBarChart2 },
  ],
};


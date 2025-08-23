import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import ScrollToTop from "../pages/ScrollToTop";
import { useAuth } from "../core/contexts/AuthContext";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Career from "../pages/public/Career"; 
import Blog from "../pages/public/Blog";
import Contact from "../pages/public/Contact";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";
import Terms from "../pages/public/Terms";
import FreqeuntlyAsked from "../pages/public/FreqeuntlyAsked";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// Customer Pages
import RecentRequest from "../pages/customer/RecentRequest";
import CompletedRequest from "../pages/customer/CompletedRequest";
import RequestForm from "../pages/customer/RequestForm";
import CustomerSupport from "../pages/customer/ContactSupport";
import RequestSuccess from "../pages/customer/RequestSuccess";
import CompletedRequests from "../pages/customer/CompletedRequest";
import AllCustomerRequests from "../pages/customer/AllCustomerRequest";

// Engineer Pages
import AssignedJobs from "../pages/engineer/AssignedJobs";
import OngoingJobs from "../pages/engineer/OngoingJobs";
import CompletedJobs from "../pages/engineer/CompletedJobs";
import EngineerPayment from "../pages/engineer/PaymentStatus";
import EngineerSupport from "../pages/engineer/ContactSupport";

// Admin Pages 
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAnalytics from "../pages/admin/AdminAnalytics"
import InspectionReport from "../pages/admin/InspectionReport";
import PaymentManagement from "../pages/admin/PaymentManagement";

// Superadmin Pages
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import Manage from "../pages/superadmin/Manage";
import Customize from "../pages/superadmin/customize/Customize";
import Analytics from "../pages/superadmin/Analytics";
import InspectionReports from "../pages/superadmin/InspectionReports";
import PaymentManagements from "../pages/superadmin/PaymentManagements";
import Report from "../pages/engineer/report/Report";
import ContactSupport from "../pages/customer/ContactSupport";
import CustomerReport from '../components/common/customer-report';

// 404
const NotFound = () => (
  <div className="p-10 text-center text-red-500 text-2xl">404 | Page Not Found</div>
);

const AppRoutes = () => {
  const { isLoggedIn, user } = useAuth();

  console.log("User:", user, "isLoggedIn:", isLoggedIn);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/careers" element={<Career />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FreqeuntlyAsked />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <Login />
              ) : (
                <Navigate to={`/${user?.role}/dashboard`} replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isLoggedIn ? (
                <Signup />
              ) : (
                <Navigate to={`/${user?.role}/dashboard`} replace />
              )
            }
          />
        </Route>

        {/* Protected Form Routes (for logged-in users) */}
        <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
          <Route path="/request" element={<RequestForm />} />
          <Route path="/success" element={<RequestSuccess />} />
        </Route>

        {/* Customer Dashboard */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={isLoggedIn && user?.role === "customer"}
              redirectPath="/login"
            />
          }
        >
          <Route path="/customer/dashboard" element={<DashboardLayout role="customer" />}>
            <Route index element={<Navigate to="recent-request" replace />} />
            <Route path="recent-request" element={<RecentRequest />} />
            <Route path="all-request" element={<AllCustomerRequests />} />
            <Route path="completed-request" element={<CompletedRequests/>} />
            <Route path="contact-support" element={<CustomerSupport />} />
          </Route>
        </Route>

        {/* Engineer Dashboard */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={isLoggedIn && user?.role === "engineer"}
              redirectPath="/login"
            />
          }
        >
          <Route path="/engineer/dashboard" element={<DashboardLayout role="engineer" />}>
            <Route index element={<Navigate to="assigned" replace />} />
            <Route path="assigned" element={<AssignedJobs />} />
            <Route path="ongoing-job" element={<OngoingJobs />} />
            <Route path="completed-job" element={<CompletedJobs />} />
            <Route path="payment-status" element={<EngineerPayment />} />
            <Route path="contact-support" element={<ContactSupport />} />
            <Route path="report/:id" element={<Report />} />
          </Route>
        </Route>

        {/* Admin Dashboard */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={isLoggedIn && user?.role === "admin"}
              redirectPath="/login"
            />
          }
        >
          <Route path="/admin/dashboard" element={<DashboardLayout role="admin" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="inspection-report" element={<InspectionReport />} />
            <Route path="payment-management" element={<PaymentManagement />} />
            <Route path="report/:id" element={<Report />} />
            <Route path="customer-report" element={<CustomerReport />} />
         
          </Route>
        </Route>

        {/* Superadmin Dashboard */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={isLoggedIn && user?.role === "superadmin"}
              redirectPath="/login"
            />
          }
        >
          <Route path="/superadmin/dashboard" element={<DashboardLayout role="superadmin" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="manage-users" element={<Manage />} />
            <Route path="customize" element={<Customize />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="inspection-report" element={<InspectionReports />} />
            <Route path="report/:id" element={<Report />} />
            <Route path="payment-management" element={<PaymentManagements />} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;

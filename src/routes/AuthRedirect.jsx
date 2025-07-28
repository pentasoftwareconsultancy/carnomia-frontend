import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRedirect = ({ isAllowed, redirectTo = "/login" }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};
export default AuthRedirect;
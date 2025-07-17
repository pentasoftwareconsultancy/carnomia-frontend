import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRedirect = ({ isAllowed, redirectTo = "/" }) => {
return isAllowed ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default AuthRedirect;


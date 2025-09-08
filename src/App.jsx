import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "./App.css"; 

function App() {
  return (
    <>
      <div className="min-h-screen">
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={2000} pauseOnHover closeOnClick draggable theme="colored" />
      </div>
    </>
  );
}

export default App;


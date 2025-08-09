import ReactLocationTicker from "react";
import LocationTicker from "../layout/LocationTicker";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <LocationTicker />
      <Navbar />
      <main className="min-h-[calc(100vh-150px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
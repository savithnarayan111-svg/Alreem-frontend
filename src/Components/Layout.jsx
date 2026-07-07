import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, Navigate } from "react-router-dom";

const Layout = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
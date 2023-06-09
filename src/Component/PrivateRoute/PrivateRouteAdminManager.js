import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRouteAdminManager = () => {
  const userRole = localStorage.getItem("userRole");
  // const userAuthority = localStorage.getItem("userAuthority");

  return userRole === '"admin"' || userRole === '"manager"' ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRouteAdminManager;

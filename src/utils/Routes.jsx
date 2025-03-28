import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "./api";

// handle the private routes
const PrivateRoutes = () => {
  return getToken() ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;

// handle the public routes
export const PublicRoutes = () => {
  return !getToken() ? <Outlet /> : <Navigate to="/dashboard" />;
};

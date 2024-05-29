import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading,user } = useAuth();
  //console.log(isAuthenticated,loading,user)

  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/" replace />;
  return <Outlet />;
};
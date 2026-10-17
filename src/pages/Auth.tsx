import { Navigate, Route, Routes } from "react-router-dom";

import AuthForm from "./AuthForm";
import Sidebar from "../components/sidebar/SideBar";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function AuthPage() {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  return (
    <Routes>
      {/* Halaman login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthForm />}
      />

      {/* Halaman utama yang memerlukan autentikasi */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Sidebar />} />
      </Route>

      {/* Route yang tidak dikenal */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

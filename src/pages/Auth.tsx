import { Navigate, Route, Routes } from "react-router-dom";

import AuthForm from "./AuthForm";
import Sidebar from "../components/sidebar/SideBar";
import ProtectedRoute from "../routes/ProtectedRoute";

import { AuthProvider } from "../contexts/AuthProvider";
import { useMe } from "../hooks/auth/useAuth";
import { ScheduleProvider } from "../contexts/ScheduleProvider";

export default function AuthPage() {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthForm />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AuthenticatedPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

function AuthenticatedPage() {
  const { data, isPending, isError } = useMe();

  if (isPending) {
    return <div>Memuat data pengguna...</div>;
  }

  if (isError || !data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthProvider user={data.data}>
      <ScheduleProvider>
        <Sidebar />
      </ScheduleProvider>
    </AuthProvider>
  );
}

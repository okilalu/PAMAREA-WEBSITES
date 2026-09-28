import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserManage from "../pages/UserManage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<UserManage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

import React, { useState } from "react";
import {
  Category,
  LocationDiscover,
  LogoutCurve,
  Pointer,
  SecurityCard,
  SecurityTime,
  TaskSquare,
  TheGraph,
  UserTag,
} from "iconsax-react";

import Dashboard from "../../pages/Dashboard";
import UserManage from "../../pages/UserManage";
import pamareaLogo from "../../assets/img/PAMAREA.png";
// import PLNLOGO from "../../assets/img/PLNNusantaraPower.png";
import Checkpoint from "../../pages/Checkpoint";
import QuestionBuilder from "../../pages/QuestionBuilder";
import NfcManage from "../../pages/NfcManage";
import ScheduleManage from "../../pages/ScheduleManage";
import RealTimeMonitor from "../../pages/RealTimeMonitor";
import AnalyticAudit from "../../pages/AnalyticAudit";
import { useLogout } from "../../hooks/auth";
import { useNavigate } from "react-router-dom";

type MenuItem = {
  name: string;
  icon: React.ElementType;
};

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();

  const menus: MenuItem[] = [
    {
      name: "Dashboard",
      icon: Category,
    },
    {
      name: "Patrol Point Setup",
      icon: LocationDiscover,
    },
    {
      name: "User Management",
      icon: UserTag,
    },
    {
      name: "NFC Management",
      icon: SecurityCard,
    },
    {
      name: "Schedule Management",
      icon: SecurityTime,
    },
    {
      name: "Question Builder",
      icon: TaskSquare,
    },
    {
      name: "Real-Time Monitoring",
      icon: Pointer,
    },
    {
      name: "Analytic & Audit",
      icon: TheGraph,
    },
  ];

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />;

      case "Patrol Point Setup":
        return <Checkpoint />;

      case "User Management":
        return <UserManage />;
      case "NFC Management":
        return <NfcManage />;
      case "Schedule Management":
        return <ScheduleManage />;

      case "Question Builder":
        return <QuestionBuilder />;

      case "Real-Time Monitoring":
        return <RealTimeMonitor />;

      case "Analytic & Audit":
        return <AnalyticAudit />;

      default:
        return <Dashboard />;
    }
  };

  const clearLocalSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("access_token");

    navigate("/login", { replace: true });
  };

  const handleLogout = () => {
    if (isPending) return;

    logout(undefined, {
      onSuccess: () => {
        clearLocalSession();
      },
      onError: (error) => {
        console.error("Logout API gagal:", error);
        clearLocalSession();
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA]">
      <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-[#0B3B60]">
        <div className="flex h-16 items-center gap-3 bg-[#002541] px-6">
          {/* <img
            src={PLNLOGO}
            alt="PLN Logo"
            className="h-12 w-auto object-contain"
          /> */}

          <div>
            <h1 className="text-md font-bold text-white">PAMAREA</h1>

            <p className="text-xs font-semibold uppercase text-[#009EDA]">
              Command Center
            </p>
          </div>
          <img
            src={pamareaLogo}
            alt="PAMAREA Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        <nav className="px-4 py-6">
          <p className="mb-2 text-xs font-semibold uppercase text-[#517CA4]">
            Operational Modules
          </p>

          <div className="space-y-1">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const isActive = activeMenu === menu.name;

              return (
                <button
                  key={menu.name}
                  type="button"
                  onClick={() => handleMenuClick(menu.name)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#003C56] text-white border-l-4 border-[#00A3E0]"
                      : "text-[#5680A8] hover:bg-[#003C56] hover:text-white"
                  }`}
                >
                  <Icon size={20} color={isActive ? "#009BD5" : "#5680A8"} />

                  <span>{menu.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
        <div className="mt-auto border-t border-[#1C5277] p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <LogoutCurve size={20} color="red" />
            <span>{isPending ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      <main className="ml-72 min-h-screen">{renderContent()}</main>
    </div>
  );
};

export default Sidebar;

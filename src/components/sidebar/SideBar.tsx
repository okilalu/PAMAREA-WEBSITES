import React, { useState } from "react";
import {
  ArrowDown2,
  ArrowSwapHorizontal,
  CalendarAdd,
  CalendarTick,
  Cardano,
  Category,
  LocationDiscover,
  LogoutCurve,
  Pointer,
  Routing,
  SecurityCard,
  SecurityTime,
  Story,
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
import RealTimeMonitor from "../../pages/RealTimeMonitor";
import AnalyticAudit from "../../pages/AnalyticAudit";
import { useLogout } from "../../hooks/auth";
import { useNavigate } from "react-router-dom";
import ManageFinding from "../../pages/ManageFinding";
import ShiftChanges from "../../pages/schedule/ShiftChanges";
import RosterCalendar from "../../pages/schedule/RosterCalendar";
import ManageSchedule from "../../pages/schedule/ManageSchedule";
import PatrolSchedule from "../../pages/schedule/PatrolSchedule";
import PatrolRound from "../../pages/schedule/PatrolRound";
import RoundSetup from "../../pages/schedule/RoundSetup";
import Patrols from "../../pages/schedule/Patrols";

type MenuItem = {
  name: string;
  icon: React.ElementType;
  children?: {
    name: string;
    icon?: React.ElementType;
  }[];
};

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Operational Patrol",
  ]);
  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((name) => name !== groupName)
        : [...prev, groupName],
    );
  };
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
      name: "Operational Patrol",
      icon: SecurityTime,
      children: [
        {
          name: "Schedule Management",
          icon: SecurityTime,
        },
        {
          name: "Shift Management",
          icon: CalendarAdd,
        },
        {
          name: "Round Management",
          icon: Routing,
        },
        {
          name: "Swap Shift",
          icon: ArrowSwapHorizontal,
        },
        {
          name: "Roster Calendar",
          icon: CalendarTick,
        },
        {
          name: "Patrol History",
          icon: Story,
        },
      ],
    },
    // {
    //   name: "Schedule Management",
    //   icon: SecurityTime,
    // },
    {
      name: "Question Builder",
      icon: TaskSquare,
    },
    {
      name: "Finding Management",
      icon: Cardano,
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

  // const handleMenuClick = (menuName: string) => {
  //   setActiveMenu(menuName);
  // };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
  };

  const handleSubmenuClick = (submenuName: string) => {
    setActiveMenu(submenuName);
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
        return <ManageSchedule />;

      case "Shift Management":
        // Ganti dengan komponen halaman Buat Jadwal milikmu.
        return <PatrolSchedule />;

      case "Round Management":
        return selectedRoundId ? (
          <RoundSetup
            roundId={selectedRoundId}
            onBack={() => setSelectedRoundId(null)}
          />
        ) : (
          <PatrolRound
            onSetupRound={(roundId: string) => {
              setSelectedRoundId(roundId);
            }}
          />
        );

      case "Swap Shift":
        // Ganti dengan komponen halaman Tukar Shift milikmu.
        return <ShiftChanges />;

      case "Roster Calendar":
        // Ganti dengan komponen halaman Tukar Shift milikmu.
        return <RosterCalendar />;

      case "Patrol History":
        // Ganti dengan komponen halaman Tukar Shift milikmu.
        return <Patrols />;

      case "Question Builder":
        return <QuestionBuilder />;

      case "Finding Management":
        return <ManageFinding />;

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
          <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-[#517CA4]">
            Operational Modules
          </p>

          <div className="space-y-1">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const hasChildren = Boolean(menu.children?.length);
              const isOpen = openGroups.includes(menu.name);
              const isActive = activeMenu === menu.name;
              const hasActiveChild = menu.children?.some(
                (child) => child.name === activeMenu,
              );

              return (
                <div key={menu.name}>
                  {/* MENU UTAMA */}
                  <button
                    type="button"
                    onClick={() => {
                      if (hasChildren) {
                        toggleGroup(menu.name);
                      } else {
                        handleMenuClick(menu.name);
                      }
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive || hasActiveChild
                        ? "bg-[#003C56] text-white border-l-4 border-[#00A3E0]"
                        : "text-[#5680A8] hover:bg-[#003C56] hover:text-white"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon
                        size={20}
                        color={
                          isActive || hasActiveChild ? "#009BD5" : "#5680A8"
                        }
                      />

                      <span className="truncate">{menu.name}</span>
                    </span>

                    {hasChildren && (
                      <ArrowDown2
                        size={16}
                        color="#5680A8"
                        className={`shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* SUBMENU */}
                  {hasChildren && (
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-6 mt-1 space-y-1 border-l border-[#1C5277] pl-3">
                          {menu.children?.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = activeMenu === child.name;

                            return (
                              <button
                                key={child.name}
                                type="button"
                                onClick={() => handleSubmenuClick(child.name)}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                                  isChildActive
                                    ? "border-l-2 border-[#00A3E0] bg-[#003C56] font-semibold text-white"
                                    : "text-[#5680A8] hover:bg-[#003C56] hover:text-white"
                                }`}
                              >
                                {ChildIcon ? (
                                  <ChildIcon
                                    size={18}
                                    color={
                                      isChildActive ? "#009BD5" : "#5680A8"
                                    }
                                  />
                                ) : (
                                  <span
                                    className={`ml-1 h-1.5 w-1.5 rounded-full ${
                                      isChildActive
                                        ? "bg-[#00A3E0]"
                                        : "bg-[#5680A8]"
                                    }`}
                                  />
                                )}

                                <span className="truncate">{child.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

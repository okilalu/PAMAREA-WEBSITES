import React, { useState } from "react";
import {
  Category,
  LocationDiscover,
  Pointer,
  TaskSquare,
  TheGraph,
  UserTag,
} from "iconsax-react";

import Dashboard from "../../pages/Dashboard";
import UserManage from "../../pages/UserManage";

type MenuItem = {
  name: string;
  icon: React.ElementType;
};

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menus: MenuItem[] = [
    {
      name: "Dashboard",
      icon: Category,
    },
    {
      name: "User Management",
      icon: UserTag,
    },
    {
      name: "Patrol Point Setup",
      icon: LocationDiscover,
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

      case "User Management":
        return <UserManage />;

      case "Patrol Point Setup":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Patrol Point Setup
            </h1>
          </div>
        );

      case "Question Builder":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Question Builder
            </h1>
          </div>
        );

      case "Real-Time Monitoring":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Real-Time Monitoring
            </h1>
          </div>
        );

      case "Analytic & Audit":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Analytic & Audit
            </h1>
          </div>
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA]">
      <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-[#0B3B60]">
        <div className="flex h-16 items-center justify-between gap-3 bg-[#002541] px-6">
          <Category size={20} color="#009BD5" />

          <div>
            <h1 className="text-md font-bold text-white">PLN Patrol</h1>

            <p className="text-xs font-semibold uppercase text-[#009EDA]">
              Command Center
            </p>
          </div>
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
      </aside>

      <main className="ml-72 min-h-screen">{renderContent()}</main>
    </div>
  );
};

export default Sidebar;

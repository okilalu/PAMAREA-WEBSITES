import { Calendar, DocumentDownload, Sun, UserOctagon } from "iconsax-react";
import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen ">
      <div className="px-6 flex justify-between breadcrumbs text-sm bg-white border-b border-gray-200 h-14">
        <ul className="mt-2">
          <li>
            <a className="text-gray-700 font-semibold">Dashboard</a>
          </li>
          <li>
            <a className="text-gray-700 font-semibold">Command Center</a>
          </li>
          <li className="text-gray-700 font-semibold">Add Document</li>
        </ul>
        <div className="flex gap-2">
          <div className="bg-black rounded-full px-2 py-1">
            <p className="text-white text-lg font-bold mt-0.5">LO</p>
          </div>
          <div>
            <h2 className="text-gray-800 text-sm font-semibold">Lalu Oki</h2>
            <p className="text-gray-600 text-xs tracking-wider">
              Chief Patrol Supervisor
            </p>
          </div>
        </div>
      </div>
      <div className="px-6">
        {/* Title */}
        <div className="bg-white shadow-sm rounded-lg p-4 mt-3 h-32">
          <div className="grid grid-cols-2 gap-5">
            <div className="">
              <h1 className="text-gray-800 font-bold text-2xl">
                {" "}
                Executive Overview - Gardu Induk (GI){" "}
              </h1>
              <p className="text-gray-600 text-sm">
                Real-time security tour compliance and operational perimeter
                surveillence
              </p>
            </div>

            <div className="mt-5">
              <div className="flex gap-1 mb-2">
                <div className="bg-gray-100 rounded-sm px-4 py-1.5 flex items-center gap-1">
                  <Sun size={17} color="gray" />
                  <p className="text-gray-800 text-sm font-semibold">
                    Shift Pagi (07:00 - 15:00)
                  </p>
                </div>
                <div className="bg-gray-200 rounded-sm px-4 py-1.5 flex items-center gap-1">
                  <Calendar color="gray" size={17} variant="Bulk" />
                  <p className="text-gray-800 text-sm font-semibold">Today</p>
                </div>
              </div>
              <button className="flex gap-2 bg-blue-900 px-4 py-1.5 rounded-sm">
                <DocumentDownload size={17} color="white" />
                <p className="text-xs font-semibold">Export Log</p>
              </button>
            </div>
          </div>
        </div>
        {/* Title */}

        {/* Card */}
        <div className="grid grid-cols-4 mt-5 gap-2">
          <div className="bg-white shadow-sm rounded-md p-2 h-36">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-800">Total Satpan On-Duty</h1>
              <div className="bg-blue-100 rounded-lg p-2">
                <UserOctagon size={22} color="blue" />
              </div>
            </div>
            <div className="flex gap-1 mt-7">
              <h1 className="font-bold text-xl text-gray-800">42</h1>
              <p className="text-sm text-gray-600 self-end">Officers</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <h3 className="text-gray-500 text-sm">Target :</h3>
                <p className="text-gray-500 text-sm">40 required</p>
              </div>
              <div className="bg-blue-100 rounded-lg px-2 py-1">
                <p className="text-gray-500 text-sm">+3 Shift B</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-md p-2 h-36">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-800">Active Patrol Checkpoints</h1>
              <div className="bg-blue-100 rounded-lg p-2">
                <UserOctagon size={22} color="blue" />
              </div>
            </div>
            <div className="flex gap-1 mt-5">
              <h1 className="font-bold text-xl text-gray-800">128</h1>
              <p className="text-sm text-gray-600 self-end">Points</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <h3 className="text-gray-500 text-sm">Target :</h3>
                <p className="text-gray-500 text-sm">40 required</p>
              </div>
              <div className="bg-blue-100 rounded-lg px-2 py-1">
                <p className="text-gray-500 text-sm">+3 Shift B</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-md p-2 h-36">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-800">Today's Completion Rate</h1>
              <div className="bg-blue-100 rounded-lg p-2">
                <UserOctagon size={22} color="blue" />
              </div>
            </div>
            <div className="flex gap-1 mt-5">
              <h1 className="font-bold text-xl text-gray-800">94.2%</h1>
              <p className="text-sm text-gray-600 self-end">Graph</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <h3 className="text-gray-500 text-sm">Target :</h3>
                <p className="text-gray-500 text-sm">40 required</p>
              </div>
              <div className="bg-blue-100 rounded-lg px-2 py-1">
                <p className="text-gray-500 text-sm">+3 Shift B</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-md p-2 h-36">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-800">Active Out-Of-Radius Alert</h1>
              <div className="bg-blue-100 rounded-lg p-2">
                <UserOctagon size={22} color="blue" />
              </div>
            </div>
            <div className="flex gap-1 mt-5">
              <h1 className="font-bold text-xl text-gray-800">2</h1>
              <p className="text-sm text-gray-600 self-end">Incident</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <h3 className="text-gray-500 text-sm">Target :</h3>
                <p className="text-gray-500 text-sm">40 required</p>
              </div>
              <div className="bg-blue-100 rounded-lg px-2 py-1">
                <p className="text-gray-500 text-sm">+3 Shift B</p>
              </div>
            </div>
          </div>
        </div>
        {/* Card */}

        {/* mmmm */}
      </div>
    </div>
  );
};

export default Dashboard;

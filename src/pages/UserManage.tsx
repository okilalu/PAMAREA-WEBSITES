import { SearchNormal, UserAdd, UserSquare } from "iconsax-react";
import React from "react";

const UserManage = () => {
  return (
    <div className="min-h-screen">
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
        {/* Input */}
        <div className="flex items-center justify-between bg-white shadow-sm px-4 py-2 mt-2 rounded-lg">
          <label className="input bg-gray-100">
            <SearchNormal size={20} color="gray" />
            <input
              type="search"
              required
              placeholder="Search Satpam ID, Name, Or Station"
              className="text-gray-700 text-sm bg-gray-100"
            />
          </label>

          <div className="flex items-center justify-center gap-2 bg-[#002541] px-4 py-2 rounded-lg">
            <UserAdd size={20} color="#00A3E0" />
            <p className="font-semibold text-xs">Add New Satpam</p>
          </div>
        </div>
        {/* Input */}

        {/* Card */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
            <div className="gap-3">
              <div>
                <h1 className="text-gray-500 uppercase text-sm">
                  total security officers
                </h1>
                <div className="flex gap-1 mt-2">
                  <p className="text-black font-bold text-xl">154</p>
                  <p className="text-blue-700 text-xs self-end mb-0.5 ml-1">
                    12 Sub-areas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-100 rounded-lg p-2">
              <UserSquare size={20} color="black" />
            </div>
          </div>

          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
            <div className="gap-3">
              <div>
                <h1 className="text-gray-500 uppercase text-sm">
                  total security officers
                </h1>
                <div className="flex gap-1 mt-2">
                  <p className="text-black font-bold text-xl">154</p>
                  <p className="text-blue-700 text-xs self-end mb-0.5 ml-1">
                    12 Sub-areas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-100 rounded-lg p-2">
              <UserSquare size={20} color="black" />
            </div>
          </div>
          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
            <div className="gap-3">
              <div>
                <h1 className="text-gray-500 uppercase text-sm">
                  total security officers
                </h1>
                <div className="flex gap-1 mt-2">
                  <p className="text-black font-bold text-xl">154</p>
                  <p className="text-blue-700 text-xs self-end mb-0.5 ml-1">
                    12 Sub-areas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-100 rounded-lg p-2">
              <UserSquare size={20} color="black" />
            </div>
          </div>
          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
            <div className="gap-3">
              <div>
                <h1 className="text-gray-500 uppercase text-sm">
                  total security officers
                </h1>
                <div className="flex gap-1 mt-2">
                  <p className="text-black font-bold text-xl">154</p>
                  <p className="text-blue-700 text-xs self-end mb-0.5 ml-1">
                    12 Sub-areas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-100 rounded-lg p-2">
              <UserSquare size={20} color="black" />
            </div>
          </div>
        </div>
        {/* Card */}
      </div>
    </div>
  );
};

export default UserManage;

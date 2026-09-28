import React from "react";

export default function Breadcrumb() {
  return (
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
  );
}

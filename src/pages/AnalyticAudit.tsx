import {
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  CloseCircle,
  DocumentDownload,
  Filter,
  SearchNormal1,
  TickCircle,
} from "iconsax-react";
import React, { useState } from "react";

const AnalyticAudit = () => {
  const dummyLogs = [
    {
      id: 1,
      datetime: "08 Okt 2026, 14:30:15",
      user: "Budi Santoso",
      role: "Security Guard",
      action: "Melakukan Check-in Patroli di Area Parkir Timur",
      module: "Patrol",
      ipAddress: "192.168.1.12",
      status: "Success",
    },
    {
      id: 2,
      datetime: "08 Okt 2026, 14:15:00",
      user: "Agus Pratama",
      role: "Security Guard",
      action: "Membuat Laporan Insiden: Pagar Rusak",
      module: "Incident Report",
      ipAddress: "192.168.1.15",
      status: "Success",
    },
    {
      id: 3,
      datetime: "08 Okt 2026, 13:50:22",
      user: "Lalu Oki",
      role: "Chief Patrol Supervisor",
      action: "Mengubah Jadwal Shift Satpam Budi Santoso",
      module: "Scheduling",
      ipAddress: "10.0.0.5",
      status: "Success",
    },
    {
      id: 4,
      datetime: "08 Okt 2026, 13:10:05",
      user: "System",
      role: "System",
      action: "Gagal mengirim notifikasi email ke Agus Pratama",
      module: "Notification",
      ipAddress: "-",
      status: "Failed",
    },
    {
      id: 5,
      datetime: "08 Okt 2026, 12:00:45",
      user: "Rizky Firmansyah",
      role: "Security Guard",
      action: "Gagal Login (Password Salah 3x)",
      module: "Authentication",
      ipAddress: "114.125.10.22",
      status: "Failed",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
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

      <div className="px-6 mt-5">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="">
            <div className="flex items-center gap-1">
              <div className="h-[px] bg-[#00529C] px-1 py-3 rounded-xs" />
              <h1 className="text-2xl font-bold text-gray-800">
                Activity Logs
              </h1>
            </div>
            <div>
              <p className="text-gray-500 text-sm mt-1">
                Pantau semua aktivitas yang dilakukan oleh user dan satpam di
                dalam aplikasi.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold shadow-sm">
              <Calendar size="18" color="gray" className="text-gray-500" />
              Pilih Tanggal
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm">
              <DocumentDownload size="18" color="white" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchNormal1
                  size="18"
                  color="gray"
                  className="text-gray-400"
                />
              </div>
              <input
                type="text"
                placeholder="Cari user, aktivitas, atau modul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            {/* Filter */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium w-full md:w-auto justify-center">
              <Filter size="18" color="gray" className="text-gray-500" />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                <tr className="">
                  <th className="px-6 py-4">Waktu (WITA)</th>
                  <th className="px-6 py-4">User & Role</th>
                  <th className="px-6 py-4">Aktivitas</th>
                  <th className="px-6 py-4">Modul</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dummyLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-gray-800 font-medium">
                        {log.datetime}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-bold">
                          {log.user}
                        </span>
                        <span className="text-gray-500 text-xs mt-0.5">
                          {log.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800">{log.action}</span>
                        <span className="text-gray-400 text-xs mt-0.5">
                          IP: {log.ipAddress}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 w-[70%]">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.status === "Success" ? (
                        <div className="flex w-[70%] items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          <TickCircle size="16" color="green" variant="Bold" />
                          <span className="font-semibold text-xs">
                            Berhasil
                          </span>
                        </div>
                      ) : (
                        <div className="flex w-[70%] items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                          <CloseCircle size="16" color="red" variant="Bold" />
                          <span className="font-semibold text-xs">Gagal</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <div>
              Menampilkan <span className="font-semibold text-gray-800">1</span>{" "}
              sampai <span className="font-semibold text-gray-800">5</span> dari{" "}
              <span className="font-semibold text-gray-800">248</span> log
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                <ArrowLeft2 size="16" color="gray" />
              </button>
              <button className="px-3 py-1.5 border border-blue-600 bg-blue-50 text-blue-600 font-semibold rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg">
                3
              </button>
              <span className="px-2">...</span>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ArrowRight2 size="16" color="gray" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticAudit;

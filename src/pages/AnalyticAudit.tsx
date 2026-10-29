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
import React, { useMemo, useState } from "react";
import { useAuditLogs } from "../hooks/audit/useAuditLogs";
import type { AuditLogListResponse } from "../types";
import { formatDateTimeWITA } from "../helpers/dateTime";
import { exportLogsExcel } from "../utils/exportLogsExcel";
import { getAllAuditLogs } from "../services/audit/audit-log.service";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";

const ACTION_LABELS: Record<string, string> = {
  REFRESH_TOKEN: "Memperbarui token autentikasi",
  LOGIN: "Login ke aplikasi",
  LOGOUT: "Logout dari aplikasi",
  LOGIN_FAILED: "Gagal login ke aplikasi",
  CREATE_USER: "Membuat pengguna baru",
  UPDATE_USER: "Memperbarui data pengguna",
  DELETE_USER: "Menghapus pengguna",
  ACTIVATE_USER: "Mengaktifkan pengguna",
  DEACTIVATE_USER: "Menonaktifkan pengguna",
  CREATE_ASSIGNMENT: "Menambahkan penugasan petugas patroli",
  UPDATE_ASSIGNMENT: "Memperbarui penugasan petugas patroli",
  DELETE_ASSIGNMENT: "Menghapus penugasan petugas patroli",
  REORDER_ROUND_CHECKPOINTS: "Mengubah urutan checkpoint patroli",
  CREATE_PATROL_SCHEDULE: "Membuat jadwal patroli",
  UPDATE_PATROL_SCHEDULE: "Memperbarui jadwal patroli",
  DELETE_PATROL_SCHEDULE: "Menghapus jadwal patroli",
};

const MODULE_LABELS: Record<string, string> = {
  SESSION: "Authentication",
  USER: "User Management",
  PatrolRound: "Patrol",
  PatrolSchedule: "Scheduling",
  PatrolScheduleAssignment: "Scheduling",
  PatrolScheduleDate: "Scheduling",
  PatrolPoint: "Checkpoint",
  NfcTag: "NFC Management",
  Finding: "Incident Report",
};

const formatAction = (action: string) => {
  if (ACTION_LABELS[action]) {
    return ACTION_LABELS[action];
  }

  return action
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatModule = (entityType: string) => {
  return (
    MODULE_LABELS[entityType] ??
    entityType.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ")
  );
};

const formatRole = (roleName?: string | null) => {
  if (!roleName) {
    return "Role tidak tersedia";
  }

  const roles: Record<string, string> = {
    ADMIN: "Administrator",
    SECURITY: "Security Guard",
    DANRU_SECURITY: "Danru Security",
    CHIEF_SECURITY: "Chief Security",
  };

  return roles[roleName] ?? roleName;
};

const getActionStatus = (action: string) => {
  const normalizedAction = action.toUpperCase();

  if (
    normalizedAction.includes("FAILED") ||
    normalizedAction.includes("FAILURE")
  ) {
    return "Failed";
  }

  return "Recorded";
};

const AnalyticAudit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedModule, setSelectedModule] = useState("ALL");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
  } = useAuditLogs({ page, limit: 20 });

  // Sesuaikan dengan response hook useAuditLogs kamu.
  // Diasumsikan response berbentuk { data: [...], meta: {...} }.
  const result = response as AuditLogListResponse | undefined;

  const logs = result?.data ?? [];
  const meta = result?.meta;

  const filteredLogs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return logs.filter((log) => {
      const name = log.user?.fullName ?? "Pengguna tidak tersedia";
      const roleName = formatRole(log.user?.role?.name);
      const actionLabel = formatAction(log.action);
      const moduleLabel = formatModule(log.entityType);

      const matchesSearch =
        !keyword ||
        name.toLowerCase().includes(keyword) ||
        roleName.toLowerCase().includes(keyword) ||
        actionLabel.toLowerCase().includes(keyword) ||
        log.action.toLowerCase().includes(keyword) ||
        moduleLabel.toLowerCase().includes(keyword) ||
        log.entityType.toLowerCase().includes(keyword) ||
        (log.ipAddress ?? "").toLowerCase().includes(keyword);

      const matchesModule =
        selectedModule === "ALL" || log.entityType === selectedModule;

      const matchesAction =
        selectedAction === "ALL" || log.action === selectedAction;

      // Perbandingan tanggal menggunakan tanggal kalender WITA.
      const dateFormatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const logDate = dateFormatter.format(new Date(log.createdAt));

      const matchesStartDate = !startDate || logDate >= startDate;
      const matchesEndDate = !endDate || logDate <= endDate;

      return (
        matchesSearch &&
        matchesModule &&
        matchesAction &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [logs, searchTerm, selectedModule, selectedAction, startDate, endDate]);

  const modules = useMemo(
    () => [...new Set(logs.map((log) => log.entityType))],
    [logs],
  );

  const actions = useMemo(
    () => [...new Set(logs.map((log) => log.action))],
    [logs],
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedModule("ALL");
    setSelectedAction("ALL");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const pageLimit = meta?.limit ?? 20;
  const currentPage = page;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  const startItem = total === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const endItem = Math.min(currentPage * pageLimit, total);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);
  };

  const handleExportLogsExcel = async () => {
    try {
      const allLogs = await getAllAuditLogs();

      if (allLogs.length === 0) {
        console.warn("Tidak ada data Logs untuk diekspor.");
        return;
      }

      await exportLogsExcel(allLogs);

      console.info(`Berhasil mengekspor ${allLogs.length} data Logs ke Excel.`);
    } catch (error) {
      console.error("Gagal mengekspor data Logs:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Analytic & Audit" },
          { label: "Export Data" },
        ]}
      />

      <div className="px-6 mt-5 pb-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1">
              <div className="h-6 bg-[#00529C] px-1 rounded-xs" />

              <h1 className="text-2xl font-bold text-gray-800">
                Activity Logs
              </h1>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              Pantau semua aktivitas yang dilakukan oleh user dan satpam di
              dalam aplikasi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilter((previous) => !previous)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold shadow-sm"
            >
              <Calendar size="18" color="gray" />
              Pilih Tanggal
            </button>

            <button
              type="button"
              onClick={handleExportLogsExcel}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-semibold shadow-sm  cursor-pointer"
            >
              <DocumentDownload size="18" color="white" />
              Export Data
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchNormal1 size="18" color="gray" />
              </div>

              <input
                type="text"
                placeholder="Cari user, aktivitas, atau modul..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilter((previous) => !previous)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium w-full md:w-auto justify-center"
            >
              <Filter size="18" color="gray" />
              Filter
            </button>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Modul
                  </label>

                  <select
                    value={selectedModule}
                    onChange={(event) => {
                      setSelectedModule(event.target.value);
                      setPage(1);
                    }}
                    className="select select-bordered w-full text-sm"
                  >
                    <option value="ALL">Semua Modul</option>

                    {modules.map((module) => (
                      <option key={module} value={module}>
                        {formatModule(module)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Aktivitas
                  </label>

                  <select
                    value={selectedAction}
                    onChange={(event) => {
                      setSelectedAction(event.target.value);
                      setPage(1);
                    }}
                    className="select select-bordered w-full text-sm"
                  >
                    <option value="ALL">Semua Aktivitas</option>

                    {actions.map((action) => (
                      <option key={action} value={action}>
                        {formatAction(action)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Dari Tanggal (WITA)
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(event) => {
                      setStartDate(event.target.value);
                      setPage(1);
                    }}
                    className="input input-bordered w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Sampai Tanggal (WITA)
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(event) => {
                      setEndDate(event.target.value);
                      setPage(1);
                    }}
                    className="input input-bordered w-full text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && !response && (
            <div className="py-16 text-center text-sm text-gray-500">
              Memuat data aktivitas...
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold text-rose-600">
                Gagal memuat data audit log.
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Silakan periksa koneksi API atau coba muat ulang halaman.
              </p>
            </div>
          )}

          {/* Table */}
          {!isLoading && response && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Waktu (WITA)</th>
                      <th className="px-6 py-4">User & Role</th>
                      <th className="px-6 py-4">Aktivitas</th>
                      <th className="px-6 py-4">Modul</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredLogs.map((log) => {
                      const status = getActionStatus(log.action);

                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          {/* Date */}
                          <td className="px-6 py-4">
                            <span className="text-gray-800 font-medium">
                              {formatDateTimeWITA(log.createdAt)}
                            </span>
                          </td>

                          {/* User */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-gray-800 font-bold">
                                {log.user?.fullName ??
                                  "Pengguna tidak tersedia"}
                              </span>

                              {/* <span className="text-gray-500 text-xs mt-0.5">
                                {formatRole(log.user?.role?.name)}
                              </span> */}
                            </div>
                          </td>

                          {/* Activity */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col max-w-md">
                              <span className="text-gray-800 whitespace-normal">
                                {formatAction(log.action)}
                              </span>

                              <span className="text-gray-400 text-xs mt-1">
                                {log.entityId
                                  ? `ID: ${log.entityId}`
                                  : "ID entitas tidak tersedia"}
                              </span>
                            </div>
                          </td>

                          {/* Module */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              {formatModule(log.entityType)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {status === "Failed" ? (
                              <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                                <CloseCircle
                                  size="16"
                                  color="red"
                                  variant="Bold"
                                />

                                <span className="font-semibold text-xs">
                                  Gagal
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                <TickCircle
                                  size="16"
                                  color="green"
                                  variant="Bold"
                                />

                                <span className="font-semibold text-xs">
                                  Tercatat
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredLogs.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-16 text-center text-gray-500"
                        >
                          <p className="font-semibold text-gray-700">
                            Tidak ada aktivitas ditemukan
                          </p>

                          <p className="text-xs mt-1">
                            Coba ubah kata kunci atau filter pencarian.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-gray-500">
                <div>
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredLogs.length > 0 ? startItem : 0}
                  </span>{" "}
                  sampai{" "}
                  <span className="font-semibold text-gray-800">
                    {Math.min(endItem, startItem + filteredLogs.length - 1)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-800">{total}</span>{" "}
                  log
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      goToPage(currentPage - 1);
                    }}
                    disabled={currentPage <= 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowLeft2 size="16" color="gray" />
                  </button>

                  <span className="px-3 py-1.5 border border-blue-600 bg-blue-50 text-blue-600 font-semibold rounded-lg">
                    {currentPage}
                  </span>

                  <span className="text-gray-400">dari</span>

                  <span className="px-2 font-medium text-gray-700">
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      goToPage(currentPage + 1);
                    }}
                    disabled={currentPage >= totalPages}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowRight2 size="16" color="gray" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticAudit;

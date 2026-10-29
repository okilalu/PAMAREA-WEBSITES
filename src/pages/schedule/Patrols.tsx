import React, { useMemo, useState } from "react";
import {
  SearchNormal1,
  Filter,
  Eye,
  Location,
  Clock,
  ShieldTick,
  Warning2,
  DocumentText,
  Refresh,
  CloseCircle,
  TickCircle,
  Calendar,
  ArrowLeft2,
  ArrowRight2,
  Gallery,
  ExportCurve,
} from "iconsax-react";

import { usePatrolHistoryGroupedByUser } from "../../hooks/schedule/usePatrolHistory";

import type {
  PatrolHistoryGroupedByUser,
  PatrolHistoryItem,
} from "../../types/patrol/patrol-history";
import { formatDateTime, formatTime } from "../../helpers/dateTime";
import { getPhotoUrl } from "../../utils/getPhoto";
import { exportPatrolReportExcel } from "../../utils/patrolReportExcel";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";

const formatDuration = (
  startedAt?: string | null,
  completedAt?: string | null,
) => {
  if (!startedAt || !completedAt) return "-";

  const start = new Date(startedAt).getTime();
  const end = new Date(completedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return "-";
  }

  const totalMinutes = Math.floor((end - start) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} jam ${minutes} menit`;
  }

  return `${minutes} menit`;
};

const formatDistance = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return "-";

  return `${numberValue.toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })} m`;
};

const formatAccuracy = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return "-";

  return `${numberValue.toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })} m`;
};

const getGpsStatus = (status?: string | null) => {
  switch (status) {
    case "VALID":
      return {
        label: "GPS Valid",
        className: "bg-green-50 text-green-700 border-green-200",
      };

    case "INVALID":
      return {
        label: "GPS Tidak Valid",
        className: "bg-red-50 text-red-700 border-red-200",
      };

    case "BYPASSED":
      return {
        label: "GPS Dilewati",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };

    default:
      return {
        label: status || "Belum Divalidasi",
        className: "bg-gray-50 text-gray-600 border-gray-200",
      };
  }
};

const getNfcStatus = (patrol: PatrolHistoryItem) => {
  if (patrol.nfcBypass || patrol.nfcValidationStatus === "BYPASSED") {
    return {
      label: "Bypass NFC",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }

  switch (patrol.nfcValidationStatus) {
    case "VALID":
      return {
        label: "NFC Valid",
        className: "bg-green-50 text-green-700 border-green-200",
      };

    case "FAILED":
      return {
        label: "NFC Tidak Valid",
        className: "bg-red-50 text-red-700 border-red-200",
      };

    default:
      return {
        label: patrol.nfcValidationStatus || "Belum Divalidasi",
        className: "bg-gray-50 text-gray-600 border-gray-200",
      };
  }
};

const getStatusBadge = (status?: string | null) => {
  switch (status) {
    case "SUBMITTED":
      return {
        label: "Selesai",
        className: "bg-green-50 text-green-700 border-green-200",
      };

    case "IN_PROGRESS":
      return {
        label: "Berlangsung",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };

    case "CANCELLED":
      return {
        label: "Dibatalkan",
        className: "bg-red-50 text-red-700 border-red-200",
      };

    default:
      return {
        label: status || "-",
        className: "bg-gray-50 text-gray-600 border-gray-200",
      };
  }
};

const getSeverityBadge = (severity?: string | null) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-100 text-red-800";

    case "HIGH":
      return "bg-orange-100 text-orange-800";

    case "MEDIUM":
      return "bg-amber-100 text-amber-800";

    case "LOW":
      return "bg-blue-100 text-blue-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getFindingStatusBadge = (status?: string | null) => {
  switch (status) {
    case "OPEN":
      return "bg-red-50 text-red-700";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700";

    case "RESOLVED":
      return "bg-green-50 text-green-700";

    default:
      return "bg-gray-50 text-gray-600";
  }
};

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

const Patrols = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usePatrolHistoryGroupedByUser();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [gpsFilter, setGpsFilter] = useState("");
  const [nfcFilter, setNfcFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selectedPatrol, setSelectedPatrol] =
    useState<PatrolHistoryItem | null>(null);

  const [selectedUser, setSelectedUser] = useState<
    PatrolHistoryGroupedByUser["user"] | null
  >(null);

  const groupedUsers = response?.data ?? [];

  const allPatrols = useMemo(() => {
    return groupedUsers.flatMap((group) =>
      group.patrols.map((patrol) => ({
        patrol,
        user: group.user,
      })),
    );
  }, [groupedUsers]);

  const filteredPatrols = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allPatrols.filter(({ patrol, user }) => {
      const matchesSearch =
        !normalizedSearch ||
        user.fullName.toLowerCase().includes(normalizedSearch) ||
        user.username.toLowerCase().includes(normalizedSearch) ||
        (user.employeeNumber ?? "").toLowerCase().includes(normalizedSearch) ||
        patrol.reportNumber.toLowerCase().includes(normalizedSearch) ||
        patrol.patrolPoint.name.toLowerCase().includes(normalizedSearch) ||
        patrol.patrolPoint.code.toLowerCase().includes(normalizedSearch);

      const matchesStatus = !statusFilter || patrol.status === statusFilter;

      const matchesGps = !gpsFilter || patrol.gpsValidationStatus === gpsFilter;

      const matchesNfc =
        !nfcFilter ||
        (nfcFilter === "BYPASSED"
          ? patrol.nfcBypass || patrol.nfcValidationStatus === "BYPASSED"
          : patrol.nfcValidationStatus === nfcFilter);

      const startedAt = new Date(patrol.startedAt).getTime();

      const startBoundary = startDate
        ? new Date(`${startDate}T00:00:00+08:00`).getTime()
        : null;

      const endBoundary = endDate
        ? new Date(`${endDate}T23:59:59.999+08:00`).getTime()
        : null;

      const matchesStartDate =
        startBoundary === null || startedAt >= startBoundary;

      const matchesEndDate = endBoundary === null || startedAt <= endBoundary;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGps &&
        matchesNfc &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    allPatrols,
    search,
    statusFilter,
    gpsFilter,
    nfcFilter,
    startDate,
    endDate,
  ]);

  const summary = useMemo(() => {
    return {
      totalUsers: groupedUsers.length,
      totalPatrols: allPatrols.length,

      validGps: allPatrols.filter(
        ({ patrol }) => patrol.gpsValidationStatus === "VALID",
      ).length,

      totalFindings: allPatrols.reduce(
        (total, { patrol }) => total + patrol.findings.length,
        0,
      ),

      openFindings: allPatrols.reduce(
        (total, { patrol }) =>
          total +
          patrol.findings.filter((finding) => finding.status === "OPEN").length,
        0,
      ),

      nfcBypassed: allPatrols.filter(
        ({ patrol }) =>
          patrol.nfcBypass || patrol.nfcValidationStatus === "BYPASSED",
      ).length,
    };
  }, [groupedUsers, allPatrols]);

  const totalPages = Math.max(1, Math.ceil(filteredPatrols.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const paginatedPatrols = filteredPatrols.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setGpsFilter("");
    setNfcFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const openPatrolDetail = (
    patrol: PatrolHistoryItem,
    user: PatrolHistoryGroupedByUser["user"],
  ) => {
    setSelectedPatrol(patrol);
    setSelectedUser(user);
  };

  const closePatrolDetail = () => {
    setSelectedPatrol(null);
    setSelectedUser(null);
  };

  const handleExportExcel = async () => {
    try {
      await exportPatrolReportExcel(filteredPatrols);
    } catch (error) {
      console.error("Gagal export laporan patroli:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengekspor laporan patroli.",
      );
    }
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Operational Patrol" },
          { label: "Patrol History" },
        ]}
      />

      <div className="space-y-6 px-6 pb-8 pt-6">
        {/* PAGE TITLE */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-7 w-1 rounded-full bg-[#00529C]" />

              <h1 className="text-2xl font-bold text-gray-900">
                Riwayat Patrol
              </h1>
            </div>

            <p className="max-w-3xl text-sm leading-6 text-gray-500">
              Pantau riwayat inspeksi satpam, validasi GPS dan NFC, hasil
              checklist, serta temuan lapangan pada setiap titik patroli.
            </p>
          </div>

          <div className="">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="btn border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              <Refresh
                size={18}
                className={isFetching ? "animate-spin" : ""}
                color="gray"
              />
              Perbarui Data
            </button>
            {/* <button
              type="button"
              onClick={() =>
                exportExcel({
                  search: search || undefined,
                  status: status || undefined,
                  startDate: startDate || undefined,
                  endDate: endDate || undefined,
                })
              }
              disabled={isExporting}
              className="btn border-gray-200 bg-white text-gray-700 hover:bg-gray-50 ml-3"
            >
              <ExportCurve size={18} color="gray" />
              {isExporting ? "Mengexport..." : "Export Data"}
            </button> */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="btn border-gray-200 bg-white text-gray-700 hover:bg-gray-50 ml-3"
            >
              <ExportCurve size={18} color="gray" />
              {"Export Data"}
            </button>
          </div>
        </div>

        {/* OPTIONAL NFC NOTICE */}
        {summary.nfcBypassed > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Warning2
              size={21}
              className="mt-0.5 shrink-0 text-amber-600"
              color="orange"
            />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Perhatian: Validasi NFC dilewati
              </p>

              <p className="mt-1 text-sm text-amber-800">
                Terdapat {summary.nfcBypassed} patroli dengan validasi NFC
                bypass. Periksa alasan bypass pada detail masing-masing patroli.
              </p>
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={19} className="text-[#00529C]" />

            <h2 className="font-semibold text-gray-900">Filter Riwayat</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div className="relative xl:col-span-2">
              <SearchNormal1
                size={18}
                color="gray"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Nama, NIP, laporan, checkpoint..."
                className="input input-bordered w-full pl-10 text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="select select-bordered w-full text-sm"
            >
              <option value="">Semua Status</option>
              <option value="SUBMITTED">Selesai</option>
              <option value="IN_PROGRESS">Berlangsung</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>

            <select
              value={gpsFilter}
              onChange={(event) => {
                setGpsFilter(event.target.value);
                setPage(1);
              }}
              className="select select-bordered w-full text-sm"
            >
              <option value="">Semua GPS</option>
              <option value="VALID">Valid</option>
              <option value="INVALID">Tidak Valid</option>
              <option value="BYPASSED">Dilewati</option>
            </select>

            <select
              value={nfcFilter}
              onChange={(event) => {
                setNfcFilter(event.target.value);
                setPage(1);
              }}
              className="select select-bordered w-full text-sm"
            >
              <option value="">Semua NFC</option>
              <option value="VALID">Valid</option>
              <option value="INVALID">Tidak Valid</option>
              <option value="BYPASSED">Bypass</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="btn border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            >
              <CloseCircle size={17} color="gray" />
              Reset
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-1/2">
            <label className="form-control">
              <span className="mb-1.5 text-xs font-medium text-gray-500">
                Tanggal Mulai
              </span>

              <div className="relative">
                <Calendar
                  size={17}
                  color="gray"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setPage(1);
                  }}
                  className="input input-bordered w-full pl-10 text-sm"
                />
              </div>
            </label>

            <label className="form-control">
              <span className="mb-1.5 text-xs font-medium text-gray-500">
                Tanggal Akhir
              </span>

              <div className="relative">
                <Calendar
                  size={17}
                  color="gray"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setPage(1);
                  }}
                  className="input input-bordered w-full pl-10 text-sm"
                />
              </div>
            </label>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-gray-200 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-gray-900">
                Daftar Riwayat Patrol
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Hasil inspeksi dan validasi setiap patroli.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {filteredPatrols.length} patroli ditemukan
            </span>
          </div>

          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center">
              <span className="loading loading-spinner loading-lg text-[#00529C]" />
            </div>
          ) : isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
              <Warning2 size={36} className="text-red-500" color="rose" />

              <p className="font-semibold text-gray-800">
                Gagal memuat riwayat patroli
              </p>

              <p className="max-w-md text-sm text-gray-500">
                {error instanceof Error
                  ? error.message
                  : "Terjadi kesalahan saat mengambil data."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="btn btn-primary btn-sm"
              >
                Coba Lagi
              </button>
            </div>
          ) : paginatedPatrols.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <DocumentText
                size={42}
                className="mb-3 text-gray-300"
                color="gray"
              />

              <p className="font-semibold text-gray-800">
                Tidak ada riwayat patroli
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Coba ubah pencarian atau filter yang digunakan.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="whitespace-nowrap px-5 py-4">Petugas</th>

                      <th className="whitespace-nowrap px-5 py-4">
                        Laporan / Titik Patrol
                      </th>

                      <th className="whitespace-nowrap px-5 py-4">Waktu</th>

                      <th className="whitespace-nowrap px-5 py-4">GPS</th>

                      <th className="whitespace-nowrap px-5 py-4">NFC</th>

                      <th className="whitespace-nowrap px-5 py-4 text-center">
                        Temuan
                      </th>

                      <th className="whitespace-nowrap px-5 py-4">Status</th>

                      <th className="whitespace-nowrap px-5 py-4 text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedPatrols.map(({ patrol, user }) => {
                      const gps = getGpsStatus(patrol.gpsValidationStatus);

                      const nfc = getNfcStatus(patrol);

                      const status = getStatusBadge(patrol.status);

                      return (
                        <tr
                          key={patrol.id}
                          className="border-b border-gray-100 transition-colors hover:bg-blue-50/30"
                        >
                          {/* USER */}
                          <td className="px-5 py-4">
                            <div className="flex min-w-44 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#00529C]">
                                {getInitials(user.fullName)}
                              </div>

                              <div>
                                <p className="font-semibold text-gray-800">
                                  {user.fullName}
                                </p>

                                <p className="mt-0.5 text-xs text-gray-500">
                                  {user.employeeNumber ?? "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* REPORT */}
                          <td className="px-5 py-4">
                            <div className="min-w-52">
                              <p className="font-semibold text-[#00529C]">
                                {patrol.reportNumber}
                              </p>

                              <p className="mt-1 text-sm text-gray-800">
                                {patrol.patrolPoint.name}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {patrol.patrolPoint.code} · {patrol.site.name}
                              </p>
                            </div>
                          </td>

                          {/* TIME */}
                          <td className="px-5 py-4">
                            <div className="min-w-36">
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Clock
                                  size={15}
                                  className="text-gray-400"
                                  color="gray"
                                />

                                {formatDateTime(patrol.startedAt)}
                              </div>

                              <p className="mt-1 text-xs text-gray-500">
                                Durasi:{" "}
                                {formatDuration(
                                  patrol.startedAt,
                                  patrol.completedAt,
                                )}
                              </p>
                            </div>
                          </td>

                          {/* GPS */}
                          <td className="px-5 py-4">
                            <div className="flex min-w-32 flex-col items-start gap-1.5">
                              <span className={`badge border ${gps.className}`}>
                                {gps.label}
                              </span>

                              <p className="text-xs text-gray-500">
                                Jarak:{" "}
                                {formatDistance(patrol.distanceFromPoint)}
                              </p>
                            </div>
                          </td>

                          {/* NFC */}
                          <td className="px-5 py-4">
                            <div className="flex min-w-28 flex-col items-start gap-1.5">
                              <span className={`badge border ${nfc.className}`}>
                                {nfc.label}
                              </span>

                              {patrol.nfcBypassReason && (
                                <p className="text-xs text-gray-500">
                                  Alasan: {patrol.nfcBypassReason}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* FINDINGS */}
                          <td className="px-5 py-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`font-bold ${
                                  patrol.findings.length > 0
                                    ? "text-amber-600"
                                    : "text-green-600"
                                }`}
                              >
                                {patrol.findings.length}
                              </span>

                              <span className="mt-1 text-xs text-gray-500">
                                Temuan
                              </span>
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">
                            <span
                              className={`badge border ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>

                          {/* ACTION */}
                          <td className="px-5 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => openPatrolDetail(patrol, user)}
                              title="Lihat detail patroli"
                              className="btn btn-square btn-sm border-blue-100 bg-blue-50 text-[#00529C] hover:bg-blue-100"
                            >
                              <Eye size={18} color="gray" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex flex-col justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center">
                <p className="text-sm text-gray-500">
                  Menampilkan{" "}
                  {filteredPatrols.length === 0
                    ? 0
                    : (currentPage - 1) * pageSize + 1}
                  {" - "}
                  {Math.min(
                    currentPage * pageSize,
                    filteredPatrols.length,
                  )}{" "}
                  dari {filteredPatrols.length} patroli
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="btn btn-square btn-sm border-gray-200 bg-white disabled:opacity-40"
                  >
                    <ArrowLeft2 size={17} color="black" />
                  </button>

                  <span className="px-3 text-sm font-medium text-gray-700">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="btn btn-square btn-sm border-gray-200 bg-white disabled:opacity-40"
                  >
                    <ArrowRight2 size={17} color="black" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedPatrol && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box max-h-[90vh] w-11/12 max-w-5xl overflow-y-auto rounded-2xl p-0">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#00529C]">
                  Detail Riwayat Patrol
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedPatrol.reportNumber}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedUser.fullName} · {selectedUser.employeeNumber ?? "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={closePatrolDetail}
                className="btn btn-square btn-sm btn-ghost"
              >
                <CloseCircle size={22} color="gray" />
              </button>
            </div>

            <div className="space-y-6 p-5">
              {/* BASIC INFORMATION */}
              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Informasi Patroli
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Lokasi Operasional</p>

                    <p className="mt-2 font-semibold text-gray-800">
                      {selectedPatrol.site.name}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Titik Patrol</p>

                    <p className="mt-2 font-semibold text-gray-800">
                      {selectedPatrol.patrolPoint.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {selectedPatrol.patrolPoint.code}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Status</p>

                    <span
                      className={`badge mt-2 border ${
                        getStatusBadge(selectedPatrol.status).className
                      }`}
                    >
                      {getStatusBadge(selectedPatrol.status).label}
                    </span>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Waktu Mulai</p>

                    <p className="mt-2 font-medium text-gray-800">
                      {formatDateTime(selectedPatrol.startedAt)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Waktu Selesai</p>

                    <p className="mt-2 font-medium text-gray-800">
                      {formatDateTime(selectedPatrol.completedAt)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Durasi Patroli</p>

                    <p className="mt-2 font-medium text-gray-800">
                      {formatDuration(
                        selectedPatrol.startedAt,
                        selectedPatrol.completedAt,
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* GPS AND NFC VALIDATION */}
              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Validasi Lokasi dan NFC
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <Location
                        size={20}
                        className="text-[#00529C]"
                        color="gray"
                      />

                      <h4 className="font-semibold text-gray-800">
                        Validasi GPS
                      </h4>
                    </div>

                    <span
                      className={`badge mt-3 border ${
                        getGpsStatus(selectedPatrol.gpsValidationStatus)
                          .className
                      }`}
                    >
                      {getGpsStatus(selectedPatrol.gpsValidationStatus).label}
                    </span>

                    <div className="mt-4 space-y-2 text-sm">
                      <p className="flex justify-between gap-3">
                        <span className="text-gray-500">Latitude</span>

                        <span className="font-medium text-gray-800">
                          {selectedPatrol.latitude ?? "-"}
                        </span>
                      </p>

                      <p className="flex justify-between gap-3">
                        <span className="text-gray-500">Longitude</span>

                        <span className="font-medium text-gray-800">
                          {selectedPatrol.longitude ?? "-"}
                        </span>
                      </p>

                      <p className="flex justify-between gap-3">
                        <span className="text-gray-500">Akurasi GPS</span>

                        <span className="font-medium text-gray-800">
                          {formatAccuracy(selectedPatrol.gpsAccuracy)}
                        </span>
                      </p>

                      <p className="flex justify-between gap-3">
                        <span className="text-gray-500">Jarak dari Titik</span>

                        <span className="font-medium text-gray-800">
                          {formatDistance(selectedPatrol.distanceFromPoint)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <ShieldTick
                        size={20}
                        className="text-[#00529C]"
                        color="gray"
                      />

                      <h4 className="font-semibold text-gray-800">
                        Validasi NFC
                      </h4>
                    </div>

                    <span
                      className={`badge mt-3 border ${
                        getNfcStatus(selectedPatrol).className
                      }`}
                    >
                      {getNfcStatus(selectedPatrol).label}
                    </span>

                    <div className="mt-4 space-y-2 text-sm">
                      <p className="flex justify-between gap-3">
                        <span className="text-gray-500">UID NFC</span>

                        <span className="break-all text-right font-medium text-gray-800">
                          {selectedPatrol.nfcUidSnapshot ?? "-"}
                        </span>
                      </p>

                      <p className="flex justify-between gap-3">
                        <span className="text-gray-500">Bypass</span>

                        <span className="font-medium text-gray-800">
                          {selectedPatrol.nfcBypass ? "Ya" : "Tidak"}
                        </span>
                      </p>

                      <p className="flex justify-between gap-3">
                        <span className="text-gray-500">Alasan</span>

                        <span className="font-medium text-gray-800">
                          {selectedPatrol.nfcBypassReason ?? "-"}
                        </span>
                      </p>

                      {selectedPatrol.nfcBypassNote && (
                        <div>
                          <p className="text-gray-500">Catatan Bypass</p>

                          <p className="mt-1 text-gray-800">
                            {selectedPatrol.nfcBypassNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* CHECKPOINT */}
              <section>
                <h3 className="mb-3 font-semibold text-gray-900">Checkpoint</h3>

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-green-600">
                      <TickCircle size={21} color="gray" />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {selectedPatrol.checkpoint.pointNameSnapshot ??
                          selectedPatrol.patrolPoint.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {selectedPatrol.checkpoint.pointCodeSnapshot ??
                          selectedPatrol.patrolPoint.code}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="badge badge-outline">
                          Urutan ke-
                          {selectedPatrol.checkpoint.sequence}
                        </span>

                        <span className="badge border border-green-200 bg-green-50 text-green-700">
                          {selectedPatrol.checkpoint.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-gray-500">
                        Waktu kunjungan:{" "}
                        {formatDateTime(selectedPatrol.checkpoint.visitedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ANSWERS */}
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">
                    Hasil Checklist Inspeksi
                  </h3>

                  <span className="text-xs text-gray-500">
                    {selectedPatrol.answers.length} pertanyaan
                  </span>
                </div>

                {selectedPatrol.answers.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                    Belum ada jawaban checklist.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPatrol.answers.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-6 text-gray-800">
                              {answer.questionTextSnapshot}
                            </p>

                            <div className="mt-2">
                              <span
                                className={`badge ${
                                  answer.answerValue === "NO"
                                    ? "bg-red-50 text-red-700"
                                    : answer.answerValue === "YES"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {answer.answerLabelSnapshot ??
                                  answer.answerValue}
                              </span>
                            </div>

                            {answer.photos.length > 0 && (
                              <div className="mt-4">
                                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                                  <Gallery size={15} />
                                  {answer.photos.length} foto bukti
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                  {answer.photos.map((photo) => {
                                    const photoUrl = getPhotoUrl(photo.fileUrl);
                                    return (
                                      <a
                                        key={photo.id}
                                        href={photoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group overflow-hidden rounded-lg border border-gray-200"
                                      >
                                        <img
                                          src={photoUrl}
                                          alt={
                                            photo.fileName ??
                                            "Foto bukti inspeksi"
                                          }
                                          loading="lazy"
                                          className="h-28 w-full object-cover transition-transform group-hover:scale-105"
                                        />

                                        <div className="p-2">
                                          <p className="truncate text-xs text-gray-600">
                                            {photo.fileName ?? "Foto inspeksi"}
                                          </p>

                                          <p className="mt-1 text-[11px] text-gray-400">
                                            {formatTime(photo.capturedAt)}
                                          </p>
                                        </div>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* PATROL PHOTOS */}
              {selectedPatrol.photos.length > 0 && (
                <section>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Foto Patroli
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {selectedPatrol.photos.map((photo) => (
                      <a
                        key={photo.id}
                        href={photo.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-xl border border-gray-200"
                      >
                        <img
                          src={photo.fileUrl}
                          alt={photo.fileName ?? "Foto patroli"}
                          loading="lazy"
                          className="h-32 w-full object-cover"
                        />

                        <p className="truncate p-2 text-xs text-gray-600">
                          {photo.fileName ?? "Foto patroli"}
                        </p>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* FINDINGS */}
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">
                    Temuan Lapangan
                  </h3>

                  <span className="text-xs text-gray-500">
                    {selectedPatrol.findings.length} temuan
                  </span>
                </div>

                {selectedPatrol.findings.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                    <TickCircle
                      size={30}
                      className="mx-auto mb-2 text-green-500"
                    />

                    <p className="text-sm font-medium text-gray-700">
                      Tidak ada temuan pada patroli ini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPatrol.findings.map((finding) => (
                      <div
                        key={finding.id}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {finding.title}
                            </h4>

                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              {finding.description}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-wrap items-start gap-2">
                            <span
                              className={`badge ${getSeverityBadge(
                                finding.severity,
                              )}`}
                            >
                              {finding.severity}
                            </span>

                            <span
                              className={`badge ${getFindingStatusBadge(
                                finding.status,
                              )}`}
                            >
                              {finding.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-gray-500">
                              Titik Temuan
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {finding.patrolPoint.name}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Pelapor</p>

                            <p className="mt-1 font-medium text-gray-800">
                              {finding.reportedBy.fullName}
                            </p>

                            <p className="text-xs text-gray-500">
                              {finding.reportedBy.employeeNumber ?? "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Ditugaskan kepada
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {finding.assignedTo?.fullName ?? "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Waktu Temuan
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {formatDateTime(finding.createdAt)}
                            </p>
                          </div>
                        </div>

                        {finding.resolutionNote && (
                          <div className="mt-4 rounded-lg bg-green-50 p-3">
                            <p className="text-xs font-semibold text-green-800">
                              Catatan Penyelesaian
                            </p>

                            <p className="mt-1 text-sm text-green-700">
                              {finding.resolutionNote}
                            </p>

                            {finding.resolvedBy && (
                              <p className="mt-2 text-xs text-green-700">
                                Diselesaikan oleh: {finding.resolvedBy.fullName}
                              </p>
                            )}
                          </div>
                        )}

                        {finding.photos?.length > 0 && (
                          <div className="mt-4">
                            <p className="mb-2 text-xs font-medium text-gray-500">
                              Foto Bukti Temuan
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                              {finding.photos.map((photo) => {
                                const photoUrl = getPhotoUrl(photo.fileUrl);

                                return (
                                  <a
                                    key={photo.id}
                                    href={photoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                                  >
                                    <div className="flex h-36 items-center justify-center bg-gray-50">
                                      <img
                                        src={photoUrl}
                                        alt={photo.fileName ?? "Foto temuan"}
                                        loading="lazy"
                                        className="h-full w-full object-contain"
                                        onError={() => {
                                          console.error(
                                            "Gagal memuat foto temuan:",
                                            {
                                              fileName: photo.fileName,
                                              originalUrl: photo.fileUrl,
                                              resolvedUrl: photoUrl,
                                            },
                                          );
                                        }}
                                      />
                                    </div>

                                    <p className="truncate border-t border-gray-100 p-2 text-xs text-gray-600">
                                      {photo.fileName ?? "Foto temuan"}
                                    </p>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* MODAL FOOTER */}
              <div className="flex justify-end border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={closePatrolDetail}
                  className="btn bg-[#00529C] text-white hover:bg-[#003B73]"
                >
                  Tutup Detail
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            aria-label="Tutup detail patroli"
            onClick={closePatrolDetail}
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
};

export default Patrols;

import React, { useMemo, useState } from "react";
import {
  SearchNormal1,
  People,
  Clock,
  ArrowRight2,
  Setting2,
  RouteSquare,
  ShieldTick,
} from "iconsax-react";

import { useGetScheduleAssigments } from "../../hooks/schedule/usePatrolScheduleAssignment";
import { usePatrolRoundsGroupedByUser } from "../../hooks/schedule/usePatrolRound";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";

type PatrolRoundProps = {
  onSetupRound: (roundId: string) => void;
};

const PatrolRound = ({ onSetupRound }: PatrolRoundProps) => {
  const {
    data: assignments,
    isLoading,
    isError,
    refetch,
  } = useGetScheduleAssigments();

  const { data: patrolRounds } = usePatrolRoundsGroupedByUser();

  const [search, setSearch] = useState("");
  const [selectedShift, setSelectedShift] = useState("ALL");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);

  const assignmentList = assignments ?? [];
  const groupedRounds = patrolRounds?.data ?? [];

  // Kelompokkan round berdasarkan assignmentId agar setiap assignment
  // menampilkan putaran yang benar dari endpoint grouped-by-user.
  const roundsByAssignment = useMemo(() => {
    type GroupedRound = NonNullable<
      typeof patrolRounds
    >["data"][number]["rounds"][number];

    const map = new Map<string, GroupedRound[]>();

    groupedRounds.forEach((group) => {
      group.rounds.forEach((round) => {
        const current = map.get(round.assignmentId) ?? [];
        current.push(round);
        map.set(round.assignmentId, current);
      });
    });

    map.forEach((rounds) => {
      rounds.sort(
        (a, b) =>
          new Date(a.scheduledStartAt).getTime() -
          new Date(b.scheduledStartAt).getTime(),
      );
    });

    return map;
  }, [groupedRounds]);

  // Hanya assignment aktif yang ditampilkan.
  const activeAssignments = useMemo(
    () => assignmentList.filter((item) => item.status === "ACTIVE"),
    [assignmentList],
  );

  const selectedAssignment = activeAssignments.find(
    (item) => item.id === selectedAssignmentId,
  );
  const selectedAssignmentRounds = selectedAssignmentId
    ? (roundsByAssignment.get(selectedAssignmentId) ?? [])
    : [];

  const filteredAssignments = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return activeAssignments.filter((item) => {
      const matchesSearch =
        (item.user?.fullName ?? "").toLowerCase().includes(keyword) ||
        (item.user?.employeeNumber ?? "").toLowerCase().includes(keyword) ||
        (item.schedule?.name ?? "").toLowerCase().includes(keyword);

      const matchesShift =
        selectedShift === "ALL" || item.schedule?.name === selectedShift;

      return matchesSearch && matchesShift;
    });
  }, [activeAssignments, search, selectedShift]);

  const shiftOptions = useMemo(
    () =>
      Array.from(
        new Set(
          activeAssignments
            .map((item) => item.schedule?.name)
            .filter((name): name is string => Boolean(name)),
        ),
      ),
    [activeAssignments],
  );

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Makassar",
    }).format(new Date(date));

  const formatDateTime = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Makassar",
    }).format(new Date(date));

  const formatDateRange = (startDate: string, endDate?: string | null) => {
    if (!endDate) return `${formatDate(startDate)} – Tanpa batas`;

    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const getShiftStyle = (name: string) => {
    if (name.toLowerCase().includes("pagi")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (
      name.toLowerCase().includes("siang") ||
      name.toLowerCase().includes("sore")
    ) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (name.toLowerCase().includes("malam")) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }

    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  const summaryCard = [
    {
      title: "Petugas Ditugaskan",
      value: activeAssignments.length,
      description: "Assignment berstatus aktif",
      icon: <People size={21} color="blue" />,
    },
    {
      title: "Shift Terjadwal",
      value: shiftOptions.length,
      description: "Jenis shift dengan assignment aktif",
      icon: <Clock size={21} color="blue" />,
    },
    {
      title: "Konfigurasi Rounds",
      value: patrolRounds?.totalRounds ?? 0,
      description: `${patrolRounds?.totalUsers ?? 0} petugas memiliki data rounds`,
      icon: <RouteSquare size={21} color="blue" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Operational Patrol" },
          { label: "Atur Round" },
        ]}
      />

      <div className="space-y-5 px-6 pb-6">
        <div className="my-5 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">Management Patrol Rounds</h1>
            </div>
            <p className="text-gray-500 text-sm">
              Atur putaran patroli untuk petugas yang telah ditugaskan pada
              jadwal shift. Kelola interval patroli dan checkpoint yang harus
              dikunjungi pada setiap putaran.
            </p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {summaryCard.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {item.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {item.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#00529C]">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* TABLE TOOLBAR */}
          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Petugas & Jadwal Patroli
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Pilih petugas untuk mengatur putaran patroli berdasarkan shift.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <SearchNormal1
                  color="gray"
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari petugas atau shift..."
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-blue-400 sm:w-64"
                />
              </div>

              <select
                value={selectedShift}
                onChange={(event) => setSelectedShift(event.target.value)}
                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400"
              >
                <option value="ALL">Semua Shift</option>

                {shiftOptions.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] table-fixed">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="w-[25%] px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Petugas
                  </th>

                  <th className="w-[19%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Jadwal Shift
                  </th>

                  <th className="w-[23%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Periode Penugasan
                  </th>

                  <th className="w-[13%] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Rounds
                  </th>
                  <th className="w-[20%] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-xs text-gray-500"
                    >
                      Memuat data penugasan...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <p className="text-sm font-semibold text-red-600">
                        Gagal memuat data assignment.
                      </p>
                      <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Coba lagi
                      </button>
                    </td>
                  </tr>
                ) : filteredAssignments.length > 0 ? (
                  filteredAssignments.map((item) => {
                    const user = item.user;
                    const schedule = item.schedule;

                    if (!user || !schedule) return null;

                    return (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-blue-50/30"
                      >
                        {/* PETUGAS */}
                        <td className="px-5 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-xs font-bold text-[#003B73]">
                              {getInitials(user.fullName)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-gray-800">
                                {user.fullName}
                              </p>

                              <p className="mt-1 text-[10px] text-gray-500">
                                {user.employeeNumber ?? user.username}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* SHIFT */}
                        <td className="px-4 py-4 align-middle">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold ${getShiftStyle(schedule.name)}`}
                          >
                            {schedule.name}
                          </span>

                          <p className="mt-2 whitespace-nowrap text-[11px] text-gray-600">
                            {schedule.startTime}–{schedule.endTime} WITA
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            Interval {schedule.intervalMinutes} menit
                          </p>
                        </td>

                        {/* PERIODE */}
                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-start gap-2">
                            <div className="min-w-0">
                              <p className="mb-1 text-[10px] text-gray-400 text-center">
                                Masa berlaku assignment
                              </p>
                              <p className="text-xs font-medium text-gray-700">
                                {formatDateRange(item.startDate, item.endDate)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* JUMLAH ROUNDS */}
                        <td className="px-4 py-4 text-center align-middle">
                          {(() => {
                            const rounds =
                              roundsByAssignment.get(item.id) ?? [];
                            return (
                              <>
                                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#003B73]">
                                  {rounds.length} putaran
                                </span>
                                <p className="mt-1 text-[10px] text-gray-400">
                                  {
                                    rounds.filter(
                                      (round) => round.status === "PENDING",
                                    ).length
                                  }{" "}
                                  menunggu
                                </p>
                              </>
                            );
                          })()}
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-4 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => setSelectedAssignmentId(item.id)}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#003B73] px-3 text-xs font-semibold text-white transition hover:bg-[#00529C]"
                          >
                            <Setting2 size={15} color="white" />
                            Atur Rounds
                            <ArrowRight2 size={14} color="white" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                          <ShieldTick size={22} color="gray" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-gray-700">
                          Tidak ada assignment ditemukan
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Periksa filter atau pastikan petugas sudah ditugaskan
                          pada jadwal shift.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="flex flex-col justify-between gap-2 border-t border-gray-100 bg-white px-4 py-3 sm:flex-row sm:items-center">
            <p className="text-[11px] text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {filteredAssignments.length}
              </span>{" "}
              assignment aktif
            </p>

            <p className="text-[10px] text-gray-400">
              Data assignment dan Patrol Rounds dari backend
            </p>
          </div>
        </div>

        {/* MODAL PILIH ROUND */}
        {selectedAssignmentId && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedAssignmentId(null);
              }
            }}
          >
            <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Pilih Putaran Patroli
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedAssignment?.user?.fullName ?? "Petugas"} ·{" "}
                    {selectedAssignment?.schedule?.name ?? "Jadwal shift"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentId(null)}
                  className="rounded-lg px-2 py-1 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Tutup modal"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[65vh] space-y-2 overflow-y-auto p-5">
                {selectedAssignmentRounds.length > 0 ? (
                  selectedAssignmentRounds.map((round) => (
                    <div
                      key={round.id}
                      className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-gray-800">
                            Round {round.roundNumber}
                          </p>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                              round.status === "COMPLETED"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : round.status === "IN_PROGRESS"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : round.status === "CANCELLED"
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                          >
                            {round.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">
                          {formatDateTime(round.scheduledStartAt)} –{" "}
                          {new Intl.DateTimeFormat("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "Asia/Makassar",
                          }).format(new Date(round.scheduledEndAt))}{" "}
                          WITA
                        </p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          {round.checkpoints.length} checkpoint ·{" "}
                          {
                            round.checkpoints.filter(
                              (checkpoint) => checkpoint.required,
                            ).length
                          }{" "}
                          wajib
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAssignmentId(null);
                          onSetupRound(round.id);
                        }}
                        className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#003B73] px-3 text-xs font-semibold text-white transition hover:bg-[#00529C]"
                      >
                        <Setting2 size={15} color="White" />
                        Atur Checkpoint
                        <ArrowRight2 size={14} color="White" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
                    <RouteSquare size={28} className="mx-auto text-gray-300" />
                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      Belum ada rounds untuk assignment ini
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Pastikan tanggal jadwal dan assignment sudah menghasilkan
                      putaran patroli.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-5 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentId(null)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatrolRound;

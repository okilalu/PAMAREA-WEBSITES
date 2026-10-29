import React, { useMemo, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

import { DocumentDownload, Graph, Task } from "iconsax-react";

import { usePatrolRoundsGroupedByUser } from "../hooks/schedule/usePatrolRound";
import { useGetScheduleAssigments } from "../hooks/schedule/usePatrolScheduleAssignment";
import { usePatrolSchedules } from "../hooks/schedule/usePatrolSchedules";

type ShiftFilter = "ALL" | "PAGI" | "SIANG" | "MALAM";
type PeriodFilter = "TODAY" | "WEEK" | "MONTH";

interface PerformanceItem {
  id: string;
  name: string;
  nip: string;
  regu: string;
  score: number;
  completedCheckpoints: number;
  totalCheckpoints: number;
  cp: string;
  badge?: string;
  badgeColor?: string;
}

interface GroupedUser {
  user: {
    id: string;
    fullName?: string | null;
    username?: string | null;
    employeeNumber?: string | null;
  };
  rounds: PatrolRound[];
}

interface PatrolRound {
  id: string;
  assignmentId?: string;
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  status?: string | null;
  assignment?: {
    id?: string;
    scheduleId?: string;
    schedule?: PatrolSchedule;
  } | null;
  scheduleDate?: {
    date?: string | null;
    status?: string | null;
  } | null;
  checkpoints?: PatrolCheckpoint[] | null;
}

interface PatrolCheckpoint {
  id?: string;
  required?: boolean | null;
  status?: string | null;
}

interface PatrolSchedule {
  id: string;
  name?: string | null;
  startTime?: string | null;
  endTime?: string | null;
}

interface PatrolAssignment {
  id: string;
  scheduleId?: string;
  schedule?: PatrolSchedule;
}

interface PeriodRange {
  start: Date;
  end: Date;
}

const TIME_ZONE = "Asia/Makassar";

const SHIFT_OPTIONS: {
  label: string;
  value: ShiftFilter;
}[] = [
  { label: "Semua Shift", value: "ALL" },
  { label: "Shift 1 (Pagi)", value: "PAGI" },
  { label: "Shift 2 (Siang)", value: "SIANG" },
  { label: "Shift 3 (Malam)", value: "MALAM" },
];

const PERIOD_OPTIONS: {
  label: string;
  value: PeriodFilter;
}[] = [
  { label: "Hari Ini", value: "TODAY" },
  { label: "Minggu Ini", value: "WEEK" },
  { label: "Bulan Ini", value: "MONTH" },
];

const SHIFT_LABELS: Record<ShiftFilter, string> = {
  ALL: "Semua Shift",
  PAGI: "Shift 1 (Pagi)",
  SIANG: "Shift 2 (Siang)",
  MALAM: "Shift 3 (Malam)",
};

/**
 * Mengambil array dari berbagai bentuk respons API.
 *
 * Mendukung:
 * 1. [...]
 * 2. { data: [...] }
 * 3. { data: { data: [...] } }
 * 4. AxiosResponse<{ data: [...] }>
 */
const extractArray = <T,>(response: unknown): T[] => {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as Record<string, unknown>;

  if (Array.isArray(result.data)) {
    return result.data as T[];
  }

  if (result.data && typeof result.data === "object") {
    const nested = result.data as Record<string, unknown>;

    if (Array.isArray(nested.data)) {
      return nested.data as T[];
    }
  }

  return [];
};

/**
 * Menghasilkan bagian tanggal YYYY-MM-DD berdasarkan WITA.
 * Tidak menggunakan toISOString() karena itu menghasilkan tanggal UTC.
 */
const getWitaDateKey = (date: Date): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values: Record<string, string> = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return `${values.year}-${values.month}-${values.day}`;
};

/**
 * Mengambil tanggal dan jam berdasarkan WITA.
 */
const getWitaDateTimeParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values: Record<string, string> = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
};

/**
 * Mengubah tanggal kalender WITA menjadi timestamp.
 * Digunakan agar batas periode konsisten meskipun runtime berbeda zona waktu.
 */
const getWitaTimestamp = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): number => {
  return (
    Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000
  );
};

const getPeriodRange = (period: PeriodFilter, now: Date): PeriodRange => {
  const parts = getWitaDateTimeParts(now);

  const todayStart = getWitaTimestamp(parts.year, parts.month, parts.day);

  if (period === "TODAY") {
    return {
      start: new Date(todayStart),
      end: now,
    };
  }

  if (period === "WEEK") {
    const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));

    const dayOfWeek = date.getUTCDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7;

    date.setUTCDate(date.getUTCDate() - daysSinceMonday);

    const start = getWitaTimestamp(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
    );

    return {
      start: new Date(start),
      end: now,
    };
  }

  return {
    start: new Date(getWitaTimestamp(parts.year, parts.month, 1)),
    end: now,
  };
};

const getShiftFromTime = (time?: string | null): ShiftFilter => {
  if (!time) {
    return "ALL";
  }

  const match = time.match(/^(\d{1,2}):(\d{2})/);

  if (!match) {
    return "ALL";
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const timeInMinutes = hour * 60 + minute;

  // Pagi: 07.00–15.59.
  if (timeInMinutes >= 7 * 60 && timeInMinutes < 16 * 60) {
    return "PAGI";
  }

  // Siang/sore: 16.00–21.59.
  if (timeInMinutes >= 16 * 60 && timeInMinutes < 22 * 60) {
    return "SIANG";
  }

  // Malam: 22.00–06.59.
  return "MALAM";
};

const getBadge = (score: number) => {
  if (score >= 95) {
    return {
      badge: "Kinerja Prima",
      badgeColor: "text-yellow-700 bg-yellow-100 border-yellow-200",
    };
  }

  if (score >= 85) {
    return {
      badge: "Kinerja Baik",
      badgeColor: "text-green-700 bg-green-100 border-green-200",
    };
  }

  if (score >= 70) {
    return {
      badge: "Perlu Evaluasi",
      badgeColor: "text-orange-700 bg-orange-100 border-orange-200",
    };
  }

  return {
    badge: "Perlu Pembinaan",
    badgeColor: "text-red-700 bg-red-100 border-red-200",
  };
};

const formatScore = (score: number) => score.toFixed(1);

const formatCheckpointSummary = (completed: number, total: number) => {
  if (total === 0) {
    return "Belum ada data checkpoint";
  }

  const percentage = (completed / total) * 100;

  return `${completed}/${total} CP (${percentage.toFixed(1)}%)`;
};

const escapeCsv = (value: string | number) => {
  const text = String(value).replace(/"/g, '""');

  return `"${text}"`;
};

const RealTimeMonitor = () => {
  const {
    data: patrolRoundsData,
    isLoading: isRoundsLoading,
    isError: isRoundsError,
    refetch: refetchRounds,
  } = usePatrolRoundsGroupedByUser();

  const {
    data: assignmentsData,
    isLoading: isAssignmentsLoading,
    isError: isAssignmentsError,
  } = useGetScheduleAssigments();

  const {
    data: schedulesData,
    isLoading: isSchedulesLoading,
    isError: isSchedulesError,
  } = usePatrolSchedules();

  const [activeShift, setActiveShift] = useState<ShiftFilter>("ALL");
  const [activeRange, setActiveRange] = useState<PeriodFilter>("TODAY");
  const [selectedUser, setSelectedUser] = useState("ALL");

  const isLoading =
    isRoundsLoading || isAssignmentsLoading || isSchedulesLoading;

  const hasError = isRoundsError || isAssignmentsError || isSchedulesError;

  // Memperbarui waktu saat filter atau render berubah.
  const now = new Date();

  const groupedUsers = useMemo<GroupedUser[]>(() => {
    return extractArray<GroupedUser>(patrolRoundsData);
  }, [patrolRoundsData]);

  const schedules = useMemo<PatrolSchedule[]>(() => {
    return extractArray<PatrolSchedule>(schedulesData);
  }, [schedulesData]);

  const assignments = useMemo<PatrolAssignment[]>(() => {
    return extractArray<PatrolAssignment>(assignmentsData);
  }, [assignmentsData]);

  const scheduleLookup = useMemo(() => {
    const lookup = new Map<string, PatrolSchedule>();

    schedules.forEach((schedule) => {
      if (schedule?.id) {
        lookup.set(schedule.id, schedule);
      }
    });

    return lookup;
  }, [schedules]);

  const assignmentLookup = useMemo(() => {
    const lookup = new Map<string, PatrolAssignment>();

    assignments.forEach((assignment) => {
      if (assignment?.id) {
        lookup.set(assignment.id, assignment);
      }
    });

    return lookup;
  }, [assignments]);

  const rankingResult = useMemo(() => {
    const periodRange = getPeriodRange(activeRange, now);

    const performance: PerformanceItem[] = [];

    const diagnostics = {
      totalUsers: groupedUsers.length,
      usersSelected: 0,
      roundsSeen: 0,
      roundsInPeriod: 0,
      roundsFinished: 0,
      roundsMatchingShift: 0,
      roundsWithCheckpoints: 0,
      checkpointsSeen: 0,
      checkpointsCompleted: 0,
      usersWithScore: 0,
    };

    groupedUsers.forEach((group) => {
      const user = group?.user;

      if (!user?.id) {
        return;
      }

      if (selectedUser !== "ALL" && user.id !== selectedUser) {
        return;
      }

      diagnostics.usersSelected += 1;

      const rounds = Array.isArray(group.rounds) ? group.rounds : [];

      let completedCheckpoints = 0;
      let totalCheckpoints = 0;

      const scheduleNames = new Set<string>();

      rounds.forEach((round) => {
        diagnostics.roundsSeen += 1;

        const scheduledStartAt = round?.scheduledStartAt
          ? new Date(round.scheduledStartAt)
          : null;

        const scheduledEndAt = round?.scheduledEndAt
          ? new Date(round.scheduledEndAt)
          : null;

        if (!scheduledStartAt || Number.isNaN(scheduledStartAt.getTime())) {
          return;
        }

        // Filter menggunakan timestamp periode WITA.
        if (
          scheduledStartAt.getTime() < periodRange.start.getTime() ||
          scheduledStartAt.getTime() > periodRange.end.getTime()
        ) {
          return;
        }

        diagnostics.roundsInPeriod += 1;

        // Ronde yang dibatalkan tidak dinilai.
        if (round.status === "CANCELLED") {
          return;
        }

        // Ronde mendatang tidak dihitung sebagai kinerja.
        if (scheduledStartAt.getTime() > now.getTime()) {
          return;
        }

        // Ronde yang belum jatuh tempo tidak dinilai.
        if (
          scheduledEndAt &&
          !Number.isNaN(scheduledEndAt.getTime()) &&
          scheduledEndAt.getTime() > now.getTime()
        ) {
          return;
        }

        /*
         * Hanya ronde yang sudah selesai atau sudah melewati
         * waktu akhirnya yang dapat masuk penilaian.
         *
         * Ronde yang sudah melewati jadwal akhir tetapi statusnya
         * PENDING tetap dapat dinilai sebagai ronde jatuh tempo.
         * Namun checkpoint yang belum COMPLETED mendapat nilai 0.
         */
        diagnostics.roundsFinished += 1;

        const assignment =
          round.assignment ?? assignmentLookup.get(round.assignmentId ?? "");

        const schedule =
          assignment?.schedule ??
          scheduleLookup.get(assignment?.scheduleId ?? "");

        const shiftTime =
          schedule?.startTime ??
          scheduledStartAt.toLocaleTimeString("en-GB", {
            timeZone: TIME_ZONE,
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          });

        const roundShift = getShiftFromTime(shiftTime);

        if (activeShift !== "ALL" && roundShift !== activeShift) {
          return;
        }

        diagnostics.roundsMatchingShift += 1;

        if (schedule?.name) {
          scheduleNames.add(schedule.name);
        }

        const checkpoints = Array.isArray(round.checkpoints)
          ? round.checkpoints
          : [];

        if (checkpoints.length > 0) {
          diagnostics.roundsWithCheckpoints += 1;
        }

        checkpoints.forEach((checkpoint) => {
          diagnostics.checkpointsSeen += 1;

          // Checkpoint opsional tidak masuk penilaian.
          if (checkpoint.required === false) {
            return;
          }

          // Checkpoint dibatalkan tidak masuk penilaian.
          if (checkpoint.status === "CANCELLED") {
            return;
          }

          totalCheckpoints += 1;

          if (checkpoint.status === "COMPLETED") {
            completedCheckpoints += 1;
            diagnostics.checkpointsCompleted += 1;
          }
        });
      });

      // Tidak meranking personel jika tidak ada checkpoint wajib.
      if (totalCheckpoints === 0) {
        return;
      }

      diagnostics.usersWithScore += 1;

      const score = (completedCheckpoints / totalCheckpoints) * 100;

      const badgeInfo = getBadge(score);

      performance.push({
        id: user.id,
        name: user.fullName || user.username || "Tanpa Nama",
        nip: user.employeeNumber || "-",
        regu:
          scheduleNames.size > 0
            ? Array.from(scheduleNames).join(", ")
            : "Belum ada jadwal",
        score,
        completedCheckpoints,
        totalCheckpoints,
        cp: formatCheckpointSummary(completedCheckpoints, totalCheckpoints),
        ...badgeInfo,
      });
    });

    performance.sort((a, b) => b.score - a.score);

    return {
      performance,
      diagnostics,
    };
  }, [
    groupedUsers,
    assignmentLookup,
    scheduleLookup,
    activeRange,
    activeShift,
    selectedUser,
    now,
  ]);

  const rankingData = rankingResult.performance;

  const chartData = useMemo(() => {
    return rankingData.map((person, index) => ({
      id: person.id,
      name:
        person.name.length > 15
          ? `${person.name.slice(0, 13)}...`
          : person.name,
      fullName: person.name,
      regu: person.regu,
      score: person.score,
      isTop: index === 0,
    }));
  }, [rankingData]);

  const averageScore = useMemo(() => {
    if (rankingData.length === 0) {
      return 0;
    }

    const totalScore = rankingData.reduce(
      (total, person) => total + person.score,
      0,
    );

    return totalScore / rankingData.length;
  }, [rankingData]);

  const topPerformer = rankingData[0];

  const totalCompletedCheckpoints = rankingData.reduce(
    (total, person) => total + person.completedCheckpoints,
    0,
  );

  const totalCheckpoints = rankingData.reduce(
    (total, person) => total + person.totalCheckpoints,
    0,
  );

  const overallCompletion =
    totalCheckpoints > 0
      ? (totalCompletedCheckpoints / totalCheckpoints) * 100
      : 0;

  const periodLabel = {
    TODAY: "Hari Ini",
    WEEK: "Minggu Ini",
    MONTH: "Bulan Ini",
  }[activeRange];

  const handleDownloadReport = () => {
    if (rankingData.length === 0) {
      return;
    }

    const headers = [
      "Peringkat",
      "Nama Satpam",
      "Nomor Pegawai",
      "Jadwal/Regu",
      "Skor Kinerja (%)",
      "Checkpoint Selesai",
      "Total Checkpoint",
      "Kepatuhan Checkpoint (%)",
      "Periode",
      "Shift",
    ];

    const rows = rankingData.map((person, index) => [
      index + 1,
      person.name,
      person.nip,
      person.regu,
      formatScore(person.score),
      person.completedCheckpoints,
      person.totalCheckpoints,
      ((person.completedCheckpoints / person.totalCheckpoints) * 100).toFixed(
        1,
      ),
      periodLabel,
      SHIFT_LABELS[activeShift],
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `rekap-kinerja-satpam-${activeRange.toLowerCase()}-${getWitaDateKey(
      new Date(),
    )}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="px-6 flex justify-between items-center breadcrumbs text-sm bg-white border-b border-gray-200 h-14">
        <ul className="flex gap-2 mt-2">
          <li>
            <a className="text-gray-700 font-semibold cursor-pointer">
              Dashboard
            </a>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li>
            <a className="text-gray-700 font-semibold cursor-pointer">
              Command Center
            </a>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-gray-700 font-semibold">Real-Time Monitor</li>
        </ul>

        <div className="flex gap-2 items-center">
          <div className="bg-black rounded-full px-2 py-1 w-8 h-8 flex items-center justify-center">
            <p className="text-white text-sm font-bold">LO</p>
          </div>

          <div>
            <h2 className="text-gray-800 text-sm font-semibold leading-tight">
              Lalu Oki
            </h2>
            <p className="text-gray-500 text-xs tracking-wider">
              Chief Patrol Supervisor
            </p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Header Dashboard */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-[#00529C] px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">
                Analisis Kinerja Satpam &amp; Laporan Temuan
              </h1>
            </div>

            <p className="text-gray-600 tracking-wide text-sm mt-1">
              Analisis kepatuhan checkpoint berdasarkan data ronde patroli yang
              telah jatuh tempo.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center gap-3">
            <div className="flex flex-wrap items-center gap-3 text-sm bg-white p-3 rounded-lg border border-gray-100">
              <span className="text-gray-500 font-medium">Shift:</span>

              <div className="flex flex-wrap bg-gray-100 p-1 rounded-lg gap-1">
                {SHIFT_OPTIONS.map((shift) => (
                  <button
                    key={shift.value}
                    onClick={() => setActiveShift(shift.value)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors text-xs ${
                      activeShift === shift.value
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {shift.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm bg-white p-3 rounded-lg border border-gray-100">
              <span className="text-gray-500 font-medium">Rentang:</span>

              <div className="flex bg-gray-100 p-1 rounded-lg">
                {PERIOD_OPTIONS.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setActiveRange(period.value)}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                      activeRange === period.value
                        ? "bg-yellow-400 text-yellow-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-2">
              Rata-rata Skor Kinerja
            </p>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-800">
                {formatScore(averageScore)}
              </span>
              <span className="text-sm font-semibold text-slate-500">/100</span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {rankingData.length} personel dinilai
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-2">
              Top Performer
            </p>

            <h3 className="text-2xl font-bold text-slate-800">
              {topPerformer?.name ?? "-"}
            </h3>

            <p className="text-sm text-yellow-600 font-medium mt-2">
              {topPerformer
                ? `Skor ${formatScore(topPerformer.score)} · ${topPerformer.cp}`
                : "Belum ada data kinerja"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-2">
              Penyelesaian Checkpoint
            </p>

            <h3 className="text-3xl font-bold text-slate-800">
              {overallCompletion.toFixed(1)}%
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {totalCompletedCheckpoints} dari {totalCheckpoints} checkpoint
              selesai
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white border border-gray-100 rounded-xl p-8 my-4 flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm text-gray-500 mt-3">
              Mengambil data kinerja patroli...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && hasError && (
          <div className="bg-white border border-red-100 rounded-xl p-6 my-4">
            <p className="font-semibold text-red-700">
              Gagal mengambil data analytics.
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Periksa koneksi API dan endpoint ronde patroli, assignment, serta
              jadwal.
            </p>

            <button
              onClick={() => void refetchRounds()}
              className="btn btn-sm btn-outline btn-error mt-4"
            >
              Coba Muat Ulang Ronde
            </button>
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            {/* Main Content: Chart & Ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
              {/* Performance Chart */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-8">
                  <div className="flex items-center gap-2">
                    <Graph
                      className="text-blue-600"
                      size={24}
                      color="blue"
                      variant="Bulk"
                    />

                    <h2 className="text-lg font-bold text-gray-800">
                      Grafik Perbandingan Skor Kinerja Satpam
                    </h2>
                  </div>

                  <div className="flex gap-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-slate-700 rounded-sm" />
                      Skor Kinerja
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
                      Peringkat #1
                    </div>
                  </div>
                </div>

                {chartData.length > 0 ? (
                  <div className="flex-1 w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 12,
                          left: -20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />

                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 11,
                            fill: "#64748b",
                            fontWeight: 600,
                          }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                          height={55}
                        />

                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "#64748b",
                          }}
                          tickFormatter={(value) => `${value}%`}
                        />

                        <Tooltip
                          cursor={{ fill: "#f8fafc" }}
                          formatter={(value: number | undefined) => [
                            `${Number(value ?? 0).toFixed(1)}%`,
                            "Skor Kinerja",
                          ]}
                          labelFormatter={(label, payload) => {
                            const item = payload?.[0]?.payload;

                            return item
                              ? `${item.fullName} · ${item.regu}`
                              : label;
                          }}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />

                        <Bar
                          dataKey="score"
                          name="Skor Kinerja"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={50}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={entry.id}
                              fill={
                                index === 0
                                  ? "#facc15"
                                  : index < 3
                                    ? "#1e3a8a"
                                    : "#64748b"
                              }
                            />
                          ))}

                          <LabelList
                            dataKey="score"
                            position="top"
                            fill="#334155"
                            fontSize={11}
                            fontWeight={600}
                            formatter={(value) => `${Number(value).toFixed(1)}`}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-center">
                    <Graph size={36} className="text-gray-300 mb-3" />

                    <p className="text-gray-700 font-semibold">
                      Belum ada data kinerja
                    </p>

                    <p className="text-sm text-gray-500 mt-1 max-w-sm">
                      Tidak ada ronde dengan checkpoint yang dapat dinilai pada{" "}
                      {periodLabel.toLowerCase()} untuk filter yang dipilih.
                    </p>

                    <p className="text-xs text-gray-400 mt-3">
                      Personel: {groupedUsers.length} · Ronde jatuh tempo sesuai
                      filter: {rankingResult.diagnostics.roundsMatchingShift}
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-500">
                  <p>
                    Skor = checkpoint wajib berstatus COMPLETED dibagi seluruh
                    checkpoint wajib yang dinilai, dikali 100%.
                  </p>

                  <p>
                    Ronde yang belum jatuh tempo dan ronde CANCELLED tidak masuk
                    perhitungan. Skor ini belum mencakup SLA maupun checklist
                    K3.
                  </p>

                  <p>
                    Semua filter tanggal menggunakan zona waktu WITA
                    (Asia/Makassar).
                  </p>
                </div>
              </div>

              {/* Ranking Table */}
              <div className="lg:col-span-5 bg-gray-50 rounded-xl flex flex-col">
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Task
                        className="text-slate-600"
                        size={22}
                        color="orange"
                      />

                      <h2 className="text-lg font-bold text-gray-800">
                        Tabel Peringkat Satpam
                      </h2>
                    </div>

                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
                      {rankingData.length} Personel
                    </span>
                  </div>

                  {/* Filter Personel */}
                  <div className="mb-4">
                    <label
                      htmlFor="filter-personel"
                      className="block text-xs font-medium text-gray-500 mb-1.5"
                    >
                      Filter Personel
                    </label>

                    <select
                      id="filter-personel"
                      value={selectedUser}
                      onChange={(event) => setSelectedUser(event.target.value)}
                      className="select select-bordered select-sm w-full bg-white"
                    >
                      <option value="ALL">Semua Personel</option>

                      {groupedUsers.map((group) => (
                        <option key={group.user.id} value={group.user.id}>
                          {group.user.fullName ||
                            group.user.username ||
                            "Tanpa Nama"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    {rankingData.length > 0 ? (
                      rankingData.map((person, index) => {
                        const isFirst = index === 0;

                        return (
                          <div
                            key={person.id}
                            className={`flex items-center justify-between gap-3 p-4 rounded-xl border ${
                              isFirst
                                ? "border-yellow-400 bg-white shadow-sm"
                                : "border-gray-100 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full font-bold text-sm ${
                                  isFirst
                                    ? "bg-yellow-400 text-yellow-900"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {index + 1}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-bold text-gray-800 break-words">
                                    {person.name}
                                  </p>

                                  {person.badge && (
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${person.badgeColor}`}
                                    >
                                      {person.badge}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-gray-500 font-mono mt-0.5 break-all">
                                  NIP: {person.nip}
                                </p>

                                <p className="text-xs text-gray-500 mt-1 break-words">
                                  Jadwal: {person.regu}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <p
                                className={`text-lg font-bold ${
                                  isFirst ? "text-slate-800" : "text-slate-700"
                                }`}
                              >
                                {formatScore(person.score)}
                              </p>

                              <p
                                className={`text-xs font-medium ${
                                  person.score >= 85
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {person.cp}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-10 text-center">
                        <Task
                          size={32}
                          className="text-gray-300 mx-auto mb-3"
                        />

                        <p className="text-sm font-semibold text-gray-700">
                          Belum ada peringkat
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Coba pilih periode atau shift yang berbeda.
                        </p>

                        <p className="text-xs text-gray-400 mt-3">
                          Pengguna API: {groupedUsers.length} · Ronde diperiksa:{" "}
                          {rankingResult.diagnostics.roundsSeen} · Ronde sesuai
                          periode: {rankingResult.diagnostics.roundsInPeriod} ·
                          Ronde jatuh tempo:{" "}
                          {rankingResult.diagnostics.roundsFinished} · Ronde
                          dengan checkpoint:{" "}
                          {rankingResult.diagnostics.roundsWithCheckpoints}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs">
                    <span className="text-gray-500">
                      Periode: {periodLabel}
                    </span>

                    <button
                      onClick={handleDownloadReport}
                      disabled={rankingData.length === 0}
                      className="flex items-center justify-center gap-1.5 text-blue-600 font-bold hover:text-blue-800 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Download Rekap Nilai
                      <DocumentDownload size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RealTimeMonitor;

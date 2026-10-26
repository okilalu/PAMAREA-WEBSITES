import {
  AddCircle,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  People,
  Send,
} from "iconsax-react";
import React, { useState } from "react";
import AssignmentRouteManager from "../../components/schedule/AssignmentRouteManager";
import type {
  AssignmentRouteOption,
  PatrolPointOption,
} from "../../types/schedule/assignment-route";

import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { usePatrolPoints } from "../../hooks/patrol-point/usePatrolPoints";
import {
  useBulkAssignUser,
  useCreateScheduleAssigment,
  useGetScheduleAssigments,
} from "../../hooks/schedule/usePatrolScheduleAssignment";
import {
  useAddScheduleAssignment,
  useCreatePatrolSchedule,
  usePatrolSchedules,
} from "../../hooks/schedule/usePatrolSchedules";
import { useScheduleContext } from "../../hooks/schedule/useScheduleContext";
import { useCreatePatrolScheduleDates } from "../../hooks/schedule/useScheduleDates";
import { useSecurityUsers } from "../../hooks/users/useUsers";

import axios from "axios";
import { useSetAssignmentRoute } from "../../hooks/schedule/usePatrolScheduleAssignmentRoute";
import type {
  AddScheduleAssignmentPayload,
  BulkAssignUserPayload,
  CreatePatrolSchedulePayload,
  CreateScheduleAssignmentPayload,
  CreateScheduleDatesPayload,
  CreateSchedulePointInput,
} from "../../types";

const ScheduleManage = () => {
  const { user } = useAuthContext();
  const siteId = user?.siteId;

  const { schedule, setSchedule } = useScheduleContext();
  const scheduleId = schedule?.scheduleId;

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: patrolPoint } = usePatrolPoints();
  const { data: patrolSchedules } = usePatrolSchedules();
  const { data: userSecurity } = useSecurityUsers();
  const { data: scheduleAssignment } = useGetScheduleAssigments();

  const { mutateAsync: createPS, isPending: isCreatingSchedule } =
    useCreatePatrolSchedule();
  const { mutateAsync: createDates } = useCreatePatrolScheduleDates();
  const { mutateAsync: createAssignment, isPending: isAssigning } =
    useAddScheduleAssignment();
  const { mutateAsync: setAssignmentRoute } = useSetAssignmentRoute();
  const { mutateAsync: assignUser } = useCreateScheduleAssigment();

  const { mutateAsync: bulkUser, isPending: isBulkAssigning } =
    useBulkAssignUser();

  // =========================================================
  // STATE
  // =========================================================

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [createdAssignmentIds, setCreatedAssignmentIds] = useState<string[]>(
    [],
  );
  const [routePointIds, setRoutePointIds] = useState<string[]>([]);
  const [isSavingRoute, setIsSavingRoute] = useState(false);
  const [createdScheduleId, setCreatedScheduleId] = useState<string | null>(
    null,
  );

  const [selectedSecurityIds, setSelectedSecurityIds] = useState<string[]>([]);

  const [isCreatingDates, setIsCreatingDates] = useState(false);

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState(120);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState(30);
  const [enforceSequence, setEnforceSequence] = useState(false);

  const [points, setPoints] = useState<CreateSchedulePointInput[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [rangeStart, setRangeStart] = useState(toDateInputValue(today));
  const [rangeEnd, setRangeEnd] = useState(toDateInputValue(today));
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [search, setSearch] = useState({
    security: "",
    secondSecurity: "",
    singleSecurity: "",
  });

  // =========================================================
  // DATA
  // =========================================================

  const assignment = scheduleAssignment ?? [];

  const activePatrolPoints =
    patrolPoint?.filter((point) => point.status === "ACTIVE") ?? [];

  const allSchedules = patrolSchedules?.data ?? [];

  // Data untuk pengaturan rute per assignment.
  // ID yang dipakai adalah ID assignment, bukan userId atau scheduleId.
  const routeAssignments: AssignmentRouteOption[] = assignment.map((item) => ({
    id: item.id,
    userId: item.userId,
    scheduleId: item.scheduleId,
    status: item.status,
    user: item.user
      ? {
          fullName: item.user.fullName,
          employeeNumber: item.user.employeeNumber,
        }
      : undefined,
    schedule: allSchedules.find(
      (scheduleItem) => scheduleItem.id === item.scheduleId,
    )
      ? {
          name: allSchedules.find(
            (scheduleItem) => scheduleItem.id === item.scheduleId,
          )?.name,
          startTime: allSchedules.find(
            (scheduleItem) => scheduleItem.id === item.scheduleId,
          )?.startTime,
          endTime: allSchedules.find(
            (scheduleItem) => scheduleItem.id === item.scheduleId,
          )?.endTime,
        }
      : undefined,
  }));

  const routePatrolPoints: PatrolPointOption[] = (patrolPoint ?? []).map(
    (point) => ({
      id: point.id,
      name: point.name,
      code: point.code,
      status: point.status,
    }),
  );

  const activeSchedule = allSchedules.filter(
    (item) => item.status === "ACTIVE",
  );

  const draftSchedule = allSchedules.filter((item) => item.status === "DRAFT");

  const activeSecurity =
    userSecurity?.data.filter((item) => item.status === "ACTIVE") ?? [];

  const searchSecurity = activeSecurity.filter((item) => {
    const keyword = search.singleSecurity.trim().toLowerCase();

    return (
      item.fullName.toLowerCase().includes(keyword) ||
      (item.employeeNumber ?? "").toLowerCase().includes(keyword)
    );
  });

  const formattedDate = currentDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // =========================================================
  // HELPERS
  // =========================================================

  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;

    if (modal && !modal.open) {
      modal.showModal();
    }
  };

  const closeModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;

    if (modal?.open) {
      modal.close();
    }
  };

  const toggleScheduleSelection = (id: string) => {
    setSelectedScheduleIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const toggleAllSchedules = () => {
    const ids = activeSchedule.map((item) => item.id);

    const allSelected =
      ids.length > 0 && ids.every((id) => selectedScheduleIds.includes(id));

    setSelectedScheduleIds((previous) =>
      allSelected
        ? previous.filter((id) => !ids.includes(id))
        : [...new Set([...previous, ...ids])],
    );
  };

  // =========================================================
  // DATE NAVIGATION
  // =========================================================

  const handlePrevDate = () => {
    setCurrentDate((previous) => {
      const next = new Date(previous);
      next.setDate(next.getDate() - 1);
      return next;
    });
  };

  const handleNextDate = () => {
    setCurrentDate((previous) => {
      const next = new Date(previous);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  // =========================================================
  // CREATE SCHEDULE - STEP 1
  // =========================================================

  const handleSelectOne = (patrolPointId: string) => {
    setPoints((previous) => {
      if (previous.some((item) => item.patrolPointId === patrolPointId)) {
        return previous.filter((item) => item.patrolPointId !== patrolPointId);
      }

      return [...previous, { patrolPointId, required: true }];
    });
  };

  const handleSelectAllPoints = () => {
    if (activePatrolPoints.length === 0) return;

    const allSelected = activePatrolPoints.every((point) =>
      points.some((item) => item.patrolPointId === point.id),
    );

    if (allSelected) {
      setPoints((previous) =>
        previous.filter(
          (item) =>
            !activePatrolPoints.some(
              (point) => point.id === item.patrolPointId,
            ),
        ),
      );
      return;
    }

    setPoints((previous) => {
      const selectedIds = new Set(previous.map((item) => item.patrolPointId));

      const additions = activePatrolPoints
        .filter((point) => !selectedIds.has(point.id))
        .map((point) => ({
          patrolPointId: point.id,
          required: true,
        }));

      return [...previous, ...additions];
    });
  };

  const createPatrolSchedule = async () => {
    if (!siteId) {
      alert("Site pengguna tidak ditemukan.");
      return;
    }

    if (!name.trim()) {
      alert("Nama jadwal wajib diisi.");
      return;
    }

    if (!startTime || !endTime) {
      alert("Waktu mulai dan selesai wajib diisi.");
      return;
    }

    if (startTime === endTime) {
      alert("Waktu mulai dan selesai tidak boleh sama.");
      return;
    }

    if (intervalMinutes < 1) {
      alert("Interval patroli minimal 1 menit.");
      return;
    }

    if (points.length === 0) {
      alert("Pilih minimal satu titik patroli.");
      return;
    }

    const payload: CreatePatrolSchedulePayload = {
      siteId,
      name: name.trim(),
      startTime,
      endTime,
      intervalMinutes,
      gracePeriodMinutes,
      enforceSequence,
      points,
    };

    try {
      const response = await createPS(payload);

      if (!response.id) {
        throw new Error("ID jadwal tidak ditemukan pada response API.");
      }

      setCreatedScheduleId(response.id);
      setRoutePointIds(points.map((point) => point.patrolPointId));
      setCurrentStep(2);
    } catch (error) {
      console.error("Gagal membuat jadwal patroli:", error);
      alert("Gagal membuat jadwal patroli.");
    }
  };

  // =========================================================
  // CREATE SCHEDULE - STEP 2
  // =========================================================

  const applyDateRange = (startValue: string, endValue: string) => {
    if (!startValue || !endValue) {
      alert("Tanggal mulai dan tanggal selesai wajib diisi.");
      return;
    }
    if (endValue < startValue) {
      alert("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }
    if (selectedWeekdays.length === 0) {
      alert("Pilih minimal satu hari pelaksanaan.");
      return;
    }

    const result: string[] = [];
    const cursor = new Date(`${startValue}T12:00:00`);
    const end = new Date(`${endValue}T12:00:00`);
    while (cursor <= end) {
      if (selectedWeekdays.includes(cursor.getDay())) {
        result.push(toDateInputValue(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (result.length === 0) {
      alert("Tidak ada tanggal yang sesuai dengan hari yang dipilih.");
      return;
    }
    setDates(result);
  };

  const applyWeekPreset = () => {
    const start = new Date();
    start.setHours(12, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const startValue = toDateInputValue(start);
    const endValue = toDateInputValue(end);
    setRangeStart(startValue);
    setRangeEnd(endValue);
    applyDateRange(startValue, endValue);
  };

  const applyMonthPreset = () => {
    const start = new Date();
    start.setHours(12, 0, 0, 0);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 12);
    const startValue = toDateInputValue(start);
    const endValue = toDateInputValue(end);
    setRangeStart(startValue);
    setRangeEnd(endValue);
    applyDateRange(startValue, endValue);
  };

  const toggleWeekday = (weekday: number) => {
    setSelectedWeekdays((previous) =>
      previous.includes(weekday)
        ? previous.filter((day) => day !== weekday)
        : [...previous, weekday].sort((a, b) => a - b),
    );
  };

  const createScheduleDates = async () => {
    if (!createdScheduleId) {
      alert("ID jadwal patroli tidak ditemukan.");
      return;
    }

    if (dates.length === 0) {
      alert("Pilih minimal satu tanggal.");
      return;
    }

    const payload: CreateScheduleDatesPayload = { dates };

    setIsCreatingDates(true);

    try {
      await createDates({
        scheduleId: createdScheduleId,
        payload,
      });

      setCurrentStep(3);
    } catch (error) {
      console.error("Gagal menyimpan tanggal patroli:", error);
      alert("Gagal menyimpan tanggal patroli.");
    } finally {
      setIsCreatingDates(false);
    }
  };

  // =========================================================
  // CREATE SCHEDULE - STEP 3
  // =========================================================

  const handleSelectSecurity = (id: string) => {
    setSelectedSecurityIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const handleCloseCreateModal = () => {
    closeModal("patrol_schedules");

    setCurrentStep(1);
    setCreatedScheduleId(null);
    setCreatedAssignmentIds([]);
    setRoutePointIds([]);
    setName("");
    setStartTime("");
    setEndTime("");
    setIntervalMinutes(120);
    setGracePeriodMinutes(30);
    setEnforceSequence(false);
    setPoints([]);
    setDates([]);
    setRangeStart(toDateInputValue(new Date()));
    setRangeEnd(toDateInputValue(new Date()));
    setSelectedWeekdays([0, 1, 2, 3, 4, 5, 6]);
    setRoutePointIds([]);
    setCreatedAssignmentIds([]);
    setSelectedSecurityIds([]);
  };

  const createScheduleAssignment = async () => {
    if (!createdScheduleId) {
      alert("ID jadwal patroli tidak ditemukan.");
      return;
    }

    if (dates.length === 0) {
      alert("Tanggal pelaksanaan belum dipilih.");
      return;
    }

    if (selectedSecurityIds.length === 0) {
      alert("Pilih minimal satu petugas.");
      return;
    }

    const sortedDates = [...dates].sort();
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];

    try {
      const assignmentIds: string[] = [];

      for (const userId of selectedSecurityIds) {
        const payload: AddScheduleAssignmentPayload = {
          userId,
          startDate: firstDate,
          endDate: lastDate,
        };

        const response = await createAssignment({
          scheduleId: createdScheduleId,
          payload,
        });

        // Endpoint assignment umumnya mengembalikan { id }; dukung juga
        // response terbungkus { assignment: { id } } atau { assignmentId }.
        const result = response as unknown as {
          id?: string;
          assignmentId?: string;
          assignment?: { id?: string };
          data?: { id?: string; assignmentId?: string };
        };
        const id =
          result?.id ??
          result?.assignmentId ??
          result?.assignment?.id ??
          result?.data?.id ??
          result?.data?.assignmentId;
        if (id) assignmentIds.push(id);
      }

      if (assignmentIds.length !== selectedSecurityIds.length) {
        alert(
          "Assignment berhasil dibuat, tetapi ID assignment tidak seluruhnya dikembalikan API. Periksa response endpoint create assignment sebelum menyimpan rute.",
        );
        return;
      }

      setCreatedAssignmentIds(assignmentIds);
      setCurrentStep(4);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Pesan backend:", error.response?.data);
        console.error("Payload yang dikirim:", error.config?.data);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const moveRoutePoint = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= routePointIds.length) return;

    setRoutePointIds((previous) => {
      const next = [...previous];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const saveCreatedAssignmentRoutes = async () => {
    if (createdAssignmentIds.length === 0) {
      alert(
        "ID assignment belum tersedia. Pastikan endpoint create assignment mengembalikan ID assignment.",
      );
      return;
    }
    if (routePointIds.length === 0) {
      alert("Pilih minimal satu titik untuk rute patroli.");
      return;
    }

    setIsSavingRoute(true);
    try {
      const payload = {
        points: routePointIds.map((patrolPointId) => ({ patrolPointId })),
      };
      for (const assignmentId of createdAssignmentIds) {
        await setAssignmentRoute({ assignmentId, payload });
      }
      alert(
        "Jadwal, tanggal, petugas, dan urutan rute patroli berhasil disimpan.",
      );
      handleCloseCreateModal();
    } catch (error) {
      console.error("Gagal menyimpan rute assignment:", error);
      alert(
        "Assignment sudah dibuat, tetapi rute gagal disimpan. Kamu bisa mencoba lagi.",
      );
    } finally {
      setIsSavingRoute(false);
    }
  };

  // =========================================================
  // QUICK ASSIGNMENT
  // =========================================================

  const createSingleData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!scheduleId) {
      alert("Pilih shift terlebih dahulu.");
      return;
    }

    if (!selectedUserId || !startDate) {
      alert("Satpam dan tanggal mulai wajib dipilih.");
      return;
    }

    if (endDate && endDate < startDate) {
      alert("Tanggal akhir tidak boleh sebelum tanggal mulai.");
      return;
    }

    const payload: CreateScheduleAssignmentPayload = {
      userId: selectedUserId,
      startDate,
      endDate: endDate || null,
    };

    try {
      await assignUser({ scheduleId, payload });

      setStartDate("");
      setEndDate("");
      setSelectedUserId("");

      alert("Penugasan berhasil dibuat.");
    } catch (error) {
      console.error("Gagal membuat penugasan:", error);
      alert("Gagal membuat penugasan.");
    }
  };

  // =========================================================
  // BULK ASSIGNMENT
  // =========================================================

  const handleBulkAssign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedUserId) {
      alert("Pilih satpam terlebih dahulu.");
      return;
    }

    if (selectedScheduleIds.length === 0) {
      alert("Pilih minimal satu shift.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Tanggal mulai dan selesai wajib diisi.");
      return;
    }

    if (endDate < startDate) {
      alert("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    const payload: BulkAssignUserPayload = {
      userId: selectedUserId,
      assignments: selectedScheduleIds.map((id) => ({
        scheduleId: id,
        startDate,
        endDate,
      })),
    };

    try {
      await bulkUser(payload);

      setSelectedUserId("");
      setSelectedScheduleIds([]);
      setStartDate("");
      setEndDate("");
      setSearch((previous) => ({
        ...previous,
        security: "",
      }));

      closeModal("patrol_schedules_assignment");
      alert("Penugasan roster berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan bulk assignment:", error);
      alert("Gagal menyimpan penugasan roster.");
    }
  };

  // =========================================================
  // SHARED STYLES
  // =========================================================

  const inputClass =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100";

  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#f5cf32] px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-[#e9c229] disabled:cursor-not-allowed disabled:opacity-50";

  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-800">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <span>Operasional</span>
              <span>/</span>
              <span className="text-slate-700">Jadwal & Roster</span>
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Jadwal Patroli & Shift
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Pengelolaan jadwal patroli dan penugasan petugas keamanan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
              <button
                type="button"
                onClick={handlePrevDate}
                aria-label="Tanggal sebelumnya"
                className="text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft2 size={16} color="gray" />
              </button>

              <div className="flex items-center gap-2">
                <Calendar size={16} color="#64748b" />
                <span className="text-sm font-medium text-slate-700">
                  {formattedDate}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextDate}
                aria-label="Tanggal berikutnya"
                className="text-slate-500 hover:text-slate-900"
              >
                <ArrowRight2 size={16} color="gray" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => openModal("patrol_schedules_assignment")}
              className={secondaryButton}
            >
              <People size={17} color="gray" />
              Buat Roster
            </button>

            <button
              type="button"
              onClick={() => openModal("patrol_schedules")}
              className={primaryButton}
            >
              <AddCircle size={17} color="black" />
              Jadwal Baru
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-6 px-5 py-6 lg:px-8">
        {/* SUMMARY */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Shift aktif",
              value: activeSchedule.length,
              detail: "Jadwal operasional",
            },
            {
              label: "Draft",
              value: draftSchedule.length,
              detail: "Menunggu aktivasi",
            },
            {
              label: "Petugas aktif",
              value: activeSecurity.length,
              detail: "Terdaftar di lokasi",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4"
            >
              <p className="text-sm text-slate-500">{item.label}</p>

              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-3xl font-semibold tracking-tight text-slate-900">
                  {item.value}
                </span>

                <span className="pb-1 text-xs text-slate-500">
                  {item.detail}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* ASSIGNMENT ROUTE MANAGEMENT */}
        <section>
          <AssignmentRouteManager
            assignments={routeAssignments}
            patrolPoints={routePatrolPoints}
          />
        </section>

        {/* SHIFT + QUICK ASSIGNMENT */}
        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* QUICK ASSIGNMENT */}
          <aside className="min-w-0 rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Penugasan Cepat
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tetapkan petugas pada jadwal terpilih.
              </p>
            </div>

            <form onSubmit={createSingleData} className="space-y-4 p-5">
              <div>
                <label className={labelClass}>Shift target</label>

                <div className="dropdown dropdown-bottom w-full">
                  <button
                    type="button"
                    tabIndex={0}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-left text-sm hover:bg-slate-50"
                  >
                    <span
                      className={
                        schedule?.name
                          ? "font-medium text-slate-800"
                          : "text-slate-400"
                      }
                    >
                      {schedule?.name || "Pilih shift"}
                    </span>
                    <ArrowDown2 size={16} color="#64748b" />
                  </button>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu z-20 mt-1 max-h-60 w-full flex-nowrap overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                  >
                    {activeSchedule.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSchedule({
                              ...schedule,
                              id: item.id,
                              scheduleId: item.id,
                              name: item.name,
                            });
                          }}
                          className="text-sm"
                        >
                          <span>{item.name}</span>
                          <span className="text-xs text-slate-500">
                            {item.startTime} – {item.endTime}
                          </span>
                        </button>
                      </li>
                    ))}

                    {activeSchedule.length === 0 && (
                      <li className="px-3 py-2 text-sm text-slate-500">
                        Belum ada shift aktif.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <label htmlFor="quick-start-date" className={labelClass}>
                  Tanggal mulai
                </label>
                <input
                  id="quick-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="quick-end-date" className={labelClass}>
                  Tanggal selesai
                  <span className="ml-1 font-normal text-slate-400">
                    (opsional)
                  </span>
                </label>
                <input
                  id="quick-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="quick-security-search" className={labelClass}>
                  Petugas keamanan
                </label>

                <input
                  id="quick-security-search"
                  type="search"
                  placeholder="Cari nama atau nomor pegawai"
                  value={search.singleSecurity}
                  onChange={(event) =>
                    setSearch((previous) => ({
                      ...previous,
                      singleSecurity: event.target.value,
                    }))
                  }
                  className={inputClass}
                />

                <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
                  {searchSecurity.slice(0, 8).map((item) => {
                    const selected = selectedUserId === item.id;

                    return (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                          selected
                            ? "border-slate-500 bg-slate-50"
                            : "border-transparent hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="quickSecurity"
                          checked={selected}
                          onChange={() => setSelectedUserId(item.id)}
                          className="radio radio-sm"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {item.fullName}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {item.employeeNumber ||
                              "Nomor pegawai tidak tersedia"}
                          </p>
                        </div>
                      </label>
                    );
                  })}

                  {searchSecurity.length === 0 && (
                    <p className="py-5 text-center text-sm text-slate-500">
                      Petugas tidak ditemukan.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isAssigning ||
                  !scheduleId ||
                  !selectedUserId ||
                  !startDate ||
                  (!!endDate && endDate < startDate)
                }
                className={`${primaryButton} w-full`}
              >
                <Send size={16} />
                {isAssigning ? "Menyimpan..." : "Simpan Penugasan"}
              </button>
            </form>
          </aside>
        </section>
      </main>

      {/* =====================================================
          MODAL: CREATE SCHEDULE
      ===================================================== */}

      <dialog id="patrol_schedules" className="modal">
        <div className="modal-box max-h-[92vh] w-11/12 max-w-2xl overflow-hidden rounded-xl bg-white p-0">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Buat Jadwal Patroli
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Langkah {currentStep} dari 4
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseCreateModal}
              aria-label="Tutup modal"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-4 border-b border-slate-200 px-6 py-4">
            {[
              "Informasi jadwal",
              "Tanggal patroli",
              "Petugas",
              "Rute titik",
            ].map((label, index) => {
              const step = index + 1;
              const active = currentStep === step;
              const completed = currentStep > step;

              return (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      active
                        ? "bg-slate-900 text-white"
                        : completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {completed ? "✓" : step}
                  </span>
                  <span
                    className={`hidden text-xs font-medium sm:block ${
                      active ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (currentStep === 1) {
                void createPatrolSchedule();
              } else if (currentStep === 2) {
                void createScheduleDates();
              } else if (currentStep === 3) {
                void createScheduleAssignment();
              } else {
                void saveCreatedAssignmentRoutes();
              }
            }}
            className="flex max-h-[calc(92vh-150px)] flex-col"
          >
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {currentStep === 1 && (
                <>
                  <section>
                    <h3 className="mb-4 text-sm font-semibold text-slate-900">
                      Informasi jadwal
                    </h3>

                    <div>
                      <label htmlFor="schedule-name" className={labelClass}>
                        Nama jadwal
                      </label>
                      <input
                        id="schedule-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Contoh: Shift Pagi"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="schedule-start" className={labelClass}>
                          Waktu mulai
                        </label>
                        <input
                          id="schedule-start"
                          type="time"
                          value={startTime}
                          onChange={(event) => setStartTime(event.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="schedule-end" className={labelClass}>
                          Waktu selesai
                        </label>
                        <input
                          id="schedule-end"
                          type="time"
                          value={endTime}
                          onChange={(event) => setEndTime(event.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="border-t border-slate-200 pt-5">
                    <h3 className="mb-4 text-sm font-semibold text-slate-900">
                      Pengaturan patroli
                    </h3>

                    <div>
                      <label htmlFor="interval" className={labelClass}>
                        Interval patroli (menit)
                      </label>
                      <input
                        id="interval"
                        type="number"
                        min={1}
                        value={intervalMinutes}
                        onChange={(event) =>
                          setIntervalMinutes(Number(event.target.value))
                        }
                        required
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        Jarak waktu antarpatroli yang dijadwalkan.
                      </p>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="grace-period" className={labelClass}>
                        Toleransi keterlambatan (menit)
                      </label>
                      <input
                        id="grace-period"
                        type="number"
                        min={0}
                        value={gracePeriodMinutes}
                        onChange={(event) =>
                          setGracePeriodMinutes(Number(event.target.value))
                        }
                        required
                        className={inputClass}
                      />
                    </div>

                    <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={enforceSequence}
                        onChange={(event) =>
                          setEnforceSequence(event.target.checked)
                        }
                        className="checkbox checkbox-sm mt-0.5"
                      />
                      <span>
                        <span className="block text-sm font-medium text-slate-800">
                          Wajib mengikuti urutan
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                          Petugas wajib mengunjungi titik patroli sesuai urutan
                          yang ditentukan.
                        </span>
                      </span>
                    </label>
                  </section>

                  <section className="border-t border-slate-200 pt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Titik patroli
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Pilih titik yang masuk ke jadwal ini.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSelectAllPoints}
                        disabled={activePatrolPoints.length === 0}
                        className="text-xs font-semibold text-slate-700 underline underline-offset-4 disabled:opacity-40"
                      >
                        {activePatrolPoints.length > 0 &&
                        activePatrolPoints.every((point) =>
                          points.some(
                            (selected) => selected.patrolPointId === point.id,
                          ),
                        )
                          ? "Batalkan semua"
                          : "Pilih semua"}
                      </button>
                    </div>

                    <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                      <span className="text-xs text-slate-600">
                        Titik dipilih
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {points.length}
                      </span>
                    </div>

                    {activePatrolPoints.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                        Belum ada titik patroli aktif.
                      </p>
                    ) : (
                      <div className="max-h-64 space-y-1.5 overflow-y-auto">
                        {activePatrolPoints.map((point, index) => {
                          const selected = points.some(
                            (item) => item.patrolPointId === point.id,
                          );

                          return (
                            <label
                              key={point.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                selected
                                  ? "border-slate-400 bg-slate-50"
                                  : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => handleSelectOne(point.id)}
                                className="checkbox checkbox-sm"
                              />

                              <span className="text-xs text-slate-400">
                                {String(index + 1).padStart(2, "0")}
                              </span>

                              <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">
                                {point.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </>
              )}

              {currentStep === 2 && (
                <section>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Rentang tanggal patroli
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Pilih preset seminggu/sebulan atau tentukan rentang tanggal
                    sendiri. Sistem akan membuat tanggal patroli secara
                    otomatis.
                  </p>

                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {startTime} – {endTime}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={applyWeekPreset}
                      className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Calendar size={17} /> Buat jadwal seminggu
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        Mulai hari ini sampai 7 hari kalender.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={applyMonthPreset}
                      className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Calendar size={17} /> Buat jadwal sebulan
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        Mulai hari ini sampai akhir bulan ini.
                      </span>
                    </button>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-200 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Rentang kustom
                    </h4>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="schedule-range-start"
                          className={labelClass}
                        >
                          Tanggal mulai
                        </label>
                        <input
                          id="schedule-range-start"
                          type="date"
                          min={toDateInputValue(new Date())}
                          value={rangeStart}
                          onChange={(event) =>
                            setRangeStart(event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="schedule-range-end"
                          className={labelClass}
                        >
                          Tanggal selesai
                        </label>
                        <input
                          id="schedule-range-end"
                          type="date"
                          min={rangeStart || toDateInputValue(new Date())}
                          value={rangeEnd}
                          onChange={(event) => setRangeEnd(event.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className={labelClass}>Hari patroli</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Min", value: 0 },
                          { label: "Sen", value: 1 },
                          { label: "Sel", value: 2 },
                          { label: "Rab", value: 3 },
                          { label: "Kam", value: 4 },
                          { label: "Jum", value: 5 },
                          { label: "Sab", value: 6 },
                        ].map((day) => {
                          const selected = selectedWeekdays.includes(day.value);
                          return (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => toggleWeekday(day.value)}
                              className={`rounded-lg border px-3 py-2 text-sm font-medium ${selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Default semua hari dipilih. Misalnya pilih Sen–Jum untuk
                        jadwal hari kerja saja.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyDateRange(rangeStart, rangeEnd)}
                      className={`${primaryButton} mt-4 w-full`}
                    >
                      Terapkan rentang tanggal
                    </button>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Pratinjau tanggal patroli
                        </h4>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Tanggal yang akan dikirim ke backend.
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {dates.length} hari
                      </span>
                    </div>
                    {dates.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-slate-500">
                        Pilih preset atau terapkan rentang tanggal terlebih
                        dahulu.
                      </p>
                    ) : (
                      <>
                        <div className="max-h-52 space-y-1 overflow-y-auto p-3">
                          {dates.map((date) => (
                            <div
                              key={date}
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                            >
                              <span className="text-sm text-slate-700">
                                {new Date(
                                  `${date}T12:00:00`,
                                ).toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setDates((previous) =>
                                    previous.filter((item) => item !== date),
                                  )
                                }
                                className="text-xs font-medium text-red-600 hover:text-red-800"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-slate-200 px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setDates([])}
                            className="text-xs font-medium text-red-600 hover:text-red-800"
                          >
                            Hapus semua tanggal
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </section>
              )}

              {currentStep === 3 && (
                <section>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Petugas yang ditugaskan
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Pilih petugas yang menjalankan jadwal patroli ini.
                  </p>

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-600">
                      Petugas aktif
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {activeSecurity.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {activeSecurity.map((security) => {
                      const selected = selectedSecurityIds.includes(
                        security.id,
                      );

                      return (
                        <label
                          key={security.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                            selected
                              ? "border-slate-400 bg-slate-50"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleSelectSecurity(security.id)}
                            className="checkbox checkbox-sm"
                          />

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                            {security.fullName
                              ?.trim()
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((part) => part.charAt(0).toUpperCase())
                              .join("") || "S"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {security.fullName}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {security.employeeNumber || "Security"}
                            </p>
                          </div>

                          {selected && (
                            <span className="text-xs font-medium text-slate-700">
                              Dipilih
                            </span>
                          )}
                        </label>
                      );
                    })}

                    {activeSecurity.length === 0 && (
                      <p className="py-8 text-center text-sm text-slate-500">
                        Belum ada petugas aktif.
                      </p>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {selectedSecurityIds.length} petugas dipilih.
                  </p>
                </section>
              )}

              {currentStep === 4 && (
                <section>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Urutan titik patroli
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Atur urutan kunjungan titik. Urutan ini akan diterapkan ke
                    semua petugas yang dipilih pada langkah sebelumnya.
                  </p>

                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                    {createdAssignmentIds.length} assignment akan menggunakan
                    rute yang sama. Gunakan tombol panah untuk mengubah urutan.
                  </div>

                  <div className="mt-4 space-y-2">
                    {routePointIds.map((pointId, index) => {
                      const point = activePatrolPoints.find(
                        (item) => item.id === pointId,
                      );
                      return (
                        <div
                          key={pointId}
                          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {point?.name ?? "Titik patroli tidak ditemukan"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {point?.code ?? pointId}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              aria-label="Naikkan titik"
                              disabled={index === 0}
                              onClick={() => moveRoutePoint(index, -1)}
                              className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              aria-label="Turunkan titik"
                              disabled={index === routePointIds.length - 1}
                              onClick={() => moveRoutePoint(index, 1)}
                              className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-30"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {routePointIds.length} titik dipilih. Urutan ini disimpan
                    melalui endpoint assignment route.
                  </p>
                </section>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1) {
                    handleCloseCreateModal();
                  } else {
                    setCurrentStep(
                      (previous) => (previous - 1) as 1 | 2 | 3 | 4,
                    );
                  }
                }}
                className={secondaryButton}
              >
                {currentStep === 1 ? "Batal" : "Kembali"}
              </button>

              <button
                type="submit"
                disabled={
                  (currentStep === 1 &&
                    (points.length === 0 || isCreatingSchedule)) ||
                  (currentStep === 2 &&
                    (dates.length === 0 || isCreatingDates)) ||
                  (currentStep === 3 &&
                    (selectedSecurityIds.length === 0 || isAssigning)) ||
                  (currentStep === 4 &&
                    (routePointIds.length === 0 || isSavingRoute))
                }
                className={primaryButton}
              >
                {currentStep === 1
                  ? isCreatingSchedule
                    ? "Membuat jadwal..."
                    : "Buat jadwal & lanjutkan"
                  : currentStep === 2
                    ? isCreatingDates
                      ? "Menyimpan tanggal..."
                      : "Simpan tanggal & lanjutkan"
                    : currentStep === 3
                      ? isAssigning
                        ? "Menyimpan penugasan..."
                        : "Simpan petugas & lanjutkan"
                      : isSavingRoute
                        ? "Menyimpan rute..."
                        : "Simpan rute & selesaikan"}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button type="submit">Tutup</button>
        </form>
      </dialog>

      {/* =====================================================
          MODAL: BULK ASSIGNMENT
      ===================================================== */}

      <dialog id="patrol_schedules_assignment" className="modal">
        <div className="modal-box max-h-[92vh] w-11/12 max-w-2xl overflow-hidden rounded-xl bg-white p-0">
          <form
            onSubmit={handleBulkAssign}
            className="flex max-h-[92vh] flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Buat Penugasan Roster
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tetapkan beberapa shift kepada satu petugas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => closeModal("patrol_schedules_assignment")}
                aria-label="Tutup modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto px-6 py-5">
              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Periode penugasan
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bulk-start" className={labelClass}>
                      Tanggal mulai
                    </label>
                    <input
                      id="bulk-start"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="bulk-end" className={labelClass}>
                      Tanggal selesai
                    </label>
                    <input
                      id="bulk-end"
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(event) => setEndDate(event.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              <section className="border-t border-slate-200 pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Pilih shift
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Shift yang akan diberikan kepada petugas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAllSchedules}
                    disabled={activeSchedule.length === 0}
                    className="text-xs font-semibold text-slate-700 underline underline-offset-4 disabled:opacity-40"
                  >
                    {activeSchedule.length > 0 &&
                    activeSchedule.every((item) =>
                      selectedScheduleIds.includes(item.id),
                    )
                      ? "Batalkan semua"
                      : "Pilih semua"}
                  </button>
                </div>

                <div className="space-y-2">
                  {activeSchedule.map((item) => {
                    const selected = selectedScheduleIds.includes(item.id);

                    return (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                          selected
                            ? "border-slate-400 bg-slate-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleScheduleSelection(item.id)}
                          className="checkbox checkbox-sm"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.startTime} – {item.endTime} WITA
                          </p>
                        </div>

                        {selected && (
                          <span className="text-xs font-medium text-slate-700">
                            Dipilih
                          </span>
                        )}
                      </label>
                    );
                  })}

                  {activeSchedule.length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada shift aktif.
                    </p>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {selectedScheduleIds.length} shift dipilih.
                </p>
              </section>

              <section className="border-t border-slate-200 pt-5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Pilih petugas
                </h3>

                <input
                  type="search"
                  placeholder="Cari nama atau nomor pegawai"
                  value={search.security}
                  onChange={(event) =>
                    setSearch((previous) => ({
                      ...previous,
                      security: event.target.value,
                    }))
                  }
                  className={`${inputClass} mt-3`}
                />

                <div className="mt-3 max-h-60 space-y-1.5 overflow-y-auto">
                  {activeSecurity
                    .filter((item) => {
                      const keyword = search.security.trim().toLowerCase();

                      return (
                        item.fullName.toLowerCase().includes(keyword) ||
                        (item.employeeNumber ?? "")
                          .toLowerCase()
                          .includes(keyword)
                      );
                    })
                    .map((item) => {
                      const selected = selectedUserId === item.id;

                      return (
                        <label
                          key={item.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                            selected
                              ? "border-slate-400 bg-slate-50"
                              : "border-transparent hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="bulkSecurity"
                            checked={selected}
                            onChange={() => setSelectedUserId(item.id)}
                            className="radio radio-sm"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {item.fullName}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.employeeNumber ||
                                "Nomor pegawai tidak tersedia"}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                </div>
              </section>

              <section className="rounded-lg bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Ringkasan penugasan
                </h3>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Petugas</span>
                    <span className="text-right font-medium text-slate-800">
                      {activeSecurity.find((item) => item.id === selectedUserId)
                        ?.fullName || "Belum dipilih"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Jumlah shift</span>
                    <span className="font-medium text-slate-800">
                      {selectedScheduleIds.length}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Periode</span>
                    <span className="text-right font-medium text-slate-800">
                      {startDate || "—"} s.d. {endDate || "—"}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => closeModal("patrol_schedules_assignment")}
                className={secondaryButton}
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={
                  !selectedUserId ||
                  selectedScheduleIds.length === 0 ||
                  !startDate ||
                  !endDate ||
                  endDate < startDate ||
                  isBulkAssigning
                }
                className={primaryButton}
              >
                {isBulkAssigning ? "Menyimpan..." : "Simpan penugasan"}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button type="submit">Tutup</button>
        </form>
      </dialog>
    </div>
  );
};

export default ScheduleManage;

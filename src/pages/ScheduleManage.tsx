import {
  AddCircle,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  ArrowSwapHorizontal,
  BoxTime,
  Calendar,
  People,
  Send,
  UserSquare,
} from "iconsax-react";
import React, { useState } from "react";
import {
  useAddScheduleAssignment,
  useCreatePatrolSchedule,
  useMonthlyRoster,
  usePatrolScheduleActivate,
  usePatrolSchedules,
} from "../hooks/schedule/usePatrolSchedules";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import type {
  AddScheduleAssignmentPayload,
  CreatePatrolSchedulePayload,
  CreateScheduleAssignmentPayload,
  CreateScheduleDatesPayload,
  CreateSchedulePointInput,
} from "../types";
import { usePatrolPoints } from "../hooks/patrol-point/usePatrolPoints";
import { useSecurityUsers } from "../hooks/users/useUsers";
import { useCreatePatrolScheduleDates } from "../hooks/schedule/useScheduleDates";
import {
  useCreateScheduleAssigment,
  useGetScheduleAssigments,
} from "../hooks/schedule/usePatrolScheduleAssignment";
import { useScheduleContext } from "../hooks/schedule/useScheduleContext";

const ScheduleManage = () => {
  const { user } = useAuthContext();
  const siteId = user?.siteId;
  const { schedule, setSchedule } = useScheduleContext();
  const scheduleId = schedule?.scheduleId;

  const today = new Date();
  const [rosterMonth, setRosterMonth] = useState(today.getMonth() + 1);
  const [rosterYear, setRosterYear] = useState(today.getFullYear());

  const { data: patrolPoint } = usePatrolPoints();
  const { data: patrolSchedules } = usePatrolSchedules();
  const { data: userSecurity } = useSecurityUsers();
  const { data: scheduleAssigment } = useGetScheduleAssigments();
  const {
    data: roster = [],
    isLoading: isRosterLoading,
    isError: isRosterError,
    error: rosterError,
  } = useMonthlyRoster(
    siteId
      ? {
          siteId,
          month: rosterMonth,
          year: rosterYear,
        }
      : null,
  );

  const assignment = scheduleAssigment ?? [];
  console.log("DATA", JSON.stringify(roster, null, 2));

  const { mutateAsync: createPS } = useCreatePatrolSchedule();
  const { mutateAsync: createDates } = useCreatePatrolScheduleDates();
  const { mutateAsync: createAssigment, isPending: isAssigning } =
    useAddScheduleAssignment();
  const { mutate: activateSchedule, isPending: isActivating } =
    usePatrolScheduleActivate();
  const { mutateAsync: assignUser } = useCreateScheduleAssigment();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [createdScheduleId, setCreatedScheduleId] = useState<string | null>(
    null,
  );
  const [selectedSecurityIds, setSelectedSecurityIds] = useState<string[]>([]);
  const [isCreatingDates, setIsCreatingDates] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "DRAFT">(
    "ACTIVE",
  );

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState<number>(120);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState<number>(30);
  const [enforceSequence, setEnforceSequence] = useState<boolean>(false);
  const [points, setPoints] = useState<CreateSchedulePointInput[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState("Pilih Shift");

  const monthLabel = new Date(
    rosterYear,
    rosterMonth - 1,
    1,
  ).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const activePatrolPoints =
    patrolPoint?.filter((point) => point.status === "ACTIVE") ?? [];

  const draftSchedule =
    patrolSchedules?.data.filter((s) => s.status === "DRAFT") ?? [];

  const activeSchedule =
    patrolSchedules?.data.filter((s) => s.status === "ACTIVE") ?? [];

  const activeSecurity =
    userSecurity?.data.filter((s) => s.status === "ACTIVE") ?? [];

  // console.log("Draft Schedule", JSON.stringify(activeSecurity, null, 2));

  const filteredData =
    selectedStatus === "ACTIVE" ? activeSchedule : draftSchedule;

  const daftarNamaHari = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

  // Konfigurasi warna shift
  const shiftConfig: Record<string, { label: string; style: string }> = {
    P: {
      label: "[P] Pagi",
      style: "bg-blue-100 text-blue-700 border-blue-200",
    },
    S: {
      label: "[S] Siang",
      style: "bg-orange-100 text-orange-700 border-orange-200",
    },
    M: {
      label: "[M] Malam",
      style: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    L: {
      label: "[L] Libur",
      style: "bg-red-100 text-red-700 border-red-200",
    },
    "!": {
      label: "[!] Konflik Jadwal",
      style: "bg-red-200 text-red-900 border-red-400",
    },
    "-": {
      label: "[-] Shift Belum Dipetakan",
      style: "bg-gray-100 text-gray-600 border-gray-300",
    },
  };

  // Kalender dinamis berdasarkan bulan dan tahun yang dipilih
  const kalenderBulanIni = Array.from(
    {
      length: new Date(rosterYear, rosterMonth, 0).getDate(),
    },
    (_, i) => {
      const tgl = i + 1;

      const tanggal = new Date(rosterYear, rosterMonth - 1, tgl);

      const indexHari = tanggal.getDay();

      return {
        tgl,
        hari: daftarNamaHari[indexHari],
        isLibur: indexHari === 0,
      };
    },
  );

  // Fungsi navigasi tanggal
  const handlePrevDate = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDate = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  // Format tanggal ke Bahasa Indonesia (contoh: 7 Oktober 2026)
  const formattedDate = currentDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handelOpenModal = () => {
    const modal = document.getElementById(
      "patrol_schedules",
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "patrol_schedules",
    ) as HTMLDialogElement;
    modal.close();

    setCurrentStep(1);
    setCreatedScheduleId(null);

    setName("");
    setStartTime("");
    setEndTime("");

    setIntervalMinutes(120);
    setGracePeriodMinutes(30);
    setEnforceSequence(false);

    setPoints([]);
    setDates([]);
    setSelectedSecurityIds([]);
  };

  const handleSelectOne = (patrolPointId: string) => {
    setPoints((prev) => {
      const isSelected = prev.some(
        (point) => point.patrolPointId === patrolPointId,
      );

      if (isSelected) {
        return prev.filter((point) => point.patrolPointId !== patrolPointId);
      }

      return [
        ...prev,
        {
          patrolPointId,
          required: true,
        },
      ];
    });
  };

  const handleSelectAll = () => {
    if (!activePatrolPoints?.length) return;

    const isAllSelected = activePatrolPoints.every((point) =>
      points.some((selected) => selected.patrolPointId === point.id),
    );

    if (isAllSelected) {
      setPoints((prev) =>
        prev.filter(
          (selected) =>
            !activePatrolPoints.some(
              (point) => point.id === selected.patrolPointId,
            ),
        ),
      );

      return;
    }

    setPoints((prev) => {
      const selectedIds = new Set(prev.map((point) => point.patrolPointId));

      const newPoints: CreateSchedulePointInput[] = activePatrolPoints
        .filter((point) => !selectedIds.has(point.id))
        .map((point) => ({
          patrolPointId: point.id,
          required: true,
        }));

      return [...prev, ...newPoints];
    });
  };

  const handleSelectSecurity = (securityId: string) => {
    setSelectedSecurityIds((previousIds) => {
      const isSelected = previousIds.includes(securityId);

      if (isSelected) {
        return previousIds.filter((id) => id !== securityId);
      }

      return [...previousIds, securityId];
    });
  };

  const createPatrolSchedule = async () => {
    if (!siteId) {
      console.error("Site ID tidak ditemukan.");
      return;
    }

    if (!name.trim()) {
      console.error("Nama jadwal patroli wajib diisi.");
      return;
    }

    if (!startTime || !endTime) {
      console.error("Waktu mulai dan selesai wajib diisi.");
      return;
    }

    if (points.length === 0) {
      console.error("Pilih minimal satu titik patroli.");
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

    console.log(
      "PAYLOAD CREATE PATROL SCHEDULE:",
      JSON.stringify(payload, null, 2),
    );

    try {
      const response = await createPS(payload);

      console.log("Jadwal patroli berhasil dibuat:", response);

      const scheduleId = response.id;

      if (!scheduleId) {
        throw new Error("ID jadwal tidak ditemukan pada response API.");
      }

      setCreatedScheduleId(scheduleId);

      // Berpindah ke Step 2 setelah jadwal berhasil dibuat.
      setCurrentStep(2);
    } catch (error) {
      console.error("Error saat membuat jadwal patroli:", error);
    }
  };

  const createScheduleDates = async () => {
    if (!createdScheduleId) {
      console.error("ID jadwal patroli tidak ditemukan.");
      return;
    }

    if (dates.length === 0) {
      console.error("Pilih minimal satu tanggal.");
      return;
    }

    const payload: CreateScheduleDatesPayload = {
      dates,
    };

    setIsCreatingDates(true);

    try {
      await createDates({
        scheduleId: createdScheduleId,
        payload,
      });

      console.log("Berhasil menambahkan tanggal jadwal patroli:", payload);

      // Berpindah ke Step 3 setelah tanggal berhasil disimpan.
      setCurrentStep(3);
    } catch (error) {
      console.error("Error saat membuat tanggal patroli:", error);
    } finally {
      setIsCreatingDates(false);
    }
  };

  const createScheduleAssignment = async (): Promise<void> => {
    if (!createdScheduleId) {
      console.error("ID jadwal patroli tidak ditemukan.");
      return;
    }

    if (dates.length === 0) {
      console.error("Tanggal pelaksanaan belum dipilih.");
      return;
    }

    if (selectedSecurityIds.length === 0) {
      console.error("Pilih minimal satu petugas keamanan.");
      return;
    }

    const sortedDates = [...dates].sort();

    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    try {
      for (const userId of selectedSecurityIds) {
        const payload: AddScheduleAssignmentPayload = {
          userId,
          startDate,
          endDate,
        };

        await createAssigment({
          scheduleId: createdScheduleId,
          payload,
        });
      }

      console.log("Assignment security berhasil dibuat.");

      handleCloseModal();
    } catch (error) {
      console.error("Error saat membuat assignment security:", error);
    }
  };

  const handleActivateSchedule = (id: string) => {
    activateSchedule(id, {
      onSuccess: (data) => {
        console.log("Schedule berhasil diaktifkan:", data);
      },
      onError: (error) => {
        console.error("Gagal mengaktifkan schedule:", error);
      },
    });
  };

  const createSingleData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!scheduleId) {
      console.error("Schedule ID tidak ditemukan");
      return;
    }

    if (!selectedUserId || !startDate) {
      console.error("User ID dan tanggal mulai wajib diisi");
      return;
    }

    const payload: CreateScheduleAssignmentPayload = {
      userId: selectedUserId,
      startDate,
      endDate: endDate || null,
    };

    try {
      const result = await assignUser({ scheduleId, payload });

      setSelectedShift("");
      setStartDate("");
      setEndDate("");
      setSelectedUserId("");
      console.log("Berhasil create data", result);
    } catch (error) {
      console.log("Gagal saat assign user", error);
    }
  };

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

      <div className="px-6 pb-6">
        <div className="mt-5 grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">
                Jadwal Patroli & Shift Satpam
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Pengaturan rotasi 3 shift (Pagi, Siang, Malam) gardu induk. Setiap
              satpam yang bertugas melakukan inspeksi menyeluruh ke seluruh 16
              Checkpoint (Full Circuit Patrol).
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="bg-white rounded-lg px-2 py-2.5 shadow-sm w-[40%] ">
              <div className="flex items-center justify-evenly">
                <button
                  onClick={handlePrevDate}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  aria-label="Previous date"
                >
                  <ArrowLeft2 size={15} color="gray" />
                </button>
                <div className="flex items-center gap-1 mx-4">
                  <Calendar size={15} color="gray" />
                  <p className="text-gray-700 text-xs font-semibold">
                    {formattedDate}
                  </p>
                </div>
                <button
                  onClick={handleNextDate}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  aria-label="Next date"
                >
                  <ArrowRight2 size={15} color="gray" />
                </button>
              </div>
            </div>

            <button className="flex lg:items-center gap-1 bg-[#FED400] rounded-lg px-4 py-2 cursor-pointer">
              <AddCircle size={15} color="black" />
              <p className="font-semibold text-sm">Buat Jadwal / Roster</p>
            </button>

            <button
              onClick={handelOpenModal}
              className="flex lg:items-center gap-1 bg-[#FED400] rounded-lg px-4 py-3 cursor-pointer"
            >
              <AddCircle size={15} color="black" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <div className="w-[70%] rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            {/* HEADER */}
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <BoxTime size={23} color="#003B73" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Status Rotasi 3-Shift
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Pengelolaan shift operasional gardu induk
                  </p>
                </div>
              </div>

              <div className="px-2 flex items-center gap-2">
                {[
                  { label: "Active", value: "ACTIVE" as const },
                  { label: "Draft", value: "DRAFT" as const },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedStatus(filter.value)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-colors ${selectedStatus === filter.value ? "border-blue-200 bg-blue-50 text-[#003B73]" : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    {filter.label}
                  </button>
                ))}
                <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-700">
                    Operasional 24 Jam
                  </span>
                </div>
              </div>
            </div>

            {/* SHIFT LIST */}
            <div className="space-y-4">
              {filteredData.map((s, index) => {
                const isActive = s.status === "ACTIVE";

                const assignedUsers = assignment
                  .filter((item) => item.scheduleId === s.id)
                  .map((item) => item.user)
                  .filter((user) => user != null);

                return (
                  <div
                    key={s.id}
                    className={`overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
                      isActive
                        ? "border-blue-200 shadow-sm"
                        : "border-gray-200 shadow-none"
                    }`}
                  >
                    {/* SHIFT HEADER */}
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isActive ? "bg-[#00529C]" : "bg-gray-100"
                          }`}
                        >
                          <span
                            className={`text-sm font-bold ${
                              isActive ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="ml-3">
                          <h3 className="truncate text-sm font-bold text-gray-800">
                            {s.name}
                          </h3>

                          <p className="mt-1 text-xs font-medium text-gray-500">
                            {s.startTime} - {s.endTime} WITA
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex rounded-md px-3 py-1 text-[10px] font-bold ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "DRAFT"}
                        </span>

                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => handleActivateSchedule(s.id)}
                            disabled={isActivating}
                            className="cursor-pointer rounded-sm bg-[#003B73] px-4 py-2 transition-colors hover:bg-[#00529C] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <p className="text-xs font-semibold text-white">
                              {isActivating ? "Mengaktifkan..." : "Aktifkan"}
                            </p>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ASSIGNED USERS */}
                    <div className="border-t border-gray-100 px-4 py-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <People size={17} color="#64748B" />

                          <span className="text-xs font-semibold text-gray-700">
                            Petugas Bertugas
                          </span>

                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#00529C]">
                            {assignedUsers.length}
                          </span>
                        </div>

                        <span className="text-[11px] text-gray-400">
                          {assignedUsers.length > 0
                            ? "Petugas terdaftar"
                            : "Belum ada petugas"}
                        </span>
                      </div>

                      {assignedUsers.length > 0 ? (
                        <div className="space-y-2">
                          {assignedUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2.5"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold uppercase text-[#00529C]">
                                  {user.fullName?.charAt(0) ?? "P"}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold text-gray-800">
                                    {user.fullName}
                                  </p>

                                  <p className="mt-0.5 text-[11px] text-gray-500">
                                    {user.username ?? "Petugas keamanan"}
                                  </p>
                                </div>
                              </div>

                              <span className="ml-2 shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                                Assigned
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/70 px-4 py-5 text-center">
                          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                            <People size={18} color="#9CA3AF" />
                          </div>

                          <p className="text-xs font-semibold text-gray-600">
                            Belum ada petugas
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            Petugas yang ditugaskan akan muncul di sini.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* EMPTY STATE */}
              {filteredData.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    {selectedStatus === "ACTIVE"
                      ? "Belum ada shift aktif"
                      : "Belum ada schedule draft"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {selectedStatus === "ACTIVE"
                      ? "Schedule yang sudah diaktifkan akan muncul di sini."
                      : "Schedule yang masih dalam tahap persiapan akan muncul di sini."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-2 w-[30%]">
            <form onSubmit={createSingleData}>
              <div className="bg-white p-4 rounded-lg mt-4">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <UserSquare size={20} color="#003B73" />
                    <p className="text-lg font-semibold">Penugasan Cepat</p>
                  </div>

                  <div className="bg-gray-100 rounded-sm px-2 py-0.5">
                    <p className="text-xs text-gray-600 font-semibold tracking-wide">
                      ROSTER-MOD
                    </p>
                  </div>
                </div>

                {/* PILIH SHIFT */}
                <div className="mt-4">
                  <p className="text-sm text-gray-700 font-semibold">
                    Pilih Shift Target
                  </p>

                  <div className="mt-2 dropdown dropdown-start w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="bg-gray-100 rounded-sm px-2 py-2 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-sm tracking-wide">
                          {selectedShift}
                        </p>
                        <ArrowDown2 size={17} color="black" />
                      </div>
                    </div>

                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-gray-100 rounded-lg z-10 w-full p-2 mt-1 shadow-md border border-gray-200"
                    >
                      {activeSchedule?.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedShift(item.name);
                              console.log(selectedShift);

                              // Simpan ID jadwal yang dipilih.
                              setSchedule({
                                ...schedule,
                                id: item.id,
                                scheduleId: item.id,
                                name: item.name,
                              });
                            }}
                            className={`text-xs text-gray-600 rounded-md ${
                              selectedShift === item.name
                                ? "bg-gray-200 font-semibold"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            {item.name} ({item.startTime} - {item.endTime} WITA)
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* TANGGAL PATROLI */}
                <div className="flex-1 mt-3">
                  <label
                    htmlFor="patrol-start-date"
                    className="block text-gray-700 font-semibold text-sm mb-1.5"
                  >
                    Pilih Tanggal Patroli
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    id="patrol-start-date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      console.log(startDate);
                    }}
                    required
                    className="bg-gray-100 rounded-sm text-gray-600 p-2 w-full"
                  />
                </div>

                {/* TANGGAL AKHIR OPSIONAL */}
                <div className="mt-3">
                  <label
                    htmlFor="patrol-end-date"
                    className="block text-gray-700 font-semibold text-sm mb-1.5"
                  >
                    Tanggal Akhir Penugasan (Opsional)
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    id="patrol-end-date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      console.log(endDate);
                    }}
                    className="bg-gray-100 rounded-sm text-gray-600 p-2 w-full"
                  />
                </div>

                {/* PILIH SATPAM */}
                <div className="mt-3">
                  <p className="uppercase text-xs text-gray-500 font-semibold">
                    Pilih Satpam Target
                  </p>

                  {activeSecurity?.slice(0, 3).map((item) => {
                    const isAvailable = item.status === "ACTIVE";
                    const isSelected = selectedUserId === item.id;

                    return (
                      <label
                        key={item.id}
                        className={`flex items-center justify-between mt-2 rounded-lg px-3 py-2 cursor-pointer ${
                          isAvailable ? "bg-gray-100" : "bg-[#F7F8FA]"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="securityUser"
                            value={item.id}
                            checked={isSelected}
                            onChange={() => {
                              setSelectedUserId(item.id);
                              console.log(selectedUserId);
                            }}
                            disabled={!isAvailable}
                            className={`radio radio-xs ${
                              isAvailable
                                ? "radio-primary"
                                : "radio-disabled opacity-50 cursor-not-allowed"
                            }`}
                          />

                          <div className="ml-2">
                            <p
                              className={`text-sm font-bold ${
                                isAvailable
                                  ? "text-[#004780]"
                                  : "text-[#ABAEB5]"
                              }`}
                            >
                              {item.fullName}
                            </p>

                            <p
                              className={`text-xs font-semibold ${
                                isAvailable
                                  ? "text-[#004780]"
                                  : "text-[#ABAEB5]"
                              }`}
                            >
                              {item.employeeNumber}
                            </p>
                          </div>
                        </div>

                        <p
                          className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {item.status}
                        </p>
                      </label>
                    );
                  })}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="flex items-center justify-center w-full bg-[#FED400] py-2 rounded-sm mt-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={17} color="black" />

                  <p className="text-sm font-semibold tracking-wide mb-0.5 ml-1">
                    {isAssigning ? "Mengirim..." : "Kirim"}
                  </p>
                </button>
              </div>
            </form>

            <form action="" method="post" onSubmit={() => console.log("Click")}>
              <div className="bg-white p-4 rounded-lg mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <ArrowSwapHorizontal size={20} color="#003B73" />
                    <p className="text-lg font-semibold">Tukar Shift</p>
                  </div>
                  <div className="bg-gray-100 rounded-sm px-2 py-0.5">
                    <p className="text-xs text-gray-600 font-semibold tracking-wide">
                      ROSTER-MOD
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-700 font-semibold">
                    Pilih Shift Target
                  </p>
                  <div className="mt-2 dropdown dropdown-start w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="bg-gray-100 rounded-sm px-2 py-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-sm tracking-wide">
                          {selectedShift}
                        </p>
                        <ArrowDown2 size={17} color="black" />
                      </div>
                    </div>

                    <ul
                      tabIndex={-1}
                      className="dropdown-content menu bg-gray-100 rounded-lg z-10 w-full p-2 mt-1 shadow-md border border-gray-200"
                    >
                      {activeSchedule?.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              setSelectedShift(item.name);
                              // setSchedule({
                              //   id: item.id,
                              //   scheduleId: item.id,
                              // });
                            }}
                            className={`text-xs text-gray-600 hover:bg-gray-200 rounded-md ${
                              selectedShift === item.name
                                ? "bg-gray-100 text-gray-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex-1 mt-3">
                  <label
                    htmlFor=""
                    className="block text-gray-700 font-semibold text-sm mb-1.5"
                  >
                    Pilih Tanggal Patrol
                  </label>
                  <input
                    type="date"
                    name=""
                    id=""
                    placeholder="Pilih Tanggal"
                    className="bg-gray-100 rounded-sm text-gray-600 p-2 w-full"
                  />
                </div>

                <div className="mt-3">
                  <p className="uppercase text-xs text-gray-500 font-semibold">
                    Pilih Satpam Target
                  </p>
                  {activeSecurity?.slice(0, 3).map((item) => {
                    const isAvailable = item.status === "ACTIVE";
                    return (
                      <div
                        className={`flex items-center justify-between mt-2 rounded-lg px-3 py-2 ${isAvailable ? "bg-gray-100" : "bg-[#F7F8FA]"}`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="radio-4"
                            // value={item.id}
                            disabled={!isAvailable}
                            className={`radio radio-xs ${isAvailable ? "radio-primary" : "radio-disabled opacity-50 cursor-not-allowed"}`}
                          />
                          <div className="ml-2">
                            <p
                              className={`text-sm font-bold ${isAvailable ? "text-[#004780]" : "text-[#ABAEB5]"}`}
                            >
                              {item.fullName}
                            </p>
                            <p
                              className={`text-xs font-semibold ${isAvailable ? "text-[#004780]" : "text-[#ABAEB5]"}`}
                            >
                              {item.employeeNumber}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {item.status}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="flex items-center justify-center w-full bg-[#FED400] py-2 rounded-sm mt-3 cursor-pointer"
                  onClick={() => console.log("Click")}
                >
                  <Send size={17} color="black" />
                  <p className="text-sm font-semibold tracking-wide mb-0.5 ml-1">
                    Kirim
                  </p>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* MODAL CREATE SCHEDULE*/}
        <dialog id="patrol_schedules" className="modal">
          <div className="modal-box w-11/12 max-w-2xl overflow-hidden rounded-2xl bg-white p-0">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Tambah Jadwal Patroli
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Buat jadwal, tentukan tanggal, dan tugaskan petugas keamanan.
                </p>
              </div>

              <button
                type="button"
                aria-label="Tutup modal"
                onClick={handleCloseModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            {/* STEP INDICATOR */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: 1, title: "Buat Jadwal" },
                  { step: 2, title: "Atur Tanggal" },
                  { step: 3, title: "Assign Security" },
                ].map((item) => {
                  const isActive = currentStep === item.step;
                  const isCompleted = currentStep > item.step;

                  return (
                    <div key={item.step} className="min-w-0">
                      <div
                        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                          isCompleted
                            ? "bg-green-100 text-green-700"
                            : isActive
                              ? "bg-[#FED400] text-gray-900"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted ? "✓" : item.step}
                      </div>

                      <p
                        className={`text-xs font-semibold sm:text-sm ${
                          isActive
                            ? "text-gray-900"
                            : isCompleted
                              ? "text-green-700"
                              : "text-gray-400"
                        }`}
                      >
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP CONTENT */}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (currentStep === 1) {
                  void createPatrolSchedule();
                } else if (currentStep === 2) {
                  void createScheduleDates();
                } else if (currentStep === 3) {
                  void createScheduleAssignment();
                }
              }}
              className="flex max-h-[75vh] flex-col"
            >
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <section className="space-y-6">
                    <div className="space-y-6 overflow-y-auto px-6 py-5">
                      {/* Informasi Jadwal */}
                      <section>
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-gray-800">
                            Informasi Jadwal
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            Masukkan nama dan rentang waktu pelaksanaan patroli.
                          </p>
                        </div>

                        {/* Nama Jadwal */}
                        <div>
                          <label
                            htmlFor="schedule-name"
                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                          >
                            Nama Jadwal <span className="text-red-500">*</span>
                          </label>

                          <input
                            id="schedule-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Shift Pagi"
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                          />
                        </div>

                        {/* Waktu Mulai dan Selesai */}
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="start-time"
                              className="mb-1.5 block text-sm font-semibold text-gray-700"
                            >
                              Waktu Mulai{" "}
                              <span className="text-red-500">*</span>
                            </label>

                            <input
                              id="start-time"
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              required
                              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="end-time"
                              className="mb-1.5 block text-sm font-semibold text-gray-700"
                            >
                              Waktu Selesai{" "}
                              <span className="text-red-500">*</span>
                            </label>

                            <input
                              id="end-time"
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              required
                              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                            />
                          </div>
                        </div>
                      </section>

                      {/* Pengaturan Patroli */}
                      <section className="border-t border-gray-100 pt-5">
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-gray-800">
                            Pengaturan Patroli
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            Tentukan interval dan toleransi keterlambatan
                            patroli.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                          {/* Interval */}
                          <div>
                            <label
                              htmlFor="interval-minutes"
                              className="mb-1.5 block text-sm font-semibold text-gray-700"
                            >
                              Interval Patroli (Menit){" "}
                              <span className="text-red-500">*</span>
                            </label>

                            <input
                              id="interval-minutes"
                              type="number"
                              min="1"
                              value={intervalMinutes}
                              onChange={(e) =>
                                setIntervalMinutes(Number(e.target.value))
                              }
                              required
                              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                            />

                            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                              Jarak waktu antarpatroli yang dijadwalkan.
                            </p>
                          </div>
                        </div>

                        {/* Enforce Sequence */}
                        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-yellow-300 hover:bg-yellow-50/40">
                          <input
                            type="checkbox"
                            checked={enforceSequence}
                            onChange={(e) =>
                              setEnforceSequence(e.target.checked)
                            }
                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-yellow-400"
                          />

                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">
                              Wajib Mengikuti Urutan
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-gray-500">
                              Petugas harus mengunjungi titik patroli sesuai
                              urutan yang telah ditentukan.
                            </p>
                          </div>

                          <span
                            className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                              enforceSequence
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {enforceSequence ? "AKTIF" : "NONAKTIF"}
                          </span>
                        </label>
                      </section>

                      {/* Pemilihan Titik Patroli */}
                      <section className="border-t border-gray-100 pt-5">
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-gray-800">
                            Titik Patroli
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            Pilih titik yang akan dimasukkan ke dalam jadwal
                            patroli.
                          </p>
                        </div>

                        {/* Select All dan Jumlah Pilihan */}
                        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3.5 py-3">
                          <label className="flex cursor-pointer items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={
                                !!activePatrolPoints?.length &&
                                activePatrolPoints.every((point) =>
                                  points.some(
                                    (selected) =>
                                      selected.patrolPointId === point.id,
                                  ),
                                )
                              }
                              onChange={handleSelectAll}
                              disabled={!activePatrolPoints?.length}
                              className="h-4 w-4 cursor-pointer accent-yellow-400"
                            />

                            <span className="text-sm font-semibold text-gray-700">
                              Pilih Semua
                            </span>
                          </label>

                          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-800">
                            {points.length} dipilih
                          </span>
                        </div>

                        {/* Daftar Titik */}
                        {!activePatrolPoints?.length ? (
                          <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                            <p className="text-sm font-medium text-gray-600">
                              Belum ada titik patroli tersedia.
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              Tambahkan titik patroli terlebih dahulu.
                            </p>
                          </div>
                        ) : (
                          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                            {activePatrolPoints.map((point, index) => {
                              const isSelected = points.some(
                                (selected) =>
                                  selected.patrolPointId === point.id,
                              );

                              return (
                                <label
                                  key={point.id}
                                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                                    isSelected
                                      ? "border-yellow-400 bg-yellow-50"
                                      : "border-gray-200 bg-white hover:border-gray-300"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleSelectOne(point.id)}
                                    className="h-4 w-4 shrink-0 cursor-pointer accent-yellow-400"
                                  />

                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                                    {index + 1}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                      {point.name}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-gray-500">
                                      ID: {point.id}
                                    </p>
                                  </div>

                                  {isSelected && (
                                    <span className="shrink-0 rounded-md bg-yellow-100 px-2 py-1 text-[10px] font-bold text-yellow-800">
                                      DIPILIH
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {activePatrolPoints?.length > 0 &&
                          points.length === 0 && (
                            <p className="mt-2 text-xs text-amber-600">
                              Pilih minimal satu titik patroli sebelum menyimpan
                              jadwal.
                            </p>
                          )}
                      </section>
                    </div>
                  </section>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <section className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Atur Tanggal Patroli
                      </h4>

                      <p className="mt-1 text-xs text-gray-500">
                        Tentukan tanggal pelaksanaan untuk jadwal yang baru
                        dibuat.
                      </p>
                    </div>

                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Jadwal yang dibuat
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-800">
                        {name}
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        {startTime} - {endTime}
                      </p>
                    </div>

                    {/* INPUT TANGGAL */}
                    <div>
                      <label
                        htmlFor="patrol-dates"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Tanggal Pelaksanaan
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        id="patrol-dates"
                        type="date"
                        value=""
                        onChange={(e) => {
                          const date = e.target.value;

                          if (date && !dates.includes(date)) {
                            setDates((previousDates) =>
                              [...previousDates, date].sort(),
                            );
                          }
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-700 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      />
                    </div>

                    {/* DAFTAR TANGGAL */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h5 className="text-sm font-bold text-gray-800">
                          Tanggal yang Dipilih
                        </h5>

                        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-800">
                          {dates.length} tanggal
                        </span>
                      </div>

                      {dates.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                          <p className="text-sm text-gray-600">
                            Belum ada tanggal yang dipilih.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {dates.map((date) => (
                            <div
                              key={date}
                              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
                            >
                              <p className="text-sm font-semibold text-gray-800">
                                {new Date(
                                  `${date}T00:00:00`,
                                ).toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  setDates((previousDates) =>
                                    previousDates.filter(
                                      (item) => item !== date,
                                    ),
                                  )
                                }
                                className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <section className="space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Assign Security
                      </h4>

                      <p className="mt-1 text-xs text-gray-500">
                        Pilih petugas keamanan yang akan menjalankan jadwal
                        patroli.
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                      <div>
                        <p className="text-xs font-medium text-blue-700">
                          Security Tersedia
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Pilih satu atau beberapa petugas.
                        </p>
                      </div>

                      <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-white px-2 text-sm font-bold text-blue-700 shadow-sm ring-1 ring-blue-100">
                        {activeSecurity.length}
                      </span>
                    </div>

                    {activeSecurity.length > 0 ? (
                      <div className="space-y-3">
                        {activeSecurity.map((security) => {
                          const isSelected = selectedSecurityIds.includes(
                            security.id,
                          );

                          return (
                            <label
                              key={security.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                                isSelected
                                  ? "border-blue-400 bg-blue-50"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  handleSelectSecurity(security.id)
                                }
                                className="h-4 w-4 accent-blue-600"
                              />

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700">
                                {security.fullName
                                  ?.trim()
                                  .split(/\s+/)
                                  .slice(0, 2)
                                  .map((part) => part.charAt(0).toUpperCase())
                                  .join("") || "S"}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                  {security.fullName}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {security.role?.name || "Security"}
                                </p>
                              </div>

                              {isSelected && (
                                <span className="rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                                  DIPILIH
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                        <p className="text-sm font-medium text-gray-600">
                          Belum ada security tersedia.
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      {selectedSecurityIds.length} petugas dipilih.
                    </p>
                  </section>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-6 py-4 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1) {
                      handleCloseModal();
                    } else {
                      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
                    }
                  }}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  {currentStep === 1 ? "Batal" : "Kembali"}
                </button>

                <button
                  type="submit"
                  disabled={
                    (currentStep === 1 && points.length === 0) ||
                    (currentStep === 2 &&
                      (dates.length === 0 || isCreatingDates)) ||
                    (currentStep === 3 &&
                      (selectedSecurityIds.length === 0 || isAssigning))
                  }
                  className="flex items-center justify-center rounded-lg bg-[#FED400] px-5 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentStep === 1
                    ? "Buat Jadwal & Lanjutkan"
                    : currentStep === 2
                      ? isCreatingDates
                        ? "Menyimpan Tanggal..."
                        : "Simpan Tanggal & Lanjutkan"
                      : isAssigning
                        ? "Menyimpan Assignment..."
                        : "Simpan & Selesaikan"}
                </button>
              </div>
            </form>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button type="submit">Tutup</button>
          </form>
        </dialog>
        {/* MODAL CREATE SCHEDULE*/}

        {/* Jadwal Patroli */}
        <div className="bg-white rounded-lg p-4 mt-4">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-lg font-bold">
                Roster Rotasi Bulan ({monthLabel})
              </p>

              <p className="text-sm text-gray-500 font-semibold">
                Jadwal penugasan terpadu Satpam Gardu Induk Gambir 150kV
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Legend Shift */}
              <div className="flex items-center gap-2">
                {Object.entries(shiftConfig).map(([kode, config]) => (
                  <div
                    key={kode}
                    className={`rounded border px-2 py-1 ${config.style}`}
                  >
                    <p className="text-xs font-bold">{config.label}</p>
                  </div>
                ))}
              </div>

              {/* Filter Bulan */}
              <select
                value={rosterMonth}
                onChange={(e) => setRosterMonth(Number(e.target.value))}
                className="select select-bordered select-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleDateString("id-ID", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              {/* Filter Tahun */}
              <select
                value={rosterYear}
                onChange={(e) => setRosterYear(Number(e.target.value))}
                className="select select-bordered select-sm"
              >
                {[2026, 2027, 2028].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-md"
              >
                <ArrowSwapHorizontal size={16} color="#4b5563" />

                <p className="text-sm text-gray-600 font-bold">Tukar Shift</p>
              </button>
            </div>
          </div>

          {/* Tabel */}
          <div className="mt-6 w-full overflow-x-auto border border-gray-200 rounded-lg shadow-inner">
            <table className="w-full border-collapse min-w-max text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="sticky left-0 z-20 bg-gray-100 p-3 text-left font-bold text-gray-700 border-b border-r border-gray-300 shadow-[1px_0_0_0_#d1d5db] min-w-[200px]">
                    Nama Petugas
                  </th>

                  {kalenderBulanIni.map((item) => (
                    <th
                      key={item.tgl}
                      className={`border-b border-gray-200 p-2 text-center min-w-[55px] ${
                        item.isLibur
                          ? "bg-red-50 text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {item.hari}
                        </span>

                        <span className="text-sm font-bold">({item.tgl})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {isRosterLoading && (
                  <tr>
                    <td
                      colSpan={kalenderBulanIni.length + 1}
                      className="p-8 text-center text-gray-500"
                    >
                      Memuat data roster dari database...
                    </td>
                  </tr>
                )}

                {/* Error */}
                {!isRosterLoading && isRosterError && (
                  <tr>
                    <td
                      colSpan={kalenderBulanIni.length + 1}
                      className="p-8 text-center text-red-500"
                    >
                      Gagal memuat roster: {rosterError.message}
                    </td>
                  </tr>
                )}

                {/* Site belum tersedia */}
                {!isRosterLoading && !siteId && (
                  <tr>
                    <td
                      colSpan={kalenderBulanIni.length + 1}
                      className="p-8 text-center text-gray-500"
                    >
                      Site pengguna belum tersedia.
                    </td>
                  </tr>
                )}

                {/* Data kosong */}
                {!isRosterLoading &&
                  !isRosterError &&
                  siteId &&
                  roster.length === 0 && (
                    <tr>
                      <td
                        colSpan={kalenderBulanIni.length + 1}
                        className="p-8 text-center text-gray-500"
                      >
                        Tidak ada penugasan aktif pada bulan {monthLabel}.
                      </td>
                    </tr>
                  )}

                {/* Data dari database */}
                {!isRosterLoading &&
                  !isRosterError &&
                  roster.map((petugas) => (
                    <tr
                      key={petugas.userId}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      {/* Identitas Petugas */}
                      <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-gray-800 border-b border-r border-gray-300 shadow-[1px_0_0_0_#d1d5db]">
                        <div>{petugas.fullName}</div>

                        <div className="text-xs text-gray-500 font-normal">
                          {petugas.employeeNumber ?? "-"}
                        </div>
                      </td>

                      {/* Shift Setiap Tanggal */}
                      {kalenderBulanIni.map((item) => {
                        const dateKey = [
                          rosterYear,
                          String(rosterMonth).padStart(2, "0"),
                          String(item.tgl).padStart(2, "0"),
                        ].join("-");

                        const shift = petugas.shifts[dateKey];

                        const config = shift ? shiftConfig[shift] : undefined;

                        return (
                          <td
                            key={dateKey}
                            className={`border-b border-l border-gray-200 p-1.5 ${
                              item.isLibur ? "bg-red-50/30" : ""
                            }`}
                          >
                            <div className="flex justify-center items-center h-full">
                              {shift ? (
                                <div
                                  title={`${petugas.fullName} - ${dateKey}`}
                                  className={`w-7 h-7 flex items-center justify-center rounded border font-bold text-xs shadow-sm ${
                                    config?.style ??
                                    "bg-gray-100 text-gray-600 border-gray-200"
                                  }`}
                                >
                                  {shift}
                                </div>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManage;

import React, { useMemo, useState } from "react";
import {
  useCreatePatrolSchedule,
  useDeletePatrolSchedule,
  usePatrolScheduleActivate,
  usePatrolSchedules,
  useUpdatePatrolSchedule,
} from "../../hooks/schedule/usePatrolSchedules";
import {
  AddSquare,
  BoxTime,
  CalendarAdd,
  CloseCircle,
  Edit2,
  LocationAdd,
  TickCircle,
  Trash,
} from "iconsax-react";
import type {
  AddSchedulePointPayload,
  CreatePatrolSchedulePayload,
  CreateSchedulePointInput,
  PatrolScheduleListItem,
} from "../../types";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { usePatrolPoints } from "../../hooks/patrol-point/usePatrolPoints";
import { formatDuration } from "../../helpers/dateTime";
import { useAddNewPoint } from "../../hooks/schedule/usePatrolSchedulePoint";

const PatrolSchedule = () => {
  const { user } = useAuthContext();
  const siteId = user?.siteId;

  const { data: patrolPoint, isError: isPatrolPointsError } = usePatrolPoints();
  const { data: patrolSchedules } = usePatrolSchedules();

  const { mutateAsync: createPS } = useCreatePatrolSchedule();
  const { mutate: activateSchedule, isPending: isActivating } =
    usePatrolScheduleActivate();
  const { mutateAsync: deleteShift } = useDeletePatrolSchedule();
  const { mutateAsync: updateShift, isPending: isUpdating } =
    useUpdatePatrolSchedule();

  const { mutateAsync: addPoint, isPending: isCreating } = useAddNewPoint();

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState<number>(120);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState<number>(30);
  const [enforceSequence, setEnforceSequence] = useState<boolean>(false);
  const [points, setPoints] = useState<CreateSchedulePointInput[]>([]);

  const [updateName, setUpdateName] = useState("");
  const [updateStartTime, setUpdateStartTime] = useState("");
  const [updateEndTime, setUpdateEndTime] = useState("");
  const [updateIntervalMinutes, setUpdateIntervalMinutes] =
    useState<number>(120);
  const [updateGracePeriodMinutes, setUpdateGracePeriodMinutes] =
    useState<number>(30);
  const [updateEnforceSequence, setUpdateEnforceSequence] = useState(false);

  const [patrolPointId, setPatrolPointId] = useState("");
  const [insertAtSequence, setInsertAtSequence] = useState<number>(1);
  const [required, setRequired] = useState<boolean>(true);

  const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "DRAFT">(
    "ACTIVE",
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<PatrolScheduleListItem | null>(null);

  const [activatingScheduleId, setActivatingScheduleId] = useState<
    string | null
  >(null);

  const filteredSchedules = useMemo(() => {
    return patrolSchedules?.data.filter(
      (schedule) => schedule.status === selectedStatus,
    );
  }, [patrolSchedules, selectedStatus]);

  const activePatrolPoints = useMemo(() => {
    return patrolPoint?.filter((point) => point.status === "ACTIVE") ?? [];
  }, [patrolPoint]);

  const registeredPatrolPoints = useMemo(() => {
    if (!selectedSchedule) return [];

    return activePatrolPoints
      .flatMap((point) =>
        (point.schedulePoints ?? [])
          .filter(
            (schedulePoint) => schedulePoint.scheduleId === selectedSchedule.id,
          )
          .map((schedulePoint) => ({
            id: schedulePoint.id,
            patrolPointId: point.id,
            code: point.code,
            name: point.name,
            sequence: schedulePoint.sequence,
            required: schedulePoint.required,
          })),
      )
      .sort((a, b) => a.sequence - b.sequence);
  }, [activePatrolPoints, selectedSchedule]);

  console.log("SelectedSchedule", JSON.stringify(selectedSchedule, null, 2));
  console.log("REGITERDATA", JSON.stringify(registeredPatrolPoints, null, 2));

  const availablePatrolPoints = useMemo(() => {
    const registeredIds = new Set(
      registeredPatrolPoints.map((point) => point.patrolPointId),
    );

    return activePatrolPoints.filter((point) => !registeredIds.has(point.id));
  }, [activePatrolPoints, registeredPatrolPoints]);

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

  const handleOpenActivateModal = (schedule: PatrolScheduleListItem) => {
    setSelectedSchedule(schedule);
    openModal("activate_shift");
  };

  const handleAddPointModal = (schedule: PatrolScheduleListItem) => {
    setSelectedSchedule(schedule);

    setPatrolPointId("");
    setInsertAtSequence(1);
    setRequired(true);
    openModal("add_point");
  };

  const handleUpdateModal = (schedule: PatrolScheduleListItem) => {
    setSelectedSchedule(schedule);

    setUpdateName(schedule.name ?? "");
    setUpdateStartTime(schedule.startTime ?? "");
    setUpdateEndTime(schedule.endTime ?? "");
    setUpdateIntervalMinutes(schedule.intervalMinutes ?? 120);
    setUpdateGracePeriodMinutes(schedule.gracePeriodMinutes ?? 30);
    setUpdateEnforceSequence(schedule.enforceSequence ?? false);
    openModal("update_schedule");
  };

  // Menutup modal dan membersihkan jadwal yang dipilih.
  //   const handleCloseActivateModal = () => {
  //     if (isActivating) return;

  //     closeModal("activate_shift");
  //     setSelectedSchedule(null);
  //   };

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

  const createPatrolSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      closeModal("add_schedule");

      // Reset form setelah berhasil menyimpan
      setName("");
      setStartTime("");
      setEndTime("");
      setIntervalMinutes(120);
      setGracePeriodMinutes(30);
      setEnforceSequence(false);
      setPoints([]);
    } catch (error) {
      console.error("Error saat membuat jadwal patroli:", error);
    }
  };

  const handleDeleteSchedule = async (schedule: PatrolScheduleListItem) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus jadwal "${schedule.name}"?`,
    );

    if (!confirmed) return;

    console.log("Hapus jadwal:", schedule.id);

    // Hubungkan ke mutation delete dari backend.
    try {
      await deleteShift(schedule.id);
    } catch (error) {
      console.log("Gagal menghapus shift", error);
    }
  };

  const handleEditSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSchedule) {
      console.log("Schedule tidak ada");
      return;
    }

    if (!updateName.trim()) {
      window.alert("Nama jadwal wajib diisi.");
      return;
    }

    if (!updateStartTime || !updateEndTime) {
      window.alert("Waktu mulai dan selesai wajib diisi.");
      return;
    }

    if (updateStartTime === updateEndTime) {
      window.alert("Waktu mulai dan selesai tidak boleh sama.");
      return;
    }

    if (updateIntervalMinutes <= 0 || updateGracePeriodMinutes < 0) {
      window.alert("Interval atau grace period tidak valid.");
      return;
    }

    const payload = {
      name: updateName.trim(),
      startTime: updateStartTime,
      endTime: updateEndTime,
      intervalMinutes: updateIntervalMinutes,
      gracePeriodMinutes: updateGracePeriodMinutes,
      enforceSequence: updateEnforceSequence,
    };
    console.log("UPDATE PAYLOD", JSON.stringify(payload, null, 2));

    try {
      await updateShift({ id: selectedSchedule.id, payload });
      console.log("Berhasil melakukan update patrol schedule");
      closeModal("update_schedule");
    } catch (error) {
      console.log("Gagal saat update schedule", error);
    }
  };

  const handleAddPoint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSchedule) {
      console.log("Schedule tidak ada");
      return;
    }

    if (!patrolPointId) {
      console.error("Patrol Point harus dipilih");
      return;
    }

    if (!Number.isInteger(insertAtSequence) || insertAtSequence < 1) {
      console.error(
        "Urutan Patrol Point harus berupa bilangan bulat minimal 1.",
      );
      return;
    }

    if (isCreating) {
      return;
    }

    const payload: AddSchedulePointPayload = {
      patrolPointId,
      insertAtSequence,
      required,
    };
    console.log(
      "ADD PATROL POINT PAYLOAD:",
      JSON.stringify(
        {
          scheduleId: selectedSchedule.id,
          ...payload,
        },
        null,
        2,
      ),
    );

    try {
      await addPoint({ scheduleId: selectedSchedule.id, payload });
      console.log("Berhasil tambah patrol point");

      setPatrolPointId("");
      setInsertAtSequence(1);
      setRequired(true);

      closeModal("add_point");
    } catch (error) {
      console.log("Error saat menambahkan patrol point", error);
    }
  };

  const handleActivateSchedule = async () => {
    if (!selectedSchedule || isActivating) return;

    const scheduleId = selectedSchedule.id;
    setActivatingScheduleId(scheduleId);

    try {
      const result = await activateSchedule(scheduleId);
      closeModal("activate_shift");
      console.log("Schedule berhasil diaktifkan: ", result);
    } catch (error) {
      console.error("Gagal mengaktifkan schedule:", error);
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
        <div className="my-5 grid grid-cols-2 gap-4">
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
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                openModal("add_schedule");
              }}
              className="flex items-center bg-[#FED400] rounded-lg px-4 py-2 cursor-pointer"
            >
              <AddSquare size={20} color="black" />
              <p className="text-sm font-semibold ml-2">Buat / Tambah Jadwal</p>
            </button>
          </div>
        </div>

        {/* Table Jadwal Shift */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          {/* Header Tabel */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50/80 px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Daftar Jadwal Shift
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Kelola jadwal rotasi dan status operasional
              </p>
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] table-fixed text-center">
              <thead className="">
                <tr className="border-b border-gray-200 bg-white">
                  <th className="w-[17%] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Nama Jadwal
                  </th>
                  <th className="w-[17%] px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Jam Operasional
                  </th>
                  <th className="w-[16%] px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Interval
                  </th>
                  <th className="w-[15%] px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Titik Patrol
                  </th>
                  <th className="w-[13%] px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="w-[15%] px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {(filteredSchedules?.length ?? 0 > 0) ? (
                  filteredSchedules?.map((schedule) => {
                    const isDraft = schedule.status === "DRAFT";

                    return (
                      <tr
                        key={schedule.id}
                        className="group transition-colors hover:bg-blue-50/30"
                      >
                        {/* Nama Jadwal */}
                        <td className="px-6 py-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                isDraft
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-blue-50 text-[#003B73]"
                              }`}
                            >
                              <BoxTime size={19} color="orange" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {schedule.name}
                              </p>
                              <p className="mt-0.5 text-[11px] text-gray-500">
                                Rotasi 3-Shift
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Jam Operasional */}
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-700">
                            <p className="">{schedule.startTime}</p>
                            <span className="text-gray-400">–</span>
                            <p className="">{schedule.endTime}</p>
                          </div>
                          <p className="mt-1 text-[10px] text-gray-400">WITA</p>
                        </td>

                        {/* Interval */}
                        <td className="px-3 py-3">
                          <p className="text-sm font-semibold text-gray-700 text-center">
                            {formatDuration(schedule.intervalMinutes)}
                          </p>
                        </td>

                        {/* Titik Patroli */}
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-2.5">
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {schedule._count?.points ?? 0}
                              </p>

                              <p className="mt-0.5 text-[10px] text-gray-500">
                                Titik patroli
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              isDraft
                                ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
                                : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isDraft ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                            />
                            {isDraft ? "DRAFT" : "ACTIVE"}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {isDraft ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSchedule(schedule)}
                                  title="Hapus shift"
                                  aria-label={`Hapus shift ${schedule.name}`}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
                                >
                                  <Trash size={17} color="#DC2626" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenActivateModal(schedule)
                                  }
                                  disabled={isActivating}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#003B73] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#00529C] focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                >
                                  {activatingScheduleId === schedule.id ? (
                                    <>
                                      <span className="loading loading-spinner loading-xs" />
                                      Mengaktifkan...
                                    </>
                                  ) : (
                                    <>
                                      <TickCircle size={16} color="white" />
                                      Aktifkan
                                    </>
                                  )}
                                </button>
                              </>
                            ) : (
                              <>
                                {/* Add Point */}
                                <button
                                  type="button"
                                  onClick={() => handleAddPointModal(schedule)}
                                  title="Add new"
                                  aria-label={`Add new ${schedule.name}`}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#003B73] transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                                >
                                  <LocationAdd size={17} color="#003B73" />
                                </button>
                                {/* Edit Shift */}
                                <button
                                  type="button"
                                  onClick={() => handleUpdateModal(schedule)}
                                  title="Edit shift"
                                  aria-label={`Edit shift ${schedule.name}`}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#003B73] transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                                >
                                  <Edit2 size={17} color="#003B73" />
                                </button>

                                {/* Hapus Shift */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSchedule(schedule)}
                                  title="Hapus shift"
                                  aria-label={`Hapus shift ${schedule.name}`}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
                                >
                                  <Trash size={17} color="#DC2626" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-200 text-gray-400">
                          <BoxTime size={22} color="gray" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-gray-700">
                          Belum ada jadwal{" "}
                          {selectedStatus === "DRAFT" ? "draft" : "aktif"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Jadwal dengan status ini akan ditampilkan di sini.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/70 px-4 py-2.5">
            <p className="text-[11px] text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {filteredSchedules?.length}
              </span>{" "}
              jadwal
            </p>

            <p className="text-[11px] text-gray-400">
              PAMAREA · Patrol Schedule
            </p>
          </div>
        </div>
        {/* Table Jadwal Shift */}

        {/* Modal Add Schedule */}
        <dialog id="add_schedule" className="modal">
          <div className="modal-box flex max-h-[92vh] w-11/12 max-w-2xl flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <CalendarAdd size={21} color="#003B73" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Buat Shift Patroli
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Konfigurasikan jadwal operasional dan titik patroli.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeModal("add_schedule");
                }}
                aria-label="Tutup modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <CloseCircle size={21} color="gray" />
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={createPatrolSchedule}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                {/* SECTION 1: INFORMASI JADWAL */}
                <section>
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-800">
                      Informasi Jadwal
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Tentukan nama shift dan jam operasional.
                    </p>
                  </div>

                  {/* Nama Shift */}
                  <div>
                    <label
                      htmlFor="schedule-name"
                      className="mb-1.5 block text-xs font-semibold text-gray-700"
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
                      maxLength={100}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#003B73] focus:ring-2 focus:ring-blue-50"
                    />
                  </div>

                  {/* Jam Operasional */}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="start-time"
                        className="mb-1.5 block text-xs font-semibold text-gray-700"
                      >
                        Waktu Mulai <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#003B73] focus:ring-2 focus:ring-blue-50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="end-time"
                        className="mb-1.5 block text-xs font-semibold text-gray-700"
                      >
                        Waktu Selesai <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#003B73] focus:ring-2 focus:ring-blue-50"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50/70 px-3 py-2.5">
                    <CalendarAdd
                      size={16}
                      color="#003B73"
                      className="mt-0.5 shrink-0"
                    />
                    <p className="text-xs leading-relaxed text-gray-600">
                      Jadwal yang dibuat akan berstatus{" "}
                      <span className="font-bold text-amber-700">DRAFT</span>{" "}
                      sampai diaktifkan melalui tabel jadwal.
                    </p>
                  </div>
                </section>

                {/* SECTION 2: PENGATURAN PATROLI */}
                <section className="border-t border-gray-100 pt-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-800">
                      Pengaturan Patroli
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Atur interval patroli dan toleransi keterlambatan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Interval */}
                    <div>
                      <label
                        htmlFor="interval-minutes"
                        className="mb-1.5 block text-xs font-semibold text-gray-700"
                      >
                        Interval Patroli <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <input
                          id="interval-minutes"
                          type="number"
                          min={1}
                          value={intervalMinutes}
                          onChange={(e) =>
                            setIntervalMinutes(Number(e.target.value))
                          }
                          required
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-16 text-sm text-gray-700 outline-none transition focus:border-[#003B73] focus:ring-2 focus:ring-blue-50"
                        />

                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          Menit
                        </span>
                      </div>

                      <p className="mt-1.5 text-[11px] text-gray-400">
                        Jarak waktu antarpatroli.
                      </p>
                    </div>

                    {/* Grace Period */}
                    <div>
                      <label
                        htmlFor="grace-period"
                        className="mb-1.5 block text-xs font-semibold text-gray-700"
                      >
                        Toleransi Keterlambatan
                      </label>

                      <div className="relative">
                        <input
                          id="grace-period"
                          type="number"
                          min={0}
                          value={gracePeriodMinutes}
                          onChange={(e) =>
                            setGracePeriodMinutes(Number(e.target.value))
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-16 text-sm text-gray-700 outline-none transition focus:border-[#003B73] focus:ring-2 focus:ring-blue-50"
                        />

                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          Menit
                        </span>
                      </div>

                      <p className="mt-1.5 text-[11px] text-gray-400">
                        Batas keterlambatan patroli.
                      </p>
                    </div>
                  </div>

                  {/* Enforce Sequence */}
                  <label
                    htmlFor="enforce-sequence"
                    className={`mt-4 flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                      enforceSequence
                        ? "border-[#003B73]/30 bg-blue-50/60"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      id="enforce-sequence"
                      type="checkbox"
                      checked={enforceSequence}
                      onChange={(e) => setEnforceSequence(e.target.checked)}
                      className="h-4 w-4 shrink-0 cursor-pointer accent-[#003B73]"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800">
                        Wajib Mengikuti Urutan
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                        Petugas harus mengunjungi titik sesuai urutan yang
                        ditentukan.
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${
                        enforceSequence
                          ? "bg-blue-100 text-[#003B73]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {enforceSequence ? "AKTIF" : "NONAKTIF"}
                    </span>
                  </label>
                </section>

                {/* SECTION 3: TITIK PATROLI */}
                <section className="border-t border-gray-100 pt-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">
                        Titik Patroli
                        <span className="ml-1 text-red-500">*</span>
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Pilih titik yang harus dikunjungi petugas.
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#003B73]">
                      {points.length}/{activePatrolPoints?.length ?? 0}
                    </span>
                  </div>

                  {/* Select All */}
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-3">
                    <label className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={
                          !!activePatrolPoints?.length &&
                          activePatrolPoints.every((point) =>
                            points.some(
                              (selected) => selected.patrolPointId === point.id,
                            ),
                          )
                        }
                        onChange={handleSelectAll}
                        disabled={!activePatrolPoints?.length}
                        className="h-4 w-4 cursor-pointer accent-[#003B73] disabled:cursor-not-allowed"
                      />

                      <span className="text-xs font-semibold text-gray-700">
                        Pilih Semua Titik
                      </span>
                    </label>

                    <span className="text-[11px] text-gray-500">
                      {points.length} dipilih
                    </span>
                  </div>

                  {/* Daftar Titik */}
                  {!activePatrolPoints?.length ? (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-gray-600">
                        Belum ada titik patroli
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Tambahkan atau aktifkan titik patroli terlebih dahulu.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                      {activePatrolPoints.map((point, index) => {
                        const isSelected = points.some(
                          (selected) => selected.patrolPointId === point.id,
                        );

                        return (
                          <label
                            key={point.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                              isSelected
                                ? "border-[#003B73]/30 bg-blue-50/50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(point.id)}
                              className="h-4 w-4 shrink-0 cursor-pointer accent-[#003B73]"
                            />

                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                isSelected
                                  ? "bg-[#003B73] text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-gray-800">
                                {point.name}
                              </p>

                              <p className="mt-0.5 truncate text-[10px] text-gray-400">
                                ID: {point.id}
                              </p>
                            </div>

                            {isSelected && (
                              <span className="shrink-0 rounded-md bg-blue-100 px-2 py-1 text-[9px] font-bold text-[#003B73]">
                                DIPILIH
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {activePatrolPoints?.length > 0 && points.length === 0 && (
                    <p className="mt-2 text-[11px] font-medium text-amber-600">
                      Pilih minimal satu titik patroli sebelum menyimpan jadwal.
                    </p>
                  )}
                </section>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-5 py-4">
                <p className="hidden text-[11px] text-gray-400 sm:block">
                  <span className="text-red-500">*</span> Wajib diisi
                </p>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeModal("add_schedule");
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={
                      points.length === 0 || !activePatrolPoints?.length
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003B73] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#00529C] disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <CalendarAdd size={16} color="white" />
                    Simpan Jadwal
                  </button>
                </div>
              </div>
            </form>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button aria-label="Tutup modal">close</button>
          </form>
        </dialog>
        {/* Modal Add Schedule */}

        {/* Modal Update Schedule */}
        <dialog id="update_schedule" className="modal">
          <div className="modal-box flex max-h-[92vh] w-11/12 max-w-2xl flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <CalendarAdd size={21} color="#003B73" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Update {selectedSchedule?.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Update jadwal operasional dan titik patroli.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeModal("update_schedule");
                }}
                aria-label="Tutup modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <CloseCircle size={21} color="gray" />
              </button>
            </div>

            <form
              onSubmit={handleEditSchedule}
              className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
            >
              {/* Nama Jadwal */}
              <div className="form-control">
                <label className="mb-1.5 text-sm font-semibold text-gray-700">
                  Nama Jadwal
                </label>

                <input
                  type="text"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  placeholder="Masukkan nama jadwal"
                  className="input input-bordered w-full rounded-xl"
                  required
                />
              </div>

              {/* Waktu Mulai dan Selesai */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="form-control">
                  <label className="mb-1.5 text-sm font-semibold text-gray-700">
                    Waktu Mulai
                  </label>

                  <input
                    type="time"
                    value={updateStartTime}
                    onChange={(e) => setUpdateStartTime(e.target.value)}
                    className="input input-bordered w-full rounded-xl"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="mb-1.5 text-sm font-semibold text-gray-700">
                    Waktu Selesai
                  </label>

                  <input
                    type="time"
                    value={updateEndTime}
                    onChange={(e) => setUpdateEndTime(e.target.value)}
                    className="input input-bordered w-full rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Interval dan Grace Period */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="form-control">
                  <label className="mb-1.5 text-sm font-semibold text-gray-700">
                    Interval Pemeriksaan (Menit)
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={updateIntervalMinutes}
                    onChange={(e) =>
                      setUpdateIntervalMinutes(Number(e.target.value))
                    }
                    className="input input-bordered w-full rounded-xl"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="mb-1.5 text-sm font-semibold text-gray-700">
                    Grace Period (Menit)
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={updateGracePeriodMinutes}
                    onChange={(e) =>
                      setUpdateGracePeriodMinutes(Number(e.target.value))
                    }
                    className="input input-bordered w-full rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Enforce Sequence */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Urutan Titik Patroli
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Petugas harus mengunjungi titik patroli sesuai urutan.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={updateEnforceSequence}
                  onChange={(e) => setUpdateEnforceSequence(e.target.checked)}
                  className="toggle toggle-primary"
                />
              </label>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => closeModal("update_schedule")}
                  className="btn rounded-xl border-gray-300 bg-white"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isUpdating || !selectedSchedule}
                  className="btn rounded-xl border-none bg-[#003B73] text-white hover:bg-[#00529C]"
                >
                  {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
        {/* Modal Update Schedule */}

        {/* Modal Aktivasi */}
        <dialog id="activate_shift" className="modal">
          <div className="modal-box flex max-h-[92vh] w-11/12 max-w-2xl flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <BoxTime size={21} color="#003B73" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Aktifkan Shift Patroli
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Pastikan jadwal yang dipilih sudah benar.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => closeModal("activate_shift")}
                disabled={isActivating}
                aria-label="Tutup modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 cursor-pointer"
              >
                <CloseCircle size={21} color="gray" />
              </button>
            </div>

            {/* Isi modal */}
            <div className="px-5 py-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Shift yang akan diaktifkan
                </p>

                <h3 className="mt-1 text-base font-bold text-gray-800">
                  {selectedSchedule?.name ?? "-"}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-gray-500">Jam operasional</p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {selectedSchedule?.startTime ?? "-"} –{" "}
                      {selectedSchedule?.endTime ?? "-"}
                    </p>
                    <p className="text-[10px] text-gray-400">WITA</p>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-500">Titik patroli</p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {selectedSchedule?._count?.points ?? 0} titik
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Apakah kamu yakin ingin mengaktifkan shift ini? Pastikan
                konfigurasi jadwal dan titik patroli sudah sesuai sebelum
                melanjutkan.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4">
              <button
                type="button"
                onClick={() => closeModal("activate_shift")}
                disabled={isActivating}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleActivateSchedule}
                disabled={!selectedSchedule || isActivating}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003B73] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#00529C] focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isActivating ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Mengaktifkan...
                  </>
                ) : (
                  <>
                    <TickCircle size={16} color="white" />
                    Konfirmasi Aktivasi
                  </>
                )}
              </button>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button type="submit" disabled={isActivating}>
              tutup
            </button>
          </form>
        </dialog>
        {/* Modal Aktivasi */}

        {/* Modal Add Point */}
        <dialog id="add_point" className="modal">
          <div className="modal-box flex max-h-[92vh] w-11/12 max-w-3xl flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Kelola Patrol Point
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Periksa checkpoint yang terdaftar dan tambahkan checkpoint
                  baru.
                </p>

                {selectedSchedule && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                    <span className="text-xs font-medium text-slate-500">
                      Jadwal:
                    </span>

                    <span className="text-sm font-semibold text-[#003B73]">
                      {selectedSchedule.name}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => closeModal("add_point")}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
              {/* Titik Patrol Terdaftar */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Titik Patrol Terdaftar
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Daftar titik patrol yang sudah terhubung dengan jadwal
                      ini.
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {registeredPatrolPoints.length} Titik
                  </span>
                </div>

                {registeredPatrolPoints.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="max-h-56 overflow-y-auto">
                      {registeredPatrolPoints.map((point, index) => (
                        <div
                          key={point.id}
                          className="flex items-center gap-3 border-b border-slate-100 p-3 last:border-b-0"
                        >
                          {/* Nomor Urutan */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                            {point.sequence ?? index + 1}
                          </div>

                          {/* Informasi Titik */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {point.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {point.code}
                            </p>
                          </div>

                          {/* Status Required */}
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                              point.required
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {point.required ? "Wajib" : "Opsional"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      Belum ada titik patrol
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pilih titik patrol di bawah untuk menambahkannya ke jadwal
                      ini.
                    </p>
                  </div>
                )}
              </div>

              {/* FORM TAMBAH PATROL POINT */}
              <form
                id="add-point-form"
                onSubmit={handleAddPoint}
                className="space-y-5 border-t border-slate-200 pt-6"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Tambahkan Patrol Point
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Pilih checkpoint yang akan dimasukkan ke jadwal ini.
                  </p>
                </div>

                {/* SELECT PATROL POINT */}
                <div>
                  <label
                    htmlFor="patrolPointId"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Pilih Titik Patrol
                  </label>

                  <select
                    id="patrolPointId"
                    value={patrolPointId}
                    onChange={(e) => setPatrolPointId(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="">Pilih titik patrol</option>

                    {availablePatrolPoints.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.code} — {point.name}
                      </option>
                    ))}
                  </select>
                  {availablePatrolPoints.length === 0 && (
                    <p className="mt-2 text-xs text-emerald-600">
                      Semua titik patrol sudah terdaftar pada jadwal ini.
                    </p>
                  )}

                  {isPatrolPointsError && (
                    <p className="mt-2 text-xs text-red-500">
                      Tidak dapat mengambil daftar Patrol Point. Silakan coba
                      lagi.
                    </p>
                  )}
                </div>

                {/* URUTAN DAN STATUS WAJIB */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="mt-4">
                    <label
                      htmlFor="insertAtSequence"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Posisi Urutan
                    </label>

                    <input
                      id="insertAtSequence"
                      type="number"
                      min={1}
                      max={registeredPatrolPoints.length + 1}
                      value={insertAtSequence}
                      onChange={(e) =>
                        setInsertAtSequence(Number(e.target.value))
                      }
                      className="input input-bordered w-full"
                    />

                    <p className="mt-1 text-xs text-slate-500">
                      Tentukan posisi titik patrol dalam urutan jadwal.
                    </p>
                  </div>

                  <label className="mt-4 flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={required}
                      onChange={(e) => setRequired(e.target.checked)}
                      className="checkbox checkbox-primary"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Titik patrol wajib dikunjungi
                      </p>

                      <p className="text-xs text-slate-500">
                        Satpam diwajibkan mengunjungi titik ini saat patroli.
                      </p>
                    </div>
                  </label>
                </div>

                <div>
                  {/* FOOTER */}
                  <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                    <button
                      type="button"
                      onClick={() => closeModal("add_point")}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Tutup
                    </button>

                    <button
                      type="submit"
                      disabled={
                        !patrolPointId || availablePatrolPoints.length === 0
                      }
                      className="btn btn-primary"
                    >
                      Tambahkan Titik
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default PatrolSchedule;

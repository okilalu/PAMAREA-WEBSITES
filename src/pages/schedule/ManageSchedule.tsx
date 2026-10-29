import {
  AddSquare,
  BoxTime,
  Calendar,
  CalendarAdd,
  CardPos,
  CloseCircle,
  People,
  Send,
  UserAdd,
} from "iconsax-react";
import React, { useMemo, useState } from "react";
import { usePatrolSchedules } from "../../hooks/schedule/usePatrolSchedules";
import { useSecurityUsers } from "../../hooks/users/useUsers";
import {
  useCreateScheduleAssigment,
  useGetScheduleAssigments,
} from "../../hooks/schedule/usePatrolScheduleAssignment";
import type {
  CreateScheduleAssignmentPayload,
  PatrolScheduleListItem,
} from "../../types";

const ManageSchedule = () => {
  const { data: patrolSchedule } = usePatrolSchedules();
  const { data: security } = useSecurityUsers();
  const { data: scheduleAssigment } = useGetScheduleAssigments();

  const { mutateAsync: assignUser, isPending: isAssigning } =
    useCreateScheduleAssigment();

  const assignment = scheduleAssigment ?? [];

  const [selectedUserId, setSelectedUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSchedule, setSelectedSchedule] =
    useState<PatrolScheduleListItem | null>(null);

  const [search, setSearch] = useState({
    // security: "",
    // secondSecurity: "",
    singleSecurity: "",
  });

  const filteredSchedules = useMemo(() => {
    return patrolSchedule?.data ?? [];
  }, [patrolSchedule]);

  const activeSchedule = useMemo(() => {
    return patrolSchedule?.data.filter((s) => s.status === "ACTIVE");
  }, [patrolSchedule]);

  const draftSchedule = useMemo(() => {
    return patrolSchedule?.data.filter((s) => s.status === "DRAFT");
  }, [patrolSchedule]);

  const activeSecurity = useMemo(() => {
    return security?.data.filter((s) => s.status === "ACTIVE");
  }, [security]);

  const searchSecurity = activeSecurity?.filter((item) => {
    const searchSecurity = search.singleSecurity.toLowerCase();
    const matchSecurity = item.fullName.toLowerCase().includes(searchSecurity);

    return matchSecurity;
  });

  const summaryCard = [
    {
      title: "Jadwal Aktif",
      Value: activeSchedule?.length,
      description: "Jadwal Sedang Berjalan",
      icon: <BoxTime size={23} color="green" />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Jadwal Draft",
      Value: draftSchedule?.length,
      description: "Jadwal yang belum diaktifkan",
      icon: <Calendar size={23} color="orange" />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Petugas Keamanan",
      Value: activeSecurity?.length,
      description: "Petugas dengan status aktif",
      icon: <People size={23} color="green" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
  ];

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

  const handleAssignUserModal = (selected: PatrolScheduleListItem) => {
    setSelectedSchedule(selected);

    setSelectedUserId("");
    setStartDate("");
    setEndDate("");

    setSearch((prev) => ({
      ...prev,
      singleSecurity: "",
    }));

    openModal("assignment_single");
  };

  const createSingleData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSchedule) {
      console.log("Pilih jadwal shift terlebih dahulu.");
      return;
    }

    if (!selectedUserId || !startDate) {
      console.error("User ID dan tanggal mulai wajib diisi");
      return;
    }

    if (endDate && endDate < startDate) {
      console.error(
        "Tanggal akhir tidak boleh lebih awal daripada tanggal mulai.",
      );
      return;
    }

    const payload: CreateScheduleAssignmentPayload = {
      userId: selectedUserId,
      startDate,
      endDate: endDate || null,
    };

    try {
      const result = await assignUser({
        scheduleId: selectedSchedule.id,
        payload,
      });

      setStartDate("");
      setEndDate("");
      setSelectedUserId("");
      setSelectedSchedule(null);

      alert("Success create data");
      console.log("Berhasil create data", result);
      closeModal("assignment_single");
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
        <div className="mt-5 grid grid-cols-2 gap-4">
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
                (
                  document.getElementById(
                    "add_schedule",
                  ) as HTMLDialogElement | null
                )?.showModal();
              }}
              className="flex items-center bg-[#FED400] rounded-lg px-4 py-2 cursor-pointer"
            >
              <AddSquare size={20} color="black" />
              <p className="text-sm font-semibold ml-2">Buat / Tambah Jadwal</p>
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="my-5 grid grid-cols-3 gap-4 sm:grid-cols-2 xl:grid-cols-3 ">
          {summaryCard.map((item) => (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {item.Value}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bgColor} ${item.textColor}`}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Summary Card */}

        {/* Table Jadwal Shift */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          {/* Header Tabel */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50/80 px-4 py-3">
            <div className="flex items-center ">
              <div className="p-2 rounded-lg bg-gray-200">
                <CardPos size={20} color="gray" />
              </div>
              <div className="ml-2">
                <h3 className="text-sm font-bold text-gray-800">
                  Daftar Jadwal Shift
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Kelola jadwal rotasi dan status operasional
                </p>
              </div>
            </div>

            <div className="px-2 flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 sm:flex">
                <div className="h-[1px] p-1 rounded-full bg-emerald-800 animate-ping" />
                <p className="text-emerald-700 font-semibold text-sm">
                  Rotasi Operasional 24 Jam
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
              {/* HEADER */}
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="w-[27%] px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Nama Jadwal
                  </th>

                  <th className="w-[21%] px-4 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Jam Operasional
                  </th>

                  <th className="w-[34%] px-13 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Petugas Patrol
                  </th>

                  <th className="w-[18%] px-4 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-100">
                {(filteredSchedules?.length ?? 0) > 0 ? (
                  filteredSchedules?.map((schedule) => {
                    const scheduleAssignments = assignment.filter(
                      (item) => item.scheduleId === schedule.id,
                    );

                    const assignedUsers = Array.from(
                      new Map(
                        scheduleAssignments
                          .filter((item) => item.user != null)
                          .map((item) => [item.user!.id, item.user!]),
                      ).values(),
                    );

                    const visibleUsers = assignedUsers.slice(0, 3);
                    const remainingUsers =
                      assignedUsers.length - visibleUsers.length;

                    return (
                      <tr
                        key={schedule.id}
                        className="group transition-colors hover:bg-blue-50/30"
                      >
                        {/* NAMA JADWAL */}
                        <td className="px-6 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#003B73]">
                              <BoxTime size={20} color="#003B73" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {schedule.name}
                              </p>

                              <p className="mt-1 text-[11px] text-gray-500">
                                Rotasi 3-Shift
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* JAM OPERASIONAL */}
                        <td className="px-4 py-4 text-center align-middle">
                          <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium text-gray-700">
                            <span>{schedule.startTime}</span>

                            <span className="text-gray-400">–</span>

                            <span>{schedule.endTime}</span>
                          </div>

                          <p className="mt-1 text-[10px] text-gray-400">WITA</p>
                        </td>

                        {/* PETUGAS PATROL */}
                        <td className="px-6 py-4 align-middle">
                          {assignedUsers.length === 0 ? (
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                <People size={17} color="#9CA3AF" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-500">
                                  Belum ada petugas
                                </p>

                                <p className="mt-1 text-[10px] text-gray-400">
                                  Belum ditugaskan
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex min-w-0 items-center gap-3">
                              {/* AVATAR PETUGAS */}
                              <div className="flex shrink-0 items-center -space-x-2">
                                {visibleUsers.map((user) => (
                                  <div
                                    key={user.id}
                                    title={`${user.fullName} (${user.employeeNumber ?? user.username})`}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-50 text-[10px] font-bold uppercase text-[#003B73]"
                                  >
                                    {user.fullName
                                      .trim()
                                      .split(/\s+/)
                                      .slice(0, 2)
                                      .map((word) => word[0])
                                      .join("")}
                                  </div>
                                ))}

                                {remainingUsers > 0 && (
                                  <div
                                    title={`${remainingUsers} petugas lainnya`}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold text-gray-600"
                                  >
                                    +{remainingUsers}
                                  </div>
                                )}
                              </div>

                              {/* INFORMASI PETUGAS */}
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-gray-800">
                                  {visibleUsers[0].fullName}
                                </p>

                                <p className="mt-1 text-[10px] text-gray-500">
                                  {assignedUsers.length} petugas bertugas
                                </p>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* AKSI */}
                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            {/* ASSIGN PETUGAS */}
                            <button
                              type="button"
                              onClick={() => handleAssignUserModal(schedule)}
                              title={`Assign petugas ke ${schedule.name}`}
                              aria-label={`Assign petugas ke ${schedule.name}`}
                              className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                            >
                              <UserAdd size={19} color="#2563EB" />
                            </button>

                            {/* LIHAT PETUGAS */}
                            <button
                              type="button"
                              title={`Lihat petugas ${schedule.name}`}
                              aria-label={`Lihat petugas ${schedule.name}`}
                              className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <People size={19} color="currentColor" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                          <BoxTime size={22} color="gray" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-gray-700">
                          Belum ada jadwal
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Jadwal yang tersedia akan ditampilkan di sini.
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

        {/* Modal Assign Single Data */}
        <dialog id="assignment_single" className="modal">
          <div className="modal-box flex max-h-[92vh] w-11/12 max-w-2xl flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <CalendarAdd size={21} color="#003B73" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Assign Petugas Shift
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Tentukan petugas dan periode penugasan pada jadwal terpilih.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeModal("assignment_single");
                }}
                aria-label="Tutup modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <CloseCircle size={21} color="gray" />
              </button>
            </div>

            <form onSubmit={createSingleData}>
              <div className="bg-white p-4 rounded-lg mt-4">
                {/* JADWAL SHIFT TERPILIH */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                      <CalendarAdd size={21} color="#003B73" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-blue-600">
                        Jadwal Shift Terpilih
                      </p>

                      <h3 className="mt-1 truncate text-sm font-bold text-gray-800">
                        {selectedSchedule?.name ?? "Belum ada jadwal"}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {selectedSchedule
                          ? `${selectedSchedule.startTime} – ${selectedSchedule.endTime} WITA`
                          : "Pilih jadwal dari tabel terlebih dahulu."}
                      </p>
                    </div>
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
                  <div className="mt-5">
                    <p className="uppercase text-xs text-gray-500 font-semibold">
                      Pilih Satpam Target
                    </p>
                    <input
                      type="text"
                      placeholder="Cari security..."
                      value={search.singleSecurity}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          singleSecurity: e.target.value,
                        }))
                      }
                      className="input input-sm input-bordered w-full min-w-[110px] bg-white font-normal mt-2"
                    />
                  </div>

                  {searchSecurity?.slice(0, 3).map((item) => {
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
                              {item.team?.name}
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
          </div>
        </dialog>
        {/* Modal Assign Single Data */}
      </div>
    </div>
  );
};

export default ManageSchedule;

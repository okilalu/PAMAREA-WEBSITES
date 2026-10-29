import React, { useState } from "react";
import { useChangeShift } from "../../hooks/schedule/useShiftChange";
import { useGetScheduleAssigments } from "../../hooks/schedule/usePatrolScheduleAssignment";
import type { ShiftChange } from "../../types/schedule/shift-change";
import { useSecurityUsers } from "../../hooks/users/useUsers";
import { usePatrolSchedules } from "../../hooks/schedule/usePatrolSchedules";

const ShiftChanges = () => {
  const { data: scheduleAssignment } = useGetScheduleAssigments();
  const { data: userSecurity } = useSecurityUsers();
  const { data: patrolSchedules } = usePatrolSchedules();

  const { mutateAsync: shiftChange, isPending: isChangingShift } =
    useChangeShift();

  const [firstUserId, setFirstUserId] = useState("");
  const [secondUserId, setSecondUserId] = useState("");
  const [firstAssignmentId, setFirstAssignmentId] = useState("");
  const [secondAssignmentId, setSecondAssignmentId] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reason, setReason] = useState("");

  const [search, setSearch] = useState({
    security: "",
    secondSecurity: "",
    singleSecurity: "",
  });

  const assignment = scheduleAssignment ?? [];
  const allSchedules = patrolSchedules?.data ?? [];

  const activeSecurity =
    userSecurity?.data.filter((item) => item.status === "ACTIVE") ?? [];

  const getSecurityOptions = (
    keyword: string,
    selectedId: string,
    excludedId: string,
  ) => {
    const normalized = keyword.trim().toLowerCase();

    const filtered = activeSecurity.filter(
      (item) =>
        item.id !== excludedId &&
        item.fullName.toLowerCase().includes(normalized),
    );

    const selected = filtered.find((item) => item.id === selectedId);
    const others = filtered.filter((item) => item.id !== selectedId);

    return selected ? [selected, ...others].slice(0, 5) : others.slice(0, 5);
  };

  const firstSecurityOptions = getSecurityOptions(
    search.security,
    firstUserId,
    secondUserId,
  );

  const secondSecurityOptions = getSecurityOptions(
    search.secondSecurity,
    secondUserId,
    firstUserId,
  );

  // Assignment difilter berdasarkan user yang dipilih.
  const firstUserAssignments = assignment.filter(
    (item) => item.userId === firstUserId,
  );

  const secondUserAssignments = assignment.filter(
    (item) => item.userId === secondUserId,
  );

  const selectedFirstAssignment = assignment.find(
    (item) => item.id === firstAssignmentId && item.userId === firstUserId,
  );

  const selectedSecondAssignment = assignment.find(
    (item) => item.id === secondAssignmentId && item.userId === secondUserId,
  );

  const formatAssignmentDate = (value: string | Date | null | undefined) => {
    if (!value) return "Tidak ditentukan";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const handleShiftChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstUserId || !secondUserId) {
      alert("Pilih kedua petugas terlebih dahulu.");
      return;
    }

    if (firstUserId === secondUserId) {
      alert("Pilih dua petugas yang berbeda.");
      return;
    }

    if (!firstAssignmentId || !secondAssignmentId) {
      alert("Pilih assignment dari kedua petugas.");
      return;
    }

    if (firstAssignmentId === secondAssignmentId) {
      alert("Pilih dua assignment yang berbeda.");
      return;
    }

    if (!effectiveDate) {
      alert("Tanggal pertukaran wajib diisi.");
      return;
    }

    // Pastikan assignment benar-benar milik user terpilih.
    const first = assignment.find(
      (item) => item.id === firstAssignmentId && item.userId === firstUserId,
    );

    const second = assignment.find(
      (item) => item.id === secondAssignmentId && item.userId === secondUserId,
    );

    if (!first || !second) {
      alert("Assignment tidak ditemukan atau tidak sesuai dengan petugas.");
      return;
    }

    const payload: ShiftChange = {
      firstAssignmentId: first.id,
      secondAssignmentId: second.id,
      effectiveDate,
      reason: reason.trim() || undefined,
    };

    try {
      await shiftChange(payload);

      setFirstUserId("");
      setSecondUserId("");
      setFirstAssignmentId("");
      setSecondAssignmentId("");
      setEffectiveDate("");
      setReason("");

      setSearch((previous) => ({
        ...previous,
        security: "",
        secondSecurity: "",
      }));

      alert("Pertukaran shift berhasil diproses.");
    } catch (error) {
      console.error("Gagal melakukan pertukaran shift:", error);
      alert("Gagal melakukan pertukaran shift.");
    }
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  const primaryButton =
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#00529C] px-5 text-sm font-semibold text-white transition hover:bg-[#003F78] disabled:cursor-not-allowed disabled:opacity-50";

  const renderAssignmentDetails = (
    selectedAssignment: (typeof assignment)[number],
    variant: "blue" | "amber",
  ) => {
    const scheduleInfo = allSchedules.find(
      (item) => item.id === selectedAssignment.scheduleId,
    );

    return (
      <div
        className={`mt-3 rounded-lg border p-3 ${
          variant === "blue"
            ? "border-blue-100 bg-blue-50/70"
            : "border-amber-100 bg-amber-50/70"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Jadwal terpilih
            </p>
            <p className="mt-1 break-words text-sm font-bold text-slate-800">
              {scheduleInfo?.name ?? "Jadwal patroli"}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${
              variant === "blue"
                ? "bg-blue-100 text-blue-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            TERPILIH
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-500">Tanggal mulai</p>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              {formatAssignmentDate(selectedAssignment.startDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Tanggal selesai</p>
            <p className="mt-1 text-xs font-semibold text-slate-700">
              {formatAssignmentDate(selectedAssignment.endDate)}
            </p>
          </div>
        </div>

        <div className="mt-3 border-t border-slate-200/70 pt-2">
          <p className="text-[10px] text-slate-500">Assignment ID</p>
          <p className="mt-1 break-all font-mono text-[10px] text-slate-600">
            {selectedAssignment.id}
          </p>
        </div>
      </div>
    );
  };

  const renderSecurityOptions = (
    options: typeof activeSecurity,
    selectedUserId: string,
    groupName: string,
    onSelect: (id: string) => void,
  ) => (
    <div className="mt-3 space-y-2">
      {options.map((item) => {
        const isSelected = selectedUserId === item.id;

        return (
          <label
            key={item.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
              isSelected
                ? "border-[#00529C] bg-blue-50 ring-1 ring-blue-100"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name={groupName}
              checked={isSelected}
              onChange={() => onSelect(item.id)}
              className="radio radio-sm radio-primary"
            />

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              {item.fullName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((name) => name.charAt(0))
                .join("")
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {item.fullName}
              </p>
              <p className="text-xs text-slate-500">Petugas keamanan</p>
            </div>

            {isSelected && (
              <span className="shrink-0 rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                DIPILIH
              </span>
            )}
          </label>
        );
      })}

      {options.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
          <p className="text-sm font-medium text-slate-500">
            Petugas tidak ditemukan.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Coba gunakan kata kunci pencarian lain.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/70">
      {/* HEADER / BREADCRUMB */}
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="breadcrumbs p-0 text-sm">
          <ul>
            <li>
              <span className="text-slate-500">Dashboard</span>
            </li>
            <li>
              <span className="text-slate-500">Manajemen Patroli</span>
            </li>
            <li>
              <span className="font-semibold text-[#00529C]">
                Pertukaran Shift
              </span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            LO
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">Lalu Oki</h2>
            <p className="text-xs text-slate-500">Chief Patrol Supervisor</p>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* PAGE TITLE */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-1.5 shrink-0 rounded-full bg-[#00529C]" />

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#00529C]">
                  Manajemen Personel
                </p>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Pertukaran Shift
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:ml-[18px]">
              Kelola pertukaran jadwal tugas antarpetugas keamanan berdasarkan
              assignment patroli yang telah ditetapkan.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#00529C]" />
            <span className="text-xs font-semibold text-[#00529C]">
              Pengajuan Pertukaran
            </span>
          </div>
        </div>

        <form onSubmit={handleShiftChange} className="space-y-5">
          {/* FORM CARD */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* CARD HEADER */}
            <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Formulir Tukar Shift
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  Tentukan dua petugas beserta assignment yang akan ditukar.
                </p>
              </div>

              <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                2 Petugas
              </span>
            </div>

            <div className="p-4 sm:p-6">
              {/* PETUGAS */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                {/* PETUGAS PERTAMA */}
                <section className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-[#00529C]">
                      01
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Petugas Pertama
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Petugas yang akan bertukar shift
                      </p>
                    </div>
                  </div>

                  <label htmlFor="first-security-search" className={labelClass}>
                    Cari petugas
                  </label>

                  <input
                    id="first-security-search"
                    type="search"
                    placeholder="Cari nama atau nomor pegawai"
                    value={search.security}
                    onChange={(event) => {
                      setSearch((previous) => ({
                        ...previous,
                        security: event.target.value,
                      }));
                      setFirstUserId("");
                      setFirstAssignmentId("");
                    }}
                    className={inputClass}
                  />

                  {renderSecurityOptions(
                    firstSecurityOptions,
                    firstUserId,
                    "firstUser",
                    (id) => {
                      setFirstUserId(id);
                      setFirstAssignmentId("");
                    },
                  )}

                  {firstUserId && (
                    <div className="mt-5 border-t border-slate-200 pt-4">
                      <label htmlFor="first-assignment" className={labelClass}>
                        Assignment petugas
                      </label>

                      <select
                        id="first-assignment"
                        value={firstAssignmentId}
                        onChange={(event) =>
                          setFirstAssignmentId(event.target.value)
                        }
                        className={inputClass}
                        required
                      >
                        <option value="">Pilih assignment</option>

                        {firstUserAssignments
                          .filter((item) => item.id !== secondAssignmentId)
                          .map((item) => {
                            const scheduleInfo = allSchedules.find(
                              (schedule) => schedule.id === item.scheduleId,
                            );

                            return (
                              <option key={item.id} value={item.id}>
                                {scheduleInfo?.name ?? "Jadwal patroli"} —{" "}
                                {formatAssignmentDate(item.startDate)} sampai{" "}
                                {formatAssignmentDate(item.endDate)}
                              </option>
                            );
                          })}
                      </select>

                      {firstUserAssignments.length === 0 && (
                        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                          Petugas ini belum memiliki assignment.
                        </p>
                      )}

                      {selectedFirstAssignment &&
                        renderAssignmentDetails(
                          selectedFirstAssignment,
                          "blue",
                        )}
                    </div>
                  )}
                </section>

                {/* PETUGAS KEDUA */}
                <section className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">
                      02
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Petugas Kedua
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Rekan pertukaran shift
                      </p>
                    </div>
                  </div>

                  <label
                    htmlFor="second-security-search"
                    className={labelClass}
                  >
                    Cari petugas
                  </label>

                  <input
                    id="second-security-search"
                    type="search"
                    placeholder="Cari nama atau nomor pegawai"
                    value={search.secondSecurity}
                    onChange={(event) => {
                      setSearch((previous) => ({
                        ...previous,
                        secondSecurity: event.target.value,
                      }));
                      setSecondUserId("");
                      setSecondAssignmentId("");
                    }}
                    className={inputClass}
                  />

                  {renderSecurityOptions(
                    secondSecurityOptions,
                    secondUserId,
                    "secondUser",
                    (id) => {
                      setSecondUserId(id);
                      setSecondAssignmentId("");
                    },
                  )}

                  {secondUserId && (
                    <div className="mt-5 border-t border-slate-200 pt-4">
                      <label htmlFor="second-assignment" className={labelClass}>
                        Assignment petugas
                      </label>

                      <select
                        id="second-assignment"
                        value={secondAssignmentId}
                        onChange={(event) =>
                          setSecondAssignmentId(event.target.value)
                        }
                        className={inputClass}
                        required
                      >
                        <option value="">Pilih assignment</option>

                        {secondUserAssignments
                          .filter((item) => item.id !== firstAssignmentId)
                          .map((item) => {
                            const scheduleInfo = allSchedules.find(
                              (schedule) => schedule.id === item.scheduleId,
                            );

                            return (
                              <option key={item.id} value={item.id}>
                                {scheduleInfo?.name ?? "Jadwal patroli"} —{" "}
                                {formatAssignmentDate(item.startDate)} sampai{" "}
                                {formatAssignmentDate(item.endDate)}
                              </option>
                            );
                          })}
                      </select>

                      {secondUserAssignments.length === 0 && (
                        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                          Petugas ini belum memiliki assignment.
                        </p>
                      )}

                      {selectedSecondAssignment &&
                        renderAssignmentDetails(
                          selectedSecondAssignment,
                          "amber",
                        )}
                    </div>
                  )}
                </section>
              </div>

              {/* TANGGAL DAN ALASAN */}
              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-slate-800">
                    Detail Pertukaran
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Tentukan tanggal berlakunya pertukaran dan alasan pengajuan.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div>
                    <label htmlFor="effective-date" className={labelClass}>
                      Tanggal efektif pertukaran
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="effective-date"
                      type="date"
                      value={effectiveDate}
                      onChange={(event) => setEffectiveDate(event.target.value)}
                      required
                      className={inputClass}
                    />

                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      Tanggal mulai berlakunya pertukaran. Backend akan
                      memvalidasi tanggal yang diajukan.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="shift-reason" className={labelClass}>
                      Alasan pertukaran
                      <span className="ml-1 font-normal text-slate-400">
                        (Opsional)
                      </span>
                    </label>

                    <textarea
                      id="shift-reason"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      rows={3}
                      placeholder="Tuliskan alasan pertukaran shift..."
                      className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#00529C] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FORM FOOTER */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs leading-relaxed text-slate-500">
                <span className="font-semibold text-red-500">*</span> Wajib
                diisi sebelum pengajuan.
              </p>

              <button
                type="submit"
                disabled={
                  isChangingShift ||
                  !firstUserId ||
                  !secondUserId ||
                  !firstAssignmentId ||
                  !secondAssignmentId ||
                  !effectiveDate
                }
                className={`${primaryButton} w-full sm:w-auto`}
              >
                {isChangingShift ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Memproses...
                  </>
                ) : (
                  "Ajukan Pertukaran Shift"
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ShiftChanges;

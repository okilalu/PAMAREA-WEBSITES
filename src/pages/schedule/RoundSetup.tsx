import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Clock,
  LocationAdd,
  Save2,
  Refresh,
  ShieldSlash,
  Clipboard,
  UserOctagon,
  CodeCircle,
  Map1,
} from "iconsax-react";

import type { PatrolCheckpointItem } from "../../types/schedule/patrol-round";

import {
  usePatrolRoundById,
  useReorderPatrolRoundCheckpoints,
} from "../../hooks/schedule/usePatrolRound";

type RoundSetupProps = {
  roundId: string;
  onBack: () => void;
};

const RoundSetup = ({ roundId, onBack }: RoundSetupProps) => {
  const [checkpoints, setCheckpoints] = useState<PatrolCheckpointItem[]>([]);
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: round,
    isLoading,
    isError,
    error,
  } = usePatrolRoundById(roundId);

  console.log(roundId);

  const reorderMutation = useReorderPatrolRoundCheckpoints(roundId ?? "");

  useEffect(() => {
    if (!round) return;

    const orderedCheckpoints = [...round.checkpoints].sort(
      (a, b) => a.sequence - b.sequence,
    );

    setCheckpoints(orderedCheckpoints);
    setOriginalOrder(orderedCheckpoints.map((checkpoint) => checkpoint.id));
    setErrorMessage("");
    setSuccessMessage("");
  }, [round]);

  const canEdit = round?.status === "PENDING";

  const isOrderChanged =
    checkpoints.length !== originalOrder.length ||
    checkpoints.some(
      (checkpoint, index) => checkpoint.id !== originalOrder[index],
    );

  const handleMoveCheckpoint = (index: number, direction: "up" | "down") => {
    if (!canEdit || reorderMutation.isPending) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= checkpoints.length) return;

    const updatedCheckpoints = [...checkpoints];

    [updatedCheckpoints[index], updatedCheckpoints[targetIndex]] = [
      updatedCheckpoints[targetIndex],
      updatedCheckpoints[index],
    ];

    setCheckpoints(updatedCheckpoints);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleResetOrder = () => {
    if (!round || !canEdit || reorderMutation.isPending) return;

    const resetCheckpoints = [...round.checkpoints].sort(
      (a, b) => a.sequence - b.sequence,
    );

    setCheckpoints(resetCheckpoints);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSaveOrder = async () => {
    if (!roundId || !canEdit || !isOrderChanged) return;

    setErrorMessage("");
    setSuccessMessage("");

    const checkpointIds = checkpoints.map((checkpoint) => checkpoint.id);

    try {
      await reorderMutation.mutateAsync(checkpointIds);

      // Simpan urutan terbaru sebagai baseline.
      setOriginalOrder(checkpointIds);
      setSuccessMessage("Urutan checkpoint berhasil disimpan.");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyimpan urutan checkpoint.";

      setErrorMessage(message);
    }
  };

  const handleBack = () => {
    onBack();
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Makassar",
    }).format(new Date(value));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 ring-amber-200";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 ring-blue-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 ring-green-200";
      case "PARTIAL":
        return "bg-orange-50 text-orange-700 ring-orange-200";
      case "MISSED":
        return "bg-red-50 text-red-700 ring-red-200";
      default:
        return "bg-gray-100 text-gray-600 ring-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#00529C]" />
          <span className="text-sm text-gray-500">
            Memuat detail patrol round...
          </span>
        </div>
      </div>
    );
  }

  if (!roundId || isError || !round) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={handleBack}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#00529C]"
        >
          <ArrowLeft size={18} />
          Kembali ke Patrol Rounds
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-2 text-red-700">
            <CodeCircle size={20} />
            <h2 className="font-semibold">Data Patrol Round Tidak Ditemukan</h2>
          </div>

          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Periksa kembali ID patrol round atau koneksi ke server."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mb-3 breadcrumbs text-sm">
          <ul>
            <li>
              <button
                type="button"
                onClick={handleBack}
                className="text-gray-500 hover:text-[#00529C]"
              >
                Dashboard
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={handleBack}
                className="text-gray-500 hover:text-[#00529C]"
              >
                Management Patrol Rounds
              </button>
            </li>

            <li className="font-semibold text-gray-800">
              Pengaturan Urutan Checkpoint
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-1 rounded-full bg-[#00529C]" />

              <h1 className="text-2xl font-bold text-gray-900">
                Pengaturan Patrol Round
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Atur urutan pemeriksaan checkpoint dalam satu putaran patroli.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Kembali
          </button>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {/* Round Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Informasi Patrol Round
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Detail petugas dan putaran patroli yang sedang dikonfigurasi.
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClass(
                round.status,
              )}`}
            >
              {round.status.replaceAll("_", " ")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <UserOctagon size={17} />
                <span className="text-xs font-medium">Petugas Patrol</span>
              </div>

              <p className="font-semibold text-gray-900">
                {round.assignment.user.fullName}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {round.assignment.user.employeeNumber ?? "-"}
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <Clock size={17} />
                <span className="text-xs font-medium">Jadwal Shift</span>
              </div>

              <p className="font-semibold text-gray-900">
                {round.assignment.schedule.name}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {round.assignment.schedule.startTime} -{" "}
                {round.assignment.schedule.endTime}
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <Clipboard size={17} />
                <span className="text-xs font-medium">Nomor Putaran</span>
              </div>

              <p className="text-xl font-bold text-gray-900">
                Round #{round.roundNumber}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {checkpoints.length} checkpoint
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <ShieldSlash size={17} />
                <span className="text-xs font-medium">Waktu Putaran</span>
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {formatDateTime(round.scheduledStartAt)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Selesai: {formatDateTime(round.scheduledEndAt)}
              </p>
            </div>
          </div>

          {!canEdit && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Urutan checkpoint tidak dapat diubah karena status round bukan
              PENDING.
            </div>
          )}
        </section>

        {/* Checkpoint Table */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Urutan Checkpoint
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Atur checkpoint dari urutan pertama hingga terakhir.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#00529C]">
                {checkpoints.length} Checkpoint
              </span>

              <button
                type="button"
                onClick={handleResetOrder}
                disabled={
                  !canEdit || !isOrderChanged || reorderMutation.isPending
                }
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Refresh size={15} />
                Reset
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mx-5 mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="w-24 px-5 py-4">Urutan</th>
                  <th className="px-5 py-4">Nama Checkpoint</th>
                  <th className="w-32 px-5 py-4 text-center">Kewajiban</th>
                  <th className="w-36 px-5 py-4 text-center">Status</th>
                  <th className="w-28 px-5 py-4 text-center">Atur Posisi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {checkpoints.map((checkpoint, index) => (
                  <tr
                    key={checkpoint.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 font-bold text-[#00529C]">
                        {index + 1}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-gray-100 p-2 text-gray-600">
                          <Map1 size={17} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {checkpoint.patrolPoint.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {checkpoint.pointCodeSnapshot}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          checkpoint.required
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {checkpoint.required ? "Wajib" : "Opsional"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          checkpoint.status,
                        )}`}
                      >
                        {checkpoint.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          title="Pindahkan ke atas"
                          aria-label={`Pindahkan ${checkpoint.patrolPoint.name} ke atas`}
                          disabled={
                            !canEdit || index === 0 || reorderMutation.isPending
                          }
                          onClick={() => handleMoveCheckpoint(index, "up")}
                          className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-[#00529C] hover:text-[#00529C] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          type="button"
                          title="Pindahkan ke bawah"
                          aria-label={`Pindahkan ${checkpoint.patrolPoint.name} ke bawah`}
                          disabled={
                            !canEdit ||
                            index === checkpoints.length - 1 ||
                            reorderMutation.isPending
                          }
                          onClick={() => handleMoveCheckpoint(index, "down")}
                          className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-[#00529C] hover:text-[#00529C] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {checkpoints.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      Belum ada checkpoint pada patrol round ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-gray-500">
              {canEdit
                ? "Perubahan urutan belum tersimpan sampai Anda menekan Simpan Urutan."
                : "Pengurutan dinonaktifkan untuk round ini."}
            </p>

            <button
              type="button"
              onClick={handleSaveOrder}
              disabled={
                !canEdit ||
                !isOrderChanged ||
                reorderMutation.isPending ||
                checkpoints.length === 0
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-[#00529C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003B73] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reorderMutation.isPending ? (
                <>
                  <LocationAdd size={17} />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save2 size={17} />
                  Simpan Urutan
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoundSetup;

import {
  ArrowDown2,
  ArrowUp2,
  Refresh,
  RouteSquare,
  Save2,
  Setting2,
} from "iconsax-react";
import { useEffect, useMemo, useState } from "react";

import {
  useAssignmentRoute,
  useOptimizeAssignmentRoute,
  useSetAssignmentRoute,
} from "../../hooks/schedule/usePatrolScheduleAssignmentRoute";

import type {
  AssignmentRouteOption,
  AssignmentRoutePoint,
  PatrolPointOption,
} from "../../types/schedule/assignment-route";

interface Props {
  assignments: AssignmentRouteOption[];
  patrolPoints: PatrolPointOption[];
}

function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
    message?: string;
  };

  const message = err.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || err.message || "Terjadi kesalahan.";
}

export default function AssignmentRouteManager({
  assignments,
  patrolPoints,
}: Props) {
  const [assignmentId, setAssignmentId] = useState("");
  const [routePoints, setRoutePoints] = useState<AssignmentRoutePoint[]>([]);
  const [startPointId, setStartPointId] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    data: route,
    isLoading,
    isError,
    error,
    refetch,
  } = useAssignmentRoute(assignmentId || undefined);

  const setRouteMutation = useSetAssignmentRoute();
  const optimizeMutation = useOptimizeAssignmentRoute();

  const activeAssignments = useMemo(
    () =>
      assignments.filter(
        (assignment) => !assignment.status || assignment.status === "ACTIVE",
      ),
    [assignments],
  );

  const activePoints = useMemo(
    () =>
      patrolPoints.filter(
        (point) => !point.status || point.status === "ACTIVE",
      ),
    [patrolPoints],
  );

  useEffect(() => {
    if (!route) return;

    setRoutePoints(
      route.points.map((point, index) => ({
        ...point,
        sequence: index + 1,
      })),
    );

    setStartPointId(route.points[0]?.patrolPointId ?? "");
  }, [route]);

  const movePoint = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= routePoints.length) {
      return;
    }

    setRoutePoints((previous) => {
      const next = [...previous];

      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

      return next.map((point, i) => ({
        ...point,
        sequence: i + 1,
      }));
    });
  };

  const selectStartPoint = (patrolPointId: string) => {
    setStartPointId(patrolPointId);

    setRoutePoints((previous) => {
      const index = previous.findIndex(
        (point) => point.patrolPointId === patrolPointId,
      );

      if (index <= 0) return previous;

      const next = [...previous];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);

      return next.map((point, i) => ({
        ...point,
        sequence: i + 1,
      }));
    });
  };

  const handleSave = async () => {
    if (!assignmentId) {
      setNotice({
        type: "error",
        message: "Pilih assignment terlebih dahulu.",
      });
      return;
    }

    if (routePoints.length === 0) {
      setNotice({
        type: "error",
        message: "Rute harus memiliki minimal satu titik.",
      });
      return;
    }

    try {
      setNotice(null);

      await setRouteMutation.mutateAsync({
        assignmentId,
        payload: {
          points: routePoints.map((point) => ({
            patrolPointId: point.patrolPointId,
          })),
        },
      });

      setNotice({
        type: "success",
        message: "Rute assignment berhasil disimpan.",
      });

      await refetch();
    } catch (err) {
      setNotice({
        type: "error",
        message: getErrorMessage(err),
      });
    }
  };

  const handleOptimize = async () => {
    if (!assignmentId) {
      setNotice({
        type: "error",
        message: "Pilih assignment terlebih dahulu.",
      });
      return;
    }

    if (routePoints.length < 2) {
      setNotice({
        type: "error",
        message: "Optimasi memerlukan minimal dua titik.",
      });
      return;
    }

    if (!startPointId) {
      setNotice({
        type: "error",
        message: "Pilih titik awal rute.",
      });
      return;
    }

    try {
      setNotice(null);

      await optimizeMutation.mutateAsync({
        assignmentId,
        payload: {
          patrolPointIds: routePoints.map((point) => point.patrolPointId),
          startPatrolPointId: startPointId,
        },
      });

      setNotice({
        type: "success",
        message: "Permintaan optimasi rute berhasil.",
      });

      await refetch();
    } catch (err) {
      setNotice({
        type: "error",
        message: getErrorMessage(err),
      });
    }
  };

  const isBusy = setRouteMutation.isPending || optimizeMutation.isPending;

  return (
    <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <RouteSquare size={22} color="gray" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Pengaturan Rute Assignment
            </h2>
            <p className="text-sm text-slate-500">
              Atur urutan checkpoint untuk setiap petugas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={!assignmentId || isBusy}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Refresh size={17} color="gray" />
          Muat ulang
        </button>
      </header>

      <div>
        <label
          htmlFor="route-assignment"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Pilih assignment petugas
        </label>

        <select
          id="route-assignment"
          value={assignmentId}
          onChange={(event) => {
            setAssignmentId(event.target.value);
            setRoutePoints([]);
            setStartPointId("");
            setNotice(null);
          }}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">-- Pilih assignment --</option>

          {activeAssignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.user?.fullName ?? assignment.userId}
              {" — "}
              {assignment.schedule?.name ?? assignment.scheduleId}
            </option>
          ))}
        </select>
      </div>

      {notice && (
        <div
          role="status"
          className={`rounded-lg border px-3 py-2.5 text-sm ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notice.message}
        </div>
      )}

      {isLoading && assignmentId && (
        <p className="text-sm text-slate-500">Memuat rute assignment...</p>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {getErrorMessage(error)}
        </div>
      )}

      {route && !isLoading && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Sumber:{" "}
              {route.source === "ASSIGNMENT"
                ? "Rute khusus assignment"
                : "Rute default jadwal"}
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {routePoints.length} checkpoint
            </span>
          </div>

          {routePoints.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
              <p className="font-medium text-slate-700">Belum ada checkpoint</p>
              <p className="mt-1 text-sm text-slate-500">
                Periksa konfigurasi titik pada jadwal di backend.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {routePoints.map((point, index) => (
                <div
                  key={point.patrolPointId}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {point.name ??
                        activePoints.find(
                          (item) => item.id === point.patrolPointId,
                        )?.name ??
                        point.patrolPointId}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {point.code ?? "Checkpoint"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Jadikan titik awal"
                      onClick={() => selectStartPoint(point.patrolPointId)}
                      className={`rounded-lg p-2 ${
                        startPointId === point.patrolPointId
                          ? "bg-blue-100 text-blue-700"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Setting2 size={18} />
                    </button>

                    <button
                      type="button"
                      title="Pindah ke atas"
                      disabled={index === 0}
                      onClick={() => movePoint(index, -1)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ArrowUp2 size={18} />
                    </button>

                    <button
                      type="button"
                      title="Pindah ke bawah"
                      disabled={index === routePoints.length - 1}
                      onClick={() => movePoint(index, 1)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ArrowDown2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs leading-5 text-slate-500">
            Ikon pengaturan menempatkan titik sebagai titik awal dan
            memindahkannya ke urutan pertama. Pastikan rute masih sesuai dengan
            aturan jadwal patroli.
          </p>

          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isBusy || routePoints.length === 0}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save2 size={18} />
              {setRouteMutation.isPending ? "Menyimpan..." : "Simpan Rute"}
            </button>

            <button
              type="button"
              onClick={() => void handleOptimize()}
              disabled={isBusy || routePoints.length < 2}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RouteSquare size={18} />
              {optimizeMutation.isPending
                ? "Mengoptimalkan..."
                : "Optimasi Rute"}
            </button>
          </div>
        </>
      )}

      {!assignmentId && (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <RouteSquare size={30} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            Pilih assignment untuk mengatur rutenya
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Rute default jadwal akan digunakan jika assignment belum mempunyai
            rute khusus.
          </p>
        </div>
      )}
    </section>
  );
}

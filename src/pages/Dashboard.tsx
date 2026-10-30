import {
  // ArrowRight2,
  Calendar,
  Location,
  // Notification,
  Sun,
  UserOctagon,
  Warning2,
} from "iconsax-react";
import React, { useMemo } from "react";
import MapsCheckpoint from "../components/mapsCheckpoint/MapsCheckpoint";
import { useSecurityUsers } from "../hooks/users/useUsers";
import { usePatrolPoints } from "../hooks/patrol-point/usePatrolPoints";
import { usePatrolSchedules } from "../hooks/schedule/usePatrolSchedules";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";

const Dashboard = () => {
  const { data: security } = useSecurityUsers();
  const { data: checkpoints } = usePatrolPoints();
  const { data: shift } = usePatrolSchedules();

  const shiftActive = shift?.data.find((s) => s.name);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  // const cardHazard = [
  //   {
  //     alert: "Critical",
  //     time: "14.12 WIB",
  //     title: "Kawat Duri Pagar Pembatas Sektor Barat Terputus",
  //     guard: "Dimas",
  //     location: "Pagar Luar Barat (Zona 1)",
  //     note: "Potensi akses masuk liar di dekat tiang transmisi no. 4. Telah dipasang pita pengaman sementara.",
  //   },
  //   {
  //     alert: "High",
  //     time: "13.47 WIB",
  //     title: "Lampu Penerangan Area Parkir Tidak Berfungsi",
  //     guard: "Rizky",
  //     location: "Area Parkir Kendaraan",
  //     note: "Area parkir sisi timur dalam kondisi minim penerangan. Perlu dilakukan pemeriksaan dan penggantian lampu.",
  //   },
  //   {
  //     alert: "Medium",
  //     time: "12.35 WIB",
  //     title: "Genangan Air Ditemukan di Jalur Akses Panel",
  //     guard: "Andi",
  //     location: "Ruang Panel Utama",
  //     note: "Terdapat genangan air di sekitar jalur akses panel. Area telah diberi tanda peringatan untuk mencegah risiko terpeleset.",
  //   },
  //   {
  //     alert: "High",
  //     time: "11.58 WIB",
  //     title: "Pintu Gudang Material Tidak Terkunci Sempurna",
  //     guard: "Fajar",
  //     location: "Gudang Material Utama",
  //     note: "Pintu gudang ditemukan tidak tertutup rapat. Telah dilakukan penguncian sementara dan dilaporkan kepada petugas terkait.",
  //   },
  //   {
  //     alert: "Low",
  //     time: "10.26 WIB",
  //     title: "Tumpukan Material Menghalangi Sebagian Jalur Inspeksi",
  //     guard: "Bima",
  //     location: "Area Trafo Daya 1",
  //     note: "Beberapa material berada terlalu dekat dengan jalur inspeksi. Diperlukan penataan ulang agar akses petugas tetap aman.",
  //   },
  //   {
  //     alert: "Critical",
  //     time: "09.41 WIB",
  //     title: "Pagar Pembatas Area Trafo Mengalami Kerusakan",
  //     guard: "Hendra",
  //     location: "Area Trafo Daya 2",
  //     note: "Ditemukan bagian pagar pembatas yang bengkok dan berpotensi mengurangi keamanan area. Perlu segera dilakukan perbaikan.",
  //   },
  // ];

  // const checkpointData = [
  //   {
  //     guard: "Dimas Pratama",
  //     checkpoint: "Checkpoint A - Main Gate",
  //     nfcStatus: "Verified",
  //     gpsStatus: "On Site",
  //     timestamp: "28 Sep 2026, 20:45",
  //   },
  //   {
  //     guard: "Rizky Maulana",
  //     checkpoint: "Checkpoint B - Parking Area",
  //     nfcStatus: "Verified",
  //     gpsStatus: "Off Site",
  //     timestamp: "28 Sep 2026, 20:32",
  //   },
  //   {
  //     guard: "Andi Saputra",
  //     checkpoint: "Checkpoint C - Warehouse",
  //     nfcStatus: "Pending",
  //     gpsStatus: "On Site",
  //     timestamp: "28 Sep 2026, 20:18",
  //   },
  //   {
  //     guard: "Fajar Hidayat",
  //     checkpoint: "Checkpoint D - Back Gate",
  //     nfcStatus: "Verified",
  //     gpsStatus: "On Site",
  //     timestamp: "28 Sep 2026, 19:57",
  //   },
  //   {
  //     guard: "Bima Setiawan",
  //     checkpoint: "Checkpoint E - Lobby",
  //     nfcStatus: "Failed",
  //     gpsStatus: "On Site",
  //     timestamp: "28 Sep 2026, 19:41",
  //   },
  //   {
  //     guard: "Hendra Wijaya",
  //     checkpoint: "Checkpoint F - Transformer Area",
  //     nfcStatus: "Verified",
  //     gpsStatus: "Off Site",
  //     timestamp: "28 Sep 2026, 19:26",
  //   },
  // ];

  const summaryCardData = [
    {
      title: "Total Security",
      value: security?.data.length,
      type: "Security",
      icon: <UserOctagon size={22} color="#2563EB" />,
      bg: "bg-blue-50",
    },
    {
      title: "Jumlah Area Patrol",
      value: checkpoints?.length,
      type: "Area",
      icon: <Location size={22} color="#4F46E5" />,
      bg: "bg-indigo-50",
    },
    {
      title: "Jumlah Temuan Patrol",
      value: 5,
      type: "Temuan",
      icon: <Warning2 size={22} color="#DC2626" />,
      bg: "bg-red-50",
    },
  ];

  // const sliceData = cardHazard.slice(0, 3);
  return (
    <div className="min-h-screen ">
      <Breadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Command Center" }]}
      />
      <div className="px-6 pb-6">
        {/* Title */}
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            {/* Information */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

              <p className="mt-1 text-sm text-gray-500">
                Pemantauan kepatuhan patroli keamanan dan pengawasan perimeter
                operasional secara real-time.
              </p>
            </div>

            {/* Controls */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Date */}
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                <Calendar size={17} color="#6B7280" variant="Bulk" />

                <div>
                  <p className="text-[11px] text-gray-400">Periode</p>

                  <p className="text-xs font-semibold text-gray-700">
                    {todayFormatted ?? "Hari Ini"}
                  </p>
                </div>
              </div>

              {/* Shift */}
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                <Sun size={17} color="#6B7280" />

                <div>
                  <p className="text-[11px] text-gray-400">Shift Aktif</p>
                  {(shift?.data.length ?? 0 > 0) ? (
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-gray-700">
                        {shiftActive?.name}
                      </p>
                      <div className="h-[1px] p-0.5 rounded-full bg-emerald-500 animate-ping" />
                      <p className="text-xs font-semibold text-gray-700">
                        {shiftActive?.startTime} - {shiftActive?.endTime}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Belum ada shift</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Title */}

        {/* Card */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Total Patrol */}
          {summaryCardData.map((item) => (
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.title}
                  </p>

                  <div className="mt-5 flex items-end gap-1">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {item.value}
                    </h1>

                    <p className="mb-0.5 text-sm text-gray-500 ml-1">
                      {item.type}
                    </p>
                  </div>
                </div>

                <div className={`rounded-lg p-2.5 ${item.bg}`}>{item.icon}</div>
              </div>

              {/* <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Target</span>

                  <span className="text-xs font-medium text-gray-600">
                    40 officers
                  </span>
                </div>

                <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                  +2 above target
                </span>
              </div> */}
            </div>
          ))}

          {/* Active Checkpoints */}
          {/* <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Patrol Checkpoints
                </p>

                <div className="mt-5 flex items-end gap-1">
                  <h1 className="text-2xl font-bold text-gray-800">128</h1>

                  <p className="mb-0.5 text-sm text-gray-500">Points</p>
                </div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-2.5">
                <Location size={22} color="#4F46E5" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Status</span>

                <span className="text-xs font-medium text-gray-600">
                  All systems active
                </span>
              </div>

              <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
                128 / 128
              </span>
            </div>
          </div> */}

          {/* Out Of Radius Alert */}
          {/* <div className="rounded-lg border border-red-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Out-Of-Radius Alert
                </p>

                <div className="mt-5 flex items-end gap-1">
                  <h1 className="text-2xl font-bold text-red-600">2</h1>

                  <p className="mb-0.5 text-sm text-gray-500">Incidents</p>
                </div>
              </div>

              <div className="rounded-lg bg-red-50 p-2.5">
                <Warning2 size={22} color="#DC2626" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">
                  Requires attention
                </span>
              </div>

              <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                2 Active
              </span>
            </div>
          </div> */}
        </div>
        {/* Card */}

        {/* Maps */}
        <div className="mx-auto max-w-7xl mt-5">
          <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">
              Monitoring Area Patroli
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Pantau lokasi dan checkpoint patroli satpam.
            </p>
            <MapsCheckpoint />
          </div>
        </div>
        {/* Maps */}
      </div>
    </div>
  );
};

export default Dashboard;

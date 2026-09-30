import {
  ArrowRight,
  ArrowRight2,
  Calendar,
  DocumentDownload,
  Location,
  Notification,
  Sun,
  UserOctagon,
  Warning2,
} from "iconsax-react";
import React from "react";

const Dashboard = () => {
  const cardHazard = [
    {
      alert: "Critical",
      time: "14.12 WIB",
      title: "Kawat Duri Pagar Pembatas Sektor Barat Terputus",
      guard: "Dimas",
      location: "Pagar Luar Barat (Zona 1)",
      note: "Potensi akses masuk liar di dekat tiang transmisi no. 4. Telah dipasang pita pengaman sementara.",
    },
    {
      alert: "High",
      time: "13.47 WIB",
      title: "Lampu Penerangan Area Parkir Tidak Berfungsi",
      guard: "Rizky",
      location: "Area Parkir Kendaraan",
      note: "Area parkir sisi timur dalam kondisi minim penerangan. Perlu dilakukan pemeriksaan dan penggantian lampu.",
    },
    {
      alert: "Medium",
      time: "12.35 WIB",
      title: "Genangan Air Ditemukan di Jalur Akses Panel",
      guard: "Andi",
      location: "Ruang Panel Utama",
      note: "Terdapat genangan air di sekitar jalur akses panel. Area telah diberi tanda peringatan untuk mencegah risiko terpeleset.",
    },
    {
      alert: "High",
      time: "11.58 WIB",
      title: "Pintu Gudang Material Tidak Terkunci Sempurna",
      guard: "Fajar",
      location: "Gudang Material Utama",
      note: "Pintu gudang ditemukan tidak tertutup rapat. Telah dilakukan penguncian sementara dan dilaporkan kepada petugas terkait.",
    },
    {
      alert: "Low",
      time: "10.26 WIB",
      title: "Tumpukan Material Menghalangi Sebagian Jalur Inspeksi",
      guard: "Bima",
      location: "Area Trafo Daya 1",
      note: "Beberapa material berada terlalu dekat dengan jalur inspeksi. Diperlukan penataan ulang agar akses petugas tetap aman.",
    },
    {
      alert: "Critical",
      time: "09.41 WIB",
      title: "Pagar Pembatas Area Trafo Mengalami Kerusakan",
      guard: "Hendra",
      location: "Area Trafo Daya 2",
      note: "Ditemukan bagian pagar pembatas yang bengkok dan berpotensi mengurangi keamanan area. Perlu segera dilakukan perbaikan.",
    },
  ];

  const checkpointData = [
    {
      guard: "Dimas Pratama",
      checkpoint: "Checkpoint A - Main Gate",
      nfcStatus: "Verified",
      gpsStatus: "On Site",
      timestamp: "28 Sep 2026, 20:45",
    },
    {
      guard: "Rizky Maulana",
      checkpoint: "Checkpoint B - Parking Area",
      nfcStatus: "Verified",
      gpsStatus: "Off Site",
      timestamp: "28 Sep 2026, 20:32",
    },
    {
      guard: "Andi Saputra",
      checkpoint: "Checkpoint C - Warehouse",
      nfcStatus: "Pending",
      gpsStatus: "On Site",
      timestamp: "28 Sep 2026, 20:18",
    },
    {
      guard: "Fajar Hidayat",
      checkpoint: "Checkpoint D - Back Gate",
      nfcStatus: "Verified",
      gpsStatus: "On Site",
      timestamp: "28 Sep 2026, 19:57",
    },
    {
      guard: "Bima Setiawan",
      checkpoint: "Checkpoint E - Lobby",
      nfcStatus: "Failed",
      gpsStatus: "On Site",
      timestamp: "28 Sep 2026, 19:41",
    },
    {
      guard: "Hendra Wijaya",
      checkpoint: "Checkpoint F - Transformer Area",
      nfcStatus: "Verified",
      gpsStatus: "Off Site",
      timestamp: "28 Sep 2026, 19:26",
    },
  ];

  const sliceData = cardHazard.slice(0, 3);
  return (
    <div className="min-h-screen ">
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
        {/* Title */}
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            {/* Information */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800">
                Ringkasan Eksekutif - Gardu Induk (GI)
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Pemantauan kepatuhan patroli keamanan dan pengawasan perimeter
                operasional secara real-time.
              </p>
            </div>

            {/* Controls */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Shift */}
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                <Sun size={17} color="#6B7280" />

                <div>
                  <p className="text-[11px] text-gray-400">Shift Aktif</p>

                  <p className="text-xs font-semibold text-gray-700">
                    Pagi · 07:00 - 15:00
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                <Calendar size={17} color="#6B7280" variant="Bulk" />

                <div>
                  <p className="text-[11px] text-gray-400">Periode</p>

                  <p className="text-xs font-semibold text-gray-700">
                    Hari Ini
                  </p>
                </div>
              </div>

              {/* Export */}
              <button className="flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800">
                <DocumentDownload size={17} color="white" />
                Export Log
              </button>
            </div>
          </div>
        </div>
        {/* Title */}

        {/* Card */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Total Patrol */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Patrol Today
                </p>

                <div className="mt-5 flex items-end gap-1">
                  <h1 className="text-2xl font-bold text-gray-800">42</h1>

                  <p className="mb-0.5 text-sm text-gray-500">Officers</p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-2.5">
                <UserOctagon size={22} color="#2563EB" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Target</span>

                <span className="text-xs font-medium text-gray-600">
                  40 officers
                </span>
              </div>

              <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                +2 above target
              </span>
            </div>
          </div>

          {/* Active Checkpoints */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
          </div>

          {/* Out Of Radius Alert */}
          <div className="rounded-lg border border-red-100 bg-white p-4 shadow-sm">
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
          </div>
        </div>
        {/* Card */}

        {/* Table */}
        <div className="flex gap-5">
          <div className="mt-5 bg-white p-4 shadow-sm rounded-lg w-[60%]">
            <div className="bg-gray-200 rounded-lg px-4 py-2 flex items-center justify-between">
              <div className="">
                <h2 className="text-gray-800 font-bold">
                  Recent Patrol Executions
                </h2>
                <p className="text-gray-600 text-xs tracking-wider">
                  Last verified checkpoints across substation perimeters
                </p>
              </div>
              <button className="flex items-center justify-center cursor-pointer">
                <p className="text-xs tracking-wider text-blue-800 font-semibold">
                  View All Logs
                </p>
                <ArrowRight2 size={17} color="blue" />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Guard Personnel
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Checkpoint Node
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        NFC Status
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        GPS Status
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Timestamp
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {checkpointData.map((item, index) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {item.guard}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {item.checkpoint}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.nfcStatus === "Verified"
                                ? "bg-green-50 text-green-700"
                                : item.nfcStatus === "Pending"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-red-50 text-red-700"
                            }`}
                          >
                            {item.nfcStatus}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.gpsStatus === "On Site"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {item.gpsStatus}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                          {item.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-white p-4 shadow-sm rounded-lg w-[40%]">
            <div className="bg-gray-200 rounded-lg p-3 flex items-center justify-between gap-2">
              <div className="flex items-center">
                <div className="flex items-center gap-1">
                  <Notification size={20} color="red" />
                  <h2 className="text-gray-800 font-semibold">
                    Critical Findings Feed
                  </h2>
                </div>
                <div className="flex gap-1 bg-red-800 rounded-2xl px-2 py-0.5 ml-2">
                  <p className="text-xs  text-white">3</p>
                  <p className="text-xs text-white">Urgent</p>
                </div>
              </div>
              <button className="flex items-center justify-center cursor-pointer">
                <p className="text-xs tracking-wider text-blue-800 font-semibold">
                  View All Logs
                </p>
                <ArrowRight2 size={17} color="blue" />
              </button>
            </div>

            {/* Card hazard */}
            {sliceData.map((item) => (
              <div className="bg-gray-200 rounded-lg p-3 my-5">
                <div className="flex items-center justify-between">
                  <div className="bg-red-800 rounded-sm px-2">
                    <p className="text-sm text-white tracking-wider font-semibold">
                      {item.alert}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 tracking-wide">
                    {item.time}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-gray-800 font-semibold text-sm">
                    {item.title}
                  </p>
                  <p className="text-gray-600 text-xs">
                    Guard:{" "}
                    <span className="text-xs font-semibold text-gray-800">
                      {item.guard}
                    </span>
                  </p>

                  <p className="text-gray-600 text-xs">
                    Loc:{" "}
                    <span className="text-xs font-semibold text-gray-800">
                      {item.location}
                    </span>
                  </p>

                  <div className="bg-white p-2 rounded-xs mt-2">
                    <p className="text-gray-600 text-xs tracking-wide">
                      {item.note}
                    </p>
                  </div>

                  <div className="mt-3 flex w-full justify-end">
                    <button className="flex items-center justify-center gap-1 rounded-lg bg-[#FED400] px-3 py-1">
                      <span className="text-xs font-semibold text-gray-800">
                        Action / Assign
                      </span>
                      <ArrowRight size={13} color="gray" className="mt-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Card hazard */}
          </div>
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Dashboard;

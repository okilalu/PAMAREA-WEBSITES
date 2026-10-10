import React, { useState } from "react";
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

// --- MOCK DATA BERDASARKAN GAMBAR ---
const chartData = [
  { name: "Hendra G.", regu: "Regu A", score: 98.8, isTop: true },
  { name: "Agus P.", regu: "Regu A", score: 95.4, isTop: false },
  { name: "Dimas K.", regu: "Regu B", score: 91.0, isTop: false },
  { name: "Dedi S.", regu: "Regu B", score: 87.5, isTop: false },
  { name: "Bambang W.", regu: "Regu C", score: 84.0, isTop: false },
  { name: "Syaiful A.", regu: "Regu C", score: 82.0, isTop: false },
];

const rankingData = [
  {
    id: 1,
    name: "Hendra Gunawan",
    nip: "9211048-SEC",
    regu: "Regu A",
    score: 98.8,
    cp: "16/16 CP (100%)",
    badge: "Kinerja Prima",
    badgeColor: "text-yellow-700 bg-yellow-100 border-yellow-200",
  },
  {
    id: 2,
    name: "Agus Prasetyo",
    nip: "9419281-SEC",
    regu: "Regu A",
    score: 95.4,
    cp: "15/16 CP (93.8%)",
    badge: "Tepat Waktu",
    badgeColor: "text-green-700 bg-green-100 border-green-200",
  },
  {
    id: 3,
    name: "Dimas Kurniawan",
    nip: "9112803-SEC",
    regu: "Regu B",
    score: 91.0,
    cp: "14/16 CP (87.5%)",
    badge: "1 Tag Rusak",
    badgeColor: "text-red-700 bg-red-100 border-red-200",
  },
  {
    id: 4,
    name: "Dedi Sudrajat",
    nip: "8933210-SEC",
    regu: "Regu B",
    score: 87.5,
    cp: "13/16 CP (81.2%)",
  },
  {
    id: 5,
    name: "Bambang Wijaya",
    nip: "8911220-SEC",
    regu: "Regu C",
    score: 84.0,
    cp: "12/16 CP (75.0%)",
  },
];

const RealTimeMonitor = () => {
  const [activeShift, setActiveShift] = useState("Shift 1 (Pagi)");
  const [activeRange, setActiveRange] = useState("Hari Ini");

  return (
    <div className="min-h-screen">
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
        {/* HEADER DASHBOARD */}
        <div className="flex items-center justify-between gap-4 p-4">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">
                Papan Peringkat & Analisis Kinerja Satpam
              </h1>
            </div>
            <p className="text-gray-600 tracking-wide text-sm">
              Komparasi real-time kepatuhan rute, SLA pemindaian checkpoint NFC,
              serta pemenuhan checklist K3 gardu induk
            </p>
          </div>

          {/* FILTER CONTROLS */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-sm bg-white p-3 rounded-lg">
              <span className="text-gray-500 font-medium">Shift:</span>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {["Shift 1 (Pagi)", "Shift 2 (Siang)", "Shift 3 (Malam)"].map(
                  (shift) => (
                    <button
                      key={shift}
                      onClick={() => setActiveShift(shift)}
                      className={`px-4 py-1.5 rounded-md font-medium transition-colors text-xs ${activeShift === shift ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
                    >
                      {shift}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm bg-white p-3 rounded-lg">
              <span className="text-gray-500 font-medium">Rentang:</span>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {["Hari Ini", "Minggu Ini", "Bulan Ini"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveRange(range)}
                    className={`px-4 py-1.5 rounded-md font-medium text-xs transition-colors ${activeRange === range ? "bg-yellow-400 text-yellow-900 shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-3">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                Rata-rata Skor Regu
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-800">91.2</span>
                <span className="text-sm font-semibold text-slate-500">
                  /100
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                <TrendUp size={16} /> +3.4% dari shift kemarin
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <TrendUp className="text-blue-600" size={24} color="blue" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                Top Performer Shift 1
              </p>
              <h3 className="text-2xl font-bold text-slate-800">Hendra G.</h3>
              <p className="text-sm text-yellow-600 font-medium mt-2 flex items-center gap-1">
                <Medal size={16} /> Skor 98.8 (100% Selesai)
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Medal className="text-yellow-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                Kepatuhan K3 Sesuai SOP
              </p>
              <h3 className="text-3xl font-bold text-slate-800">97.4%</h3>
              <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                <ShieldTick size={16} /> 24 Checklist Terpenuhi Sempurna
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <ShieldTick className="text-green-600" size={24} />
            </div>
          </div>
        </div> */}

        {/* MAIN CONTENT: CHART & RANKING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* BAGIAN KIRI: GRAFIK (Lebar 7 Kolom) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-start mb-8">
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
              {/* Custom Legend */}
              <div className="flex gap-4 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-slate-700 rounded-sm"></div> Skor
                  Reguler
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>{" "}
                  Peringkat #1
                </div>
              </div>
            </div>

            <div className="flex-1 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 0, left: -20, bottom: 20 }}
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
                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.isTop
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
                      fontSize={12}
                      fontWeight={600}
                      formatter={(val) => val?.toFixed(1)}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
              <p>
                *Skor dihitung dari: Ketuntasan Titik (40%), Presisi Waktu SLA
                (30%), Kepatuhan K3 (30%)
              </p>
              <a href="#" className="text-blue-600 font-medium hover:underline">
                Formula Audit ISO 27001 & SMK3
              </a>
            </div>
          </div>

          {/* BAGIAN KANAN: TABEL PERINGKAT (Lebar 5 Kolom) */}
          <div className="lg:col-span-5 bg-gray-50 rounded-xl flex flex-col">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex-1">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Task className="text-slate-600" size={22} color="orange" />
                  <h2 className="text-lg font-bold text-gray-800">
                    Tabel Peringkat Satpam
                  </h2>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {rankingData.length} Personel Terdata
                </span>
              </div>

              <div className="space-y-3">
                {rankingData.map((person, index) => {
                  const isFirst = index === 0;
                  return (
                    <div
                      key={person.id}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        isFirst
                          ? "border-yellow-400 bg-white shadow-sm"
                          : "border-gray-100 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                            isFirst
                              ? "bg-yellow-400 text-yellow-900"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {person.id}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-800">
                              {person.name}
                            </p>
                            {person.badge && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${person.badgeColor}`}
                              >
                                {person.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            NIP: {person.nip} • {person.regu}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${isFirst ? "text-slate-800" : "text-slate-700"}`}
                        >
                          {person.score.toFixed(1)}
                        </p>
                        <p
                          className={`text-xs font-medium ${isFirst ? "text-green-600" : "text-gray-500"}`}
                        >
                          {person.cp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 flex justify-between items-center text-xs">
                <span className="text-gray-500">
                  Data disinkronisasi setiap 60 detik
                </span>
                <button className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                  Download Rekap Nilai <DocumentDownload size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitor;

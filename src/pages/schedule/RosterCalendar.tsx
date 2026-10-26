import React, { useState } from "react";
import { useMonthlyRoster } from "../../hooks/schedule/usePatrolSchedules";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

const RosterCalendar = () => {
  const { user } = useAuthContext();
  const siteId = user?.siteId;
  const today = new Date();
  const [rosterMonth, setRosterMonth] = useState(today.getMonth() + 1);
  const [rosterYear, setRosterYear] = useState(today.getFullYear());
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

  const monthLabel = new Date(
    rosterYear,
    rosterMonth - 1,
    1,
  ).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const daftarNamaHari = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

  // Konfigurasi warna shift
  const shiftConfig: Record<string, { label: string; style: string }> = {
    P: {
      label: "[P] Pagi",
      style: "bg-blue-100 text-blue-700 border-blue-200",
    },
    S: {
      label: "[S] Siang/Sore",
      style: "bg-orange-100 text-orange-700 border-orange-200",
    },
    M: {
      label: "[M] Malam",
      style: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    L: { label: "[L] Libur", style: "bg-red-100 text-red-700 border-red-200" },
    "!": {
      label: "[!] Konflik Jadwal",
      style: "bg-red-200 text-red-900 border-red-400",
    },
    "-": {
      label: "[-] Shift Belum Dipetakan",
      style: "bg-gray-100 text-gray-600 border-gray-300",
    },
  };

  const jumlahHariDalamBulan = new Date(rosterYear, rosterMonth, 0).getDate();

  // Kalender dinamis berdasarkan bulan dan tahun yang dipilih
  const kalenderBulanIni = Array.from(
    { length: jumlahHariDalamBulan },
    (_, i) => {
      const tgl = i + 1;
      const tanggal = new Date(rosterYear, rosterMonth - 1, tgl);
      const indexHari = tanggal.getDay();
      return {
        tgl,
        hari: daftarNamaHari[indexHari],
        isLibur: indexHari === 0,
        dateKey: [
          rosterYear,
          String(rosterMonth).padStart(2, "0"),
          String(tgl).padStart(2, "0"),
        ].join("-"),
      };
    },
  );

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
              <h1 className="font-bold text-2xl">Calendar Jadwal Security</h1>
            </div>
            <p className="text-gray-500 text-sm">
              Pengaturan rotasi 3 shift (Pagi, Siang, Malam) gardu induk. Setiap
              satpam yang bertugas melakukan inspeksi menyeluruh ke seluruh 16
              Checkpoint (Full Circuit Patrol).
            </p>
          </div>
          <div></div>
        </div>

        {/* Jadwal Patroli */}
        <div className="mt-4 rounded-lg bg-white p-4">
          {/* Header */}
          <div className="flex gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="">
              <p className="text-lg font-bold">
                Roster Rotasi Bulan ({monthLabel})
              </p>

              <p className="text-sm font-semibold text-gray-500">
                Jadwal penugasan terpadu Satpam
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Legend Shift */}
              <div className="flex flex-wrap items-center gap-2">
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
            </div>
          </div>

          {/* Tabel Roster */}
          <div className="mt-6 w-full overflow-x-auto rounded-lg border border-gray-200 shadow-inner">
            <table className="w-full min-w-max border-collapse text-sm">
              {/* Header Tabel */}
              <thead>
                <tr className="bg-gray-50">
                  <th className="sticky left-0 z-20 min-w-[200px] border-b border-r border-gray-300 bg-gray-100 p-3 text-left font-bold text-gray-700 shadow-[1px_0_0_0_#d1d5db]">
                    Nama Petugas
                  </th>

                  {kalenderBulanIni.map((item) => (
                    <th
                      key={item.tgl}
                      className={`min-w-[42px] border-b border-l border-gray-200 p-2 text-center ${
                        item.isLibur ? "bg-red-50" : "bg-gray-50"
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-700">
                        {item.hari}
                      </div>

                      <div className="mt-1 text-sm font-bold text-gray-900">
                        {item.tgl}
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

                {/* Site Belum Tersedia */}
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

                {/* Data Kosong */}
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

                {/* Data Petugas */}
                {!isRosterLoading &&
                  !isRosterError &&
                  siteId &&
                  roster.map((petugas) => (
                    <tr
                      key={petugas.userId}
                      className="transition-colors hover:bg-blue-50"
                    >
                      {/* Identitas Petugas */}
                      <td className="sticky left-0 z-10 border-b border-r border-gray-300 bg-white p-3 font-semibold text-gray-800 shadow-[1px_0_0_0_#d1d5db]">
                        <div>{petugas.fullName}</div>

                        <div className="text-xs font-normal text-gray-500">
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

                        const shift = petugas.shifts?.[dateKey];

                        const config = shift ? shiftConfig[shift] : undefined;

                        return (
                          <td
                            key={dateKey}
                            className={`border-b border-l border-gray-200 p-1.5 ${
                              item.isLibur ? "bg-red-50/30" : ""
                            }`}
                          >
                            <div className="flex h-full items-center justify-center">
                              {shift ? (
                                <div
                                  title={`${petugas.fullName} - ${dateKey}`}
                                  className={`flex h-7 w-7 items-center justify-center rounded border text-xs font-bold shadow-sm ${
                                    config?.style ??
                                    "border-gray-200 bg-gray-100 text-gray-600"
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

export default RosterCalendar;

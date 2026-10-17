import {
  ArrowCircleRight2,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  ArrowSwapHorizontal,
  BoxTime,
  Calendar,
  DocumentCloud,
  Send,
  Thorchain,
  TickCircle,
  TickSquare,
  TimerStart,
  UserSquare,
} from "iconsax-react";
import React, { useState } from "react";

const ScheduleManage = () => {
  // const [selectedDay, setSelectedDay] = useState("Hari Ini");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState(
    "Shift 1 - Pagi (06:00 - 14:00 WITA)",
  );

  const guardData = [
    {
      name: "Dimas Maulana",
      NIP: "982-SEC-1",
      posisi: "Standby Pos",
      status: "Tersedia",
    },
    {
      name: "Dedi Sudarajat",
      NIP: "982-SEC-1",
      posisi: "Off Duty Hari Ini",
      status: "Tersedia",
    },
    {
      name: "Bambang Wijaya",
      NIP: "982-SEC-1",
      posisi: "Pasca Shift Pagi",
      status: "Tersedia",
    },
    {
      name: "Syaiful Anwar",
      NIP: "982-SEC-1",
      posisi: "Pasca Shift Pagi",
      status: "Off",
    },
  ];

  const jumlahHari = 31;
  const daftarNamaHari = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

  const kalenderBulanIni = Array.from({ length: jumlahHari }, (_, i) => {
    const tgl = i + 1;
    // (tgl + 3) % 7 -> Karena 1 Okt 2026 adalah Kamis (index 4)
    const indexHari = (tgl + 3) % 7;
    return {
      tgl: tgl,
      hari: daftarNamaHari[indexHari],
      isLibur: indexHari === 0, // 0 = Minggu
    };
  });

  // Konfigurasi Warna Shift (P, S, M, L)
  const shiftConfig = {
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
    L: { label: "[L] Libur", style: "bg-red-100 text-red-700 border-red-200" },
  };

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
                Jadwal Patroli & Manajemen Shift Satpam
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

                  {/* {isToday(currentDate) && (
                    <div className="bg-[#D5E3FF] rounded-sm px-2 ml-1">
                      <p className="text-[#221B3B] text-xs font-semibold">
                        Hari Ini
                      </p>
                    </div>
                  )} */}
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
            {/* <button className="bg-white rounded-sm px-4 py-2.5 shadow-sm cursor-pointer">
              <Refresh size={17} color="gray" />
            </button> */}
            {/* <div className="flex items-center justify-between">
              <div className=" bg-gray-200 rounded-sm px-3 py-1.5 flex items-center gap-2">
                {["Hari Ini", "Minggu Ini", "Bulan Ini"].map((item) => (
                  <button
                    onClick={() => setSelectedDay(item)}
                    className={`rounded-sm px-2 py-1 transition ${
                      selectedDay === item
                        ? "bg-white shadow-sm"
                        : "hover:bg-white/50"
                    }`}
                  >
                    <p
                      className={`text-xs font-semibold ${selectedDay === item ? "text-black" : "text-gray-600"}`}
                    >
                      {item}
                    </p>
                  </button>
                ))}
              </div>
            </div> */}
            {/* <button className="flex lg:items-center gap-1 bg-[#FED400] rounded-lg px-4 py-2 cursor-pointer">
              <AddCircle size={15} color="black" />
              <p className="font-semibold text-sm">Buat Jadwal / Roster</p>
            </button> */}
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <div className="p-2 w-[70%]">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center">
                <BoxTime size={20} color="#003B73" />
                <p className="text-lg font-semibold ml-2">
                  Status Rotasi 3-Shift Gardu Induk
                </p>
              </div>
              <p className="text-gray-500 font-semibold text-sm">
                Rotasi Operasional 24 Jam{" "}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-1">
                <div className="flex items-center">
                  <div className="bg-gray-200 shadow-sm p-2 rounded-lg ">
                    <p className="text-gray-500 font-semibold text-xs">01</p>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-800 font-semibold text-sm">
                      Shift Pagi{" "}
                    </p>
                    <p className="text-gray-500 text-xs">06:00 - 14:00 WIB</p>
                  </div>
                </div>
                <div className="bg-gray-200 shadow-sm rounded-xl px-2 py-0.5 flex items-center">
                  <TickCircle size={15} color="#003B73" />
                  <p className="text-xs text-gray-700 font-semibold ml-1">
                    Selesai (100% Diverifikasi)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  <div className="p-3 bg-[#D5E3FF] rounded-lg font-bold">
                    HG
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-bold tracking-wide">
                      Hendra Gunawan
                    </p>
                    <p className="text-xs text-gray-500 font-semibold tracking-wide">
                      NIP: 9812-SEC-01
                    </p>
                    <p className="text-xs text-gray-500 tracking-wide">
                      Regu A (Operasional Utama)
                    </p>
                  </div>
                </div>
                <div className="">
                  <p className="uppercase text-gray-500 font-semibold text-xs mb-1">
                    Cakupan Inspeksi
                  </p>
                  <div className="flex items-center gap-1 mb-1">
                    <TickSquare size={15} color="#003B73" />
                    <p className="text-xs tracking-wider">
                      Full Circuit (16/16 Titik)
                    </p>
                  </div>
                  <p className="text-gray-500 font-semibold text-xs">
                    Putaran: 07:30 - 09:15 & 11:30 - 13:00 WIB
                  </p>
                </div>
                <div className="px-2 items-center justify-center">
                  <div className="">
                    <button className="flex items-center gap-1 bg-gray-100 px-5 py-1 rounded-sm cursor-pointer">
                      <DocumentCloud size={17} color="#003B73" />
                      <p className="text-sm text-gray-800 font-semibold">
                        Laporan
                      </p>
                    </button>
                  </div>
                  <div className="mt-1">
                    <button className="px-6 py-1 cursor-pointer">
                      <p className="text-sm text-gray-500 font-semibold">
                        Detail Log
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mt-5 border-2 border-[#003B73]">
              <div className="flex items-center justify-between bg-[#F2F6FF] rounded-lg px-4 py-1">
                <div className="flex items-center">
                  <div className="bg-[#00529C] shadow-sm p-2 rounded-lg ">
                    <p className="font-semibold text-xs  text-white">02</p>
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <p className="text-gray-800 font-semibold text-sm">
                        Shift Siang{" "}
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs">14:00 - 22:00 WIB</p>
                  </div>
                </div>
                <div className="bg-white shadow-sm rounded-xl px-2 py-0.5 flex items-center">
                  <div className="w-px p-1 rounded-full animate-ping bg-yellow-400" />
                  <p className="text-xs text-gray-700 font-semibold ml-2">
                    Sedang Berlangsung
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="">
                  <div className="flex items-center">
                    <div className="p-3 bg-[#FED400] rounded-lg font-bold">
                      HG
                    </div>
                    <div className="ml-2">
                      <p className="text-xs font-bold tracking-wide">
                        Hendra Gunawan
                      </p>
                      <p className="text-xs text-gray-500 font-semibold tracking-wide">
                        NIP: 9812-SEC-01
                      </p>
                      <p className="text-xs text-gray-500 tracking-wide">
                        Regu A (Operasional Utama)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-5 w-[70%]">
                  <div className="">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="uppercase text-gray-500 font-semibold text-xs mb-1">
                        Progress Patroli Putaran 2
                      </p>
                      <p className="uppercase text-[#00529C] font-semibold text-xs mb-1 ml-3 px-1">
                        8 / 16 Titik (50%)
                      </p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00529C] rounded-full transition-all duration-500"
                        style={{ width: "50%" }}
                      />
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center gap-3">
                        <p className="text-gray-600 font-semibold text-xs">
                          Putaran I : 16 / 16 Titik
                        </p>
                      </div>
                      <div className="w-[px] bg-[#00529C] px-2.5 py-0.5 mx-2 mt-0.5" />
                      <div className="flex items-center gap-3">
                        <p className="text-gray-600 font-semibold text-xs">
                          Putaran II : 8 / 16 Titik
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mt-5">
              <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-1">
                <div className="flex items-center">
                  <div className="bg-gray-200 shadow-sm p-2 rounded-lg ">
                    <p className="text-gray-500 font-semibold text-xs">03</p>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-800 font-semibold text-sm">
                      Shift Malam{" "}
                    </p>
                    <p className="text-gray-500 text-xs">22:00 - 06:00 WIB</p>
                  </div>
                </div>
                <div className="bg-gray-200 shadow-sm rounded-xl px-2 py-0.5 flex items-center">
                  <TimerStart size={15} color="#003B73" />
                  <p className="text-xs text-gray-700 font-semibold ml-1">
                    Terjadwal (Mulai 7 Jam Lagi)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  <div className="p-3 bg-[#D5E3FF] rounded-lg font-bold">
                    HG
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-bold tracking-wide">
                      Hendra Gunawan
                    </p>
                    <p className="text-xs text-gray-500 font-semibold tracking-wide">
                      NIP: 9812-SEC-01
                    </p>
                    <p className="text-xs text-gray-500 tracking-wide">
                      Regu A (Operasional Utama)
                    </p>
                  </div>
                </div>
                <div className="">
                  <p className="uppercase text-gray-500 font-semibold text-xs mb-1">
                    Cakupan Inspeksi
                  </p>
                  <div className="flex items-center gap-1 mb-1">
                    <Thorchain size={15} color="#003B73" />
                    <p className="text-xs tracking-wider">16 Titik</p>
                  </div>
                  <p className="text-gray-500 font-semibold text-xs">
                    Putaran: 23:00 WIB & 03:30 WIB
                  </p>
                </div>
                <div className="items-center justify-center">
                  <div className="">
                    <button className="flex items-center gap-1 bg-gray-100 px-5 py-1 rounded-sm cursor-pointer">
                      <DocumentCloud size={17} color="#003B73" />
                      <p className="text-sm text-gray-800 font-semibold">
                        Edit Penugasan
                      </p>
                    </button>
                  </div>
                  <div className="mt-1">
                    <button className="px-6 py-1 cursor-pointer">
                      <p className="text-sm text-gray-500 font-semibold">
                        Pilih Pengganti
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-2 w-[30%]">
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <form
                action=""
                method="post"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Container utama: stack ke bawah di mobile, baris sejajar di layar menengah (md) */}
                <div className="gap-5">
                  {/* Bagian Pilih Shift */}
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Pilih Shift
                    </label>
                    {/* Menggunakan select karena biasanya shift adalah pilihan. Jika ingin tetap input text, ganti tag select menjadi input. */}
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FED400] focus:border-transparent transition-all">
                      <option value="" disabled selected>
                        Pilih jadwal shift...
                      </option>
                      <option value="pagi">Shift Pagi</option>
                      <option value="siang">Shift Siang</option>
                      <option value="malam">Shift Malam</option>
                    </select>
                  </div>

                  {/* Bagian Waktu */}
                  <div className="flex items-end gap-3 w-full mt-2">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Start At
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FED400] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Pemisah titik dua yang sejajar dengan input box */}
                    <span className="pb-3 text-gray-400 font-bold">:</span>

                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        End At
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FED400] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Tombol Submit */}
                <button
                  type="submit"
                  className="flex items-center justify-center w-full bg-[#FED400] hover:bg-yellow-400 text-gray-900 py-2 rounded-lg mt-6 cursor-pointer transition-all shadow-sm font-semibold text-sm"
                  onClick={() => console.log("Simpan diklik")}
                >
                  <Send size={18} className="mr-2" color="black" />
                  Submit
                </button>
              </form>
            </div>
            <div className="bg-white p-4 rounded-lg mt-4">
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
                    {[
                      "Shift 1 - Pagi (06:00 - 14:00 WITA)",
                      " Shift 2 - Siang (14:00 - 22:00 WITA)",
                      " Shift 3 - Malam (22:00 - 06:00 WITA)",
                    ].map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => setSelectedShift(item)}
                          className={`text-xs text-gray-600 hover:bg-gray-200 rounded-md ${
                            selectedShift === item
                              ? "bg-gray-100 text-gray-600 font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {item}
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
                {guardData.slice(0, 3).map((item) => {
                  const isAvailable = item.status === "Tersedia";
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
                            {item.name}
                          </p>
                          <p
                            className={`text-xs font-semibold ${isAvailable ? "text-[#004780]" : "text-[#ABAEB5]"}`}
                          >
                            {item.posisi}
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
          </div>
        </div>

        {/* Jadwal Patroli */}
        <div className="bg-white rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">
                Roster Rotasi Bulan (Oktober 2026)
              </p>
              <p className="text-sm text-gray-500 font-semibold">
                Jadwal penugasan terpadu Satpam Gardu Induk Gambir 150kV
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Legend Indikator Shift */}
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

              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-md">
                <ArrowSwapHorizontal size={16} color="#4b5563" />
                <p className="text-sm text-gray-600 font-bold">Tukar Shift</p>
              </button>
            </div>
          </div>

          <div className="mt-6 w-full overflow-x-auto border border-gray-200 rounded-lg shadow-inner">
            <table className="w-full border-collapse min-w-max text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {/* Header Nama Petugas - Sticky Left */}
                  <th className="sticky left-0 z-20 bg-gray-100 p-3 text-left font-bold text-gray-700 border-b border-r border-gray-300 shadow-[1px_0_0_0_#d1d5db]">
                    Nama Petugas
                  </th>

                  {/* Header Tanggal Dinamis */}
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
                {guardData.map((petugas, rowIndex) => (
                  <tr className="hover:bg-blue-50 transition-colors">
                    {/* Kolom Nama Petugas - Sticky Left */}
                    <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-gray-800 border-b border-r border-gray-300 shadow-[1px_0_0_0_#d1d5db]">
                      {petugas.name}
                    </td>

                    {/* Kolom Shift Tanggal */}
                    {kalenderBulanIni.map((item, colIndex) => {
                      // Membuat dummy shift berulang untuk preview (Ganti dengan data real Anda nantinya)
                      const shiftCodes = ["P", "S", "M", "L"];
                      const shift = shiftCodes[(rowIndex + colIndex) % 4];

                      // Mengambil style berdasarkan kode shift
                      const styleShift = shiftConfig[shift].style;

                      return (
                        <td
                          key={item.tgl}
                          className={`border-b border-l border-gray-200 p-1.5 ${
                            item.isLibur ? "bg-red-50/30" : "" // Memberi sedikit corak jika hari Minggu
                          }`}
                        >
                          <div className="flex justify-center items-center h-full">
                            {/* Wrapper warna untuk Shift */}
                            <div
                              className={`w-7 h-7 flex items-center justify-center rounded border ${styleShift} font-bold text-xs shadow-sm`}
                            >
                              {shift}
                            </div>
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

import {
  ArrowDown2,
  CardAdd,
  CloseCircle,
  Edit,
  Eye,
  Location,
  LocationDiscover,
  More,
  Personalcard,
  Radar,
  SearchNormal,
} from "iconsax-react";
import React, { useMemo, useState } from "react";

const NfcManage = () => {
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const dataNFC = [
    {
      UID: "04:7A:B2:9C:1F:60:80",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0412",
      checkpoint: "Area Trafo Daya 1 (150kV)",
      location: "UP Sambelia 150kV • Switchyard Barat",
      status: "Aktif",
      lastActivityAt: "14:29 WITA",
      totalScan: "102",
      scanBy: "Agus Setiawan",
      createdAt: "12 September 2026",
    },

    {
      UID: "04:8C:A1:7D:2B:45:91",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0413",
      checkpoint: "Perimeter Timur",
      location: "UP Sambelia 150kV • Perimeter Timur",
      status: "Tersedia",
      lastActivityAt: "Belum ada riwayat patrol",
      totalScan: "0",
      scanBy: "-",
      createdAt: "13 September 2026",
    },

    {
      UID: "04:9F:C3:8A:5D:72:16",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0414",
      checkpoint: "Gedung Kontrol & Relay Panel",
      location: "UP Sambelia 150kV • Control Building",
      status: "Rusak",
      lastActivityAt: "02 Oktober 2026, 10:32 WITA",
      totalScan: "68",
      scanBy: "Helmy Setiawan",
      createdAt: "14 September 2026",
    },

    {
      UID: "04:B2:6E:4C:91:37:50",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0415",
      checkpoint: "Area Trafo Daya 2 (150kV)",
      location: "UP Sambelia 150kV • Switchyard Timur",
      status: "Hilang",
      lastActivityAt: "01 Oktober 2026, 16:45 WITA",
      totalScan: "87",
      scanBy: "Agus Setiawan",
      createdAt: "15 September 2026",
    },

    {
      UID: "04:C5:8B:2A:73:19:64",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0416",
      checkpoint: "Bay Line 150kV",
      location: "UP Sambelia 150kV • Switchyard Utara",
      status: "Aktif",
      lastActivityAt: "13:45 WITA",
      totalScan: "156",
      scanBy: "Budi Santoso",
      createdAt: "16 September 2026",
    },

    {
      UID: "04:D7:41:9E:26:58:AB",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0417",
      checkpoint: "Perimeter Selatan",
      location: "UP Sambelia 150kV • Perimeter Selatan",
      status: "Tersedia",
      lastActivityAt: "Belum ada riwayat patrol",
      totalScan: "0",
      scanBy: "-",
      createdAt: "17 September 2026",
    },

    {
      UID: "04:E1:73:B8:42:6C:95",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0418",
      checkpoint: "Gudang Peralatan",
      location: "UP Sambelia 150kV • Area Gudang",
      status: "Rusak",
      lastActivityAt: "30 September 2026, 09:18 WITA",
      totalScan: "43",
      scanBy: "Rizky Pratama",
      createdAt: "18 September 2026",
    },

    {
      UID: "04:F8:25:C1:67:3A:82",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0419",
      checkpoint: "Pintu Masuk Utama",
      location: "UP Sambelia 150kV • Main Gate",
      status: "Aktif",
      lastActivityAt: "12:17 WITA",
      totalScan: "231",
      scanBy: "Helmy Setiawan",
      createdAt: "19 September 2026",
    },

    {
      UID: "04:A4:96:D2:51:7B:38",
      nfc: "NTAG215 Anti-Metal",
      nfcKode: "SN-PLN-2024-0420",
      checkpoint: "Area Kabel & Trench",
      location: "UP Sambelia 150kV • Cable Area",
      status: "Hilang",
      lastActivityAt: "29 September 2026, 15:27 WITA",
      totalScan: "74",
      scanBy: "Budi Santoso",
      createdAt: "20 September 2026",
    },
  ];

  const checkpointList = useMemo(() => {
    return [...new Set(dataNFC.map((q) => q.checkpoint))];
  }, []);

  const openRegisterModal = () => {
    const modal = document.getElementById("register_nfc") as HTMLDialogElement;
    modal.showModal();
  };
  const closeRegisterModal = () => {
    const modal = document.getElementById("register_nfc") as HTMLDialogElement;
    modal.close();
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
        <div className="mt-5 grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">
                Manajemen Tag NFC & Keamanan Hardware
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Inventaris dan siklus hidup tag RFID/NFC fisik gardu induk,
              enkripsi token dinamis AES-256, binding checkpoint patroli, serta
              audit integritas verifikasi personel lapangan.
            </p>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={openRegisterModal}
              className="bg-[#FED400] shadow-sm rounded-lg p-3 cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <div className="bg-[#FED400] p-1 rounded-lg">
                  <CardAdd size={17} color="#6F5C00" />
                </div>
                <div className="ml-1">
                  <p className="text-gray-900 text-sm font-semibold">
                    Daftarkan Tag NFC Baru
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Register NFC Modal */}
        <dialog id="register_nfc" className="modal">
          {/* Menggunakan w-[450px] sebagai pengganti w-112.5 agar valid di Tailwind */}
          <div className="modal-box max-w-none w-112.5 h-screen max-h-screen rounded-none absolute right-0 top-0 m-0 p-0 flex flex-col bg-white">
            {/* Header Section */}
            <div className="flex items-start justify-between px-6 py-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-300 rounded-lg p-3 shrink-0">
                  <CardAdd size={24} color="black" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-800">
                    Registrasi Tag NFC Baru
                  </h3>
                  <p className="text-xs text-gray-500 tracking-wide mt-1 line-clamp-2">
                    Inisialisasi perangkat fisik ke dalam database K3 & Keamanan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeRegisterModal}
                className="btn btn-sm btn-circle btn-ghost -mr-2"
                aria-label="Tutup modal"
              >
                <CloseCircle size={22} color="gray" />
              </button>
            </div>

            {/* Body / Form Section */}
            <div className="p-6 grow overflow-y-auto">
              <div className="form-control w-full">
                <label htmlFor="uid_nfc" className="label px-0 pt-0">
                  <span className="text-sm font-bold text-gray-700">
                    UID Chip NFC (HEX Format){" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>

                {/* Input & Scan Button Group */}
                <div className="flex gap-2 items-start">
                  <div className="grow">
                    <input
                      id="uid_nfc"
                      type="text"
                      placeholder="Contoh: 04:7A:B2:9C:1F:60:80"
                      className="input input-bordered w-full rounded-md text-sm border-gray-300 focus:border-blue-500"
                    />
                    <label className="label px-0 pb-0">
                      <span className="text-xs text-gray-500">
                        Pastikan format sesuai dengan UID asli.
                      </span>
                    </label>
                  </div>

                  <button
                    type="button"
                    className="btn bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 rounded-md flex gap-2 px-4 shadow-none"
                  >
                    <Radar size={18} color="blue" />
                    <span className="text-sm font-semibold">
                      Scan Reader USB
                    </span>
                  </button>
                </div>

                <div className="bg-gray-100 p-3 rounded-sm mt-5">
                  <div className="flex items-center justify-between gap-10">
                    <div>
                      <p className="text-xs font-semibold">
                        Hubungkan ke Titik Checkpoint Patroli
                      </p>
                      <p className="text-xs text-gray-500 font-semibold">
                        Nonaktifkan bila ingin disimpan sebagai tag cadangan
                        gudang
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-success toggle-sm"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="uppercase text-xs text-gray-500 tracking-wide">
                      Pilih Titik Checkpoint
                    </p>
                    <div className="dropdown dropdown-start mt-1 w-full">
                      <div
                        tabIndex={0}
                        role="button"
                        className="bg-white border border-gray-300 rounded-sm px-3 py-2 cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <LocationDiscover
                              size={17}
                              color="gray"
                              className="shrink-0"
                            />

                            <div className="min-w-0">
                              <p className="text-xs text-gray-600 font-semibold truncate">
                                {"Pilih Checkpoint"}
                              </p>
                            </div>
                          </div>
                          <ArrowDown2
                            size={17}
                            color="gray"
                            className="shrink-0"
                          />
                        </div>
                      </div>

                      <ul
                        tabIndex={-1}
                        className="dropdown-content menu w-full bg-gray-100 rounded-lg z-10 w-64 p-2 mt-1 shadow-md border border-gray-200"
                      >
                        {checkpointList.map((checkpoint) => (
                          <li key={checkpoint}>
                            <button
                              type="button"
                              // onClick={() => setSelectedCheckpoint(checkpoint)}
                              className="text-xs text-gray-600 hover:bg-gray-200 rounded-md"
                            >
                              {checkpoint}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Action Buttons (Opsional: Sangat disarankan untuk form) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
              <button
                type="button"
                onClick={closeRegisterModal}
                className="btn btn-ghost bg-white border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={closeRegisterModal}
                className="btn bg-yellow-400 hover:bg-yellow-500 text-black border-none rounded-md"
              >
                Simpan Tag
              </button>
            </div>
          </div>
        </dialog>
        {/* Register NFC Modal */}

        <div className="mt-5 bg-white rounded-lg px-4 py-3">
          <div className="flex items-center">
            <label className="input bg-gray-100 w-full">
              <SearchNormal size={20} color="gray" />
              <input
                type="search"
                required
                placeholder="Cari UID Tag, Nama Checkpoint, Lokasi"
                className="text-gray-700 text-sm bg-gray-100"
                //   value={search}
                //   onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <div className="ml-3 flex items-center justify-end gap-2">
              <div className="dropdown dropdown-start ">
                <div
                  tabIndex={0}
                  role="button"
                  className="bg-gray-100 rounded-sm px-3 py-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <LocationDiscover
                        size={17}
                        color="gray"
                        className="shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 text-start">
                          Checkpoint:
                        </p>

                        <p className="text-xs text-gray-600 font-semibold truncate">
                          {"Pilih Checkpoint"}
                        </p>
                      </div>
                    </div>
                    <ArrowDown2 size={17} color="gray" className="shrink-0" />
                  </div>
                </div>

                <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-gray-100 rounded-lg z-10 w-64 p-2 mt-1 shadow-md border border-gray-200"
                >
                  {checkpointList.map((checkpoint) => (
                    <li key={checkpoint}>
                      <button
                        type="button"
                        // onClick={() => setSelectedCheckpoint(checkpoint)}
                        className="text-xs text-gray-600 hover:bg-gray-200 rounded-md"
                      >
                        {checkpoint}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dropdown dropdown-start ">
                <div
                  tabIndex={0}
                  role="button"
                  className="bg-gray-100 rounded-sm px-3 py-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <LocationDiscover
                        size={17}
                        color="gray"
                        className="shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 text-start">
                          Checkpoint:
                        </p>

                        <p className="text-xs text-gray-600 font-semibold truncate">
                          {"Pilih Checkpoint"}
                        </p>
                      </div>
                    </div>
                    <ArrowDown2 size={17} color="gray" className="shrink-0" />
                  </div>
                </div>

                <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-gray-100 rounded-lg z-10 w-64 p-2 mt-1 shadow-md border border-gray-200"
                >
                  {["Gedung Kontrol", "Gedung Kontrol 2"].map((checkpoint) => (
                    <li key={checkpoint}>
                      <button
                        type="button"
                        // onClick={() => setSelectedCheckpoint(checkpoint)}
                        className="text-xs text-gray-600 hover:bg-gray-200 rounded-md"
                      >
                        {checkpoint}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            {["Semua", "Aktif", "Rusak / Fault", "Hilang"].map((item) => (
              <button
                onClick={() => setSelectedStatus(item)}
                className={`px-4 py-1 gap-2 rounded-lg transition-color ${selectedStatus === item ? "bg-[#003B73] shadow-sm" : "hover:bg-white/50"}`}
              >
                <p
                  className={`text-xs tracking-wide ${selectedStatus === item ? "text-white font-semibold" : "text-gray-600"}`}
                >
                  {item}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 ">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th className="uppercase">UID Tag & Hardware Info</th>
                  <th className="uppercase">Lokasi & Checkpoint Binding</th>
                  <th className="uppercase">Status Integritas</th>
                  <th className="uppercase">Riwayat Patroli Terakhir</th>
                  <th className="uppercase">Kontrol Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataNFC.map((item) => (
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="">
                        <div className="text xs font-semibold">{item.UID}</div>
                        <div className="flex items-center gap-3 w-[70%]">
                          <div className="font-bold">{item.nfc}</div>
                          <div className="text-sm opacity-50">
                            {item.nfcKode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-semibold">
                        {item.checkpoint}
                      </div>
                      <div className="flex items-center gap-1">
                        <Location size={15} color="gray" />
                        <p className="text-xs font-semibold text-gray-500">
                          {item.location}
                        </p>
                      </div>
                    </td>
                    <td className="">
                      {item.status === "Aktif" && (
                        <div className="bg-gray-200 rounded-lg px-3 py-1">
                          <div className="flex items-center gap-1">
                            <div className="bg-gray-700 p-1 h-[1px] rounded-full " />
                            <p className="uppercase text-sm font-semibold">
                              {item.status}
                            </p>
                            <p className="uppercase text-sm font-semibold">
                              (Terikat)
                            </p>
                          </div>
                          <div>
                            <p></p>
                          </div>
                        </div>
                      )}
                      {item.status === "Tersedia" && (
                        <div className="bg-gray-200 rounded-lg px-3 py-1">
                          <div className="flex items-center gap-1">
                            <div className="bg-gray-700 p-1 h-[1px] rounded-full " />
                            <p className="uppercase text-sm font-semibold">
                              {item.status}
                            </p>
                            <p className="uppercase text-sm font-semibold">
                              (Terikat)
                            </p>
                          </div>
                          <div>
                            <p></p>
                          </div>
                        </div>
                      )}
                      {item.status === "Rusak" && (
                        <div className="bg-[#A90009] rounded-lg px-3 py-1">
                          <div className="flex items-center gap-1">
                            <div className="bg-white p-1 h-[1px] rounded-full animate-ping " />
                            <p className="uppercase text-sm text-white font-semibold">
                              {item.status}
                            </p>
                            <p className="uppercase text-sm text-white font-semibold">
                              (Fault)
                            </p>
                          </div>
                          <div>
                            <p></p>
                          </div>
                        </div>
                      )}
                      {item.status === "Hilang" && (
                        <div className="bg-[#A90009] rounded-lg px-3 py-1">
                          <div className="flex items-center gap-1">
                            <div className="bg-gray-400 p-1 h-[1px] rounded-full " />
                            <p className="uppercase text-sm text-gray-400 font-semibold">
                              {item.status}
                            </p>
                            <p className="uppercase text-sm text-gray-400 font-semibold">
                              (Missing)
                            </p>
                          </div>
                          <div>
                            <p></p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="">
                      {item.status === "Aktif" && (
                        <div>
                          <div className="flex text-xs text-gray-500 font-bold">
                            Hari Ini,
                            <p className="text-xs text-gray-500 font-bold">
                              {item.lastActivityAt}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Personalcard size={15} color="gray" />
                            <p className="text-gray-500 text-xs font-semibold">
                              {item.scanBy}
                            </p>
                          </div>
                          <div className="flex text-xs text-gray-500">
                            Total Scan:
                            <p className="text-xs text-gray-500">
                              {" "}
                              {item.totalScan}
                            </p>
                          </div>
                        </div>
                      )}

                      {item.status === "Tersedia" && (
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-gray-400 font-semibold">
                              Belum ada riwayat patrol
                            </p>
                          </div>

                          <div className="flex items-center gap-1 mt-1">
                            <CardAdd size={15} color="gray" />
                            <p className="text-gray-500 text-xs font-semibold">
                              Didaftarkan: {item.createdAt}
                            </p>
                          </div>
                        </div>
                      )}
                      {item.status === "Rusak" && (
                        <div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                            <span>Rusak pada:</span>
                          </div>

                          <p className="text-xs text-gray-600 font-semibold mt-1">
                            {item.lastActivityAt}
                          </p>
                        </div>
                      )}

                      {item.status === "Hilang" && (
                        <div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                            <span>Hilang pada:</span>
                          </div>

                          <p className="text-xs text-gray-600 font-semibold mt-1">
                            {item.lastActivityAt}
                          </p>
                        </div>
                      )}
                    </td>
                    <th>
                      <div className="flex items-center ml-1 gap-4">
                        <button className="flex items-center cursor-pointer hover:bg-white/50 hover:shadow-sm px-1 py-2 rounded-lg">
                          <Edit size={17} color="gray" />
                        </button>
                        <button className="flex items-center cursor-pointer hover:bg-white/50 hover:shadow-sm px-1 py-2 rounded-lg">
                          <Eye size={17} color="gray" />
                        </button>
                        <button className="flex items-center cursor-pointer hover:bg-white/50 hover:shadow-sm px-1 py-2 rounded-lg">
                          <More size={17} color="gray" />
                        </button>
                      </div>
                    </th>
                  </tr>
                ))}
              </tbody>
              {/* foot */}
              <tfoot></tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfcManage;

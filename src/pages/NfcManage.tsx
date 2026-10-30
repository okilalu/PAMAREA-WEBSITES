import {
  ArrowDown2,
  CardAdd,
  CloseCircle,
  Edit,
  Eye,
  LocationDiscover,
  More,
  Personalcard,
  Radar,
  SearchNormal,
} from "iconsax-react";
import React, { useMemo, useState } from "react";
import { useActivateNfc, useNfcTags } from "../hooks/nfc/useNfc";
import { formatDateTimeWITA, formatRelativeTime } from "../helpers/dateTime";
import { usePatrolPoints } from "../hooks/patrol-point/usePatrolPoints";
import { useAssignNfc } from "../hooks/patrol-point-nfc/usePatroPointNfc";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";

const NfcManage = () => {
  const [search, setSearch] = useState({
    uid: "",
    label: "",
    status: "",
  });

  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  // Filter checkpoint tabel, terpisah dari pilihan checkpoint modal.
  const [selectedCheckpoint, setSelectedCheckpoint] = useState("Semua");

  // =========================================================
  // QUERY DATA
  // =========================================================
  const { data: nfcTags = [], isLoading, isError } = useNfcTags();

  const { data: areaPatrol = [] } = usePatrolPoints();

  const dataNFCTags = nfcTags;

  // =========================================================
  // MUTATIONS
  // =========================================================
  const { mutateAsync: activateNfc, isPending: isActivating } =
    useActivateNfc();

  const { mutateAsync: assignNfc, isPending: isAssigning } = useAssignNfc();

  // Gabungkan status loading kedua mutation.
  const isPending = isActivating || isAssigning;

  // =========================================================
  // STATE MODAL AKTIVASI NFC
  // =========================================================
  const [uid, setUid] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isAssignCheckpoint, setIsAssignCheckpoint] = useState(false);

  // Simpan ID patrol point, bukan nama checkpoint.
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<
    string | null
  >(null);

  // =========================================================
  // DATA CHECKPOINT
  // =========================================================

  // Label NFC yang digunakan pada filter tabel.
  const checkpointList = useMemo(() => {
    return [
      ...new Set(
        dataNFCTags
          .map((item) => item.label)
          .filter(
            (label): label is string =>
              typeof label === "string" && label.trim().length > 0,
          ),
      ),
    ];
  }, [dataNFCTags]);

  // Hanya titik patroli berstatus INACTIVE yang tersedia
  // untuk dipilih pada modal aktivasi NFC.
  const nonActiveArea = useMemo(() => {
    return areaPatrol.filter((area) => area.status === "INACTIVE");
  }, [areaPatrol]);

  // =========================================================
  // FILTER DATA NFC
  // =========================================================
  const filteredDataNFC = useMemo(() => {
    const normalizedGlobalSearch = globalSearch.trim().toLowerCase();

    return dataNFCTags.filter((item) => {
      const normalizedUid = item.uid?.toLowerCase() ?? "";
      const normalizedLabel = item.label?.toLowerCase() ?? "";
      const normalizedStatus = item.status?.toLowerCase() ?? "";

      // Pencarian global.
      const globalMatch =
        !normalizedGlobalSearch ||
        normalizedUid.includes(normalizedGlobalSearch) ||
        normalizedLabel.includes(normalizedGlobalSearch) ||
        normalizedStatus.includes(normalizedGlobalSearch);

      // Pencarian berdasarkan kolom.
      const uidMatch = normalizedUid.includes(search.uid.trim().toLowerCase());

      const labelMatch = normalizedLabel.includes(
        search.label.trim().toLowerCase(),
      );

      const statusMatch = normalizedStatus.includes(
        search.status.trim().toLowerCase(),
      );

      // Filter status.
      const selectedStatusMatch =
        selectedStatus === "Semua" ||
        (selectedStatus === "Aktif" && item.status === "ACTIVE") ||
        (selectedStatus === "Tersedia" && item.status === "UNASSIGNED") ||
        (selectedStatus === "Rusak / Fault" && item.status === "DAMAGED") ||
        (selectedStatus === "Hilang" && item.status === "LOST");

      // Filter label checkpoint pada tabel.
      const checkpointMatch =
        selectedCheckpoint === "Semua" || item.label === selectedCheckpoint;

      return (
        globalMatch &&
        uidMatch &&
        labelMatch &&
        statusMatch &&
        selectedStatusMatch &&
        checkpointMatch
      );
    });
  }, [dataNFCTags, globalSearch, search, selectedStatus, selectedCheckpoint]);

  // =========================================================
  // MODAL REGISTRASI NFC
  // =========================================================
  // const openRegisterModal = () => {
  //   const modal = document.getElementById(
  //     "register_nfc",
  //   ) as HTMLDialogElement | null;

  //   modal?.showModal();
  // };

  // const closeRegisterModal = () => {
  //   const modal = document.getElementById(
  //     "register_nfc",
  //   ) as HTMLDialogElement | null;

  //   modal?.close();
  // };

  // =========================================================
  // MODAL AKTIVASI NFC
  // =========================================================
  const handleOpenModal = (nfc: (typeof dataNFCTags)[number]) => {
    // Hanya NFC yang belum diaktifkan yang bisa diproses.
    if (nfc.status !== "UNASSIGNED" || isPending) {
      return;
    }

    setSelectedId(nfc.id);
    setUid(nfc.uid);

    setIsAssignCheckpoint(false);
    setSelectedCheckpointId(null);

    const modal = document.getElementById(
      "activate_nfc",
    ) as HTMLDialogElement | null;

    modal?.showModal();
  };

  const handleCloseModal = () => {
    // Jangan tutup modal ketika proses masih berjalan.
    if (isPending) {
      return;
    }

    const modal = document.getElementById(
      "activate_nfc",
    ) as HTMLDialogElement | null;

    modal?.close();

    // Bersihkan state modal.
    setSelectedId(null);
    setUid("");
    setIsAssignCheckpoint(false);
    setSelectedCheckpointId(null);
  };

  // =========================================================
  // AKTIVASI DAN PENUGASAN NFC
  // =========================================================
  const handleAssignNfc = async () => {
    if (isPending) {
      return;
    }

    if (!selectedId) {
      console.error("Pilih NFC yang ingin diaktifkan.");
      return;
    }

    if (isAssignCheckpoint && !selectedCheckpointId) {
      console.error("Pilih titik checkpoint terlebih dahulu.");
      return;
    }

    try {
      await activateNfc(selectedId);

      if (isAssignCheckpoint && selectedCheckpointId) {
        await assignNfc({
          patrolPointId: selectedCheckpointId,
          nfcTagId: selectedId,
        });
      }
      const modal = document.getElementById(
        "activate_nfc",
      ) as HTMLDialogElement | null;

      modal?.close();

      setSelectedId(null);
      setUid("");
      setIsAssignCheckpoint(false);
      setSelectedCheckpointId(null);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="min-h-screen">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "NFC Management" },
          { label: "Register NFC " },
        ]}
      />

      <div className="px-6 pb-6">
        <div className="mt-5 grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C] px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">Manajemen NFC</h1>
            </div>

            <p className="text-gray-500 text-sm">
              Inventaris dan siklus hidup tag RFID/NFC fisik gardu induk,
              enkripsi token dinamis AES-256, binding checkpoint patroli, serta
              audit integritas verifikasi personel lapangan.
            </p>
          </div>

          {/* <div className="flex items-center justify-end">
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
          </div> */}
        </div>

        {/* REGISTER NFC MODAL */}
        {/* <dialog id="register_nfc" className="modal">
          <div className="modal-box max-w-none w-112.5 h-screen max-h-screen rounded-none absolute right-0 top-0 m-0 p-0 flex flex-col bg-white">
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

            <div className="p-6 grow overflow-y-auto">
              <div className="form-control w-full">
                <label htmlFor="uid_nfc" className="label px-0 pt-0">
                  <span className="text-sm font-bold text-gray-700">
                    UID Chip NFC (HEX Format)
                    <span className="text-red-500">*</span>
                  </span>
                </label>

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
                                Pilih Checkpoint
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
        </dialog> */}

        <div className="mt-5 bg-white rounded-lg px-4 py-3">
          <div className="flex items-center">
            <label className="input bg-gray-100 w-full">
              <SearchNormal size={20} color="gray" />

              <input
                type="search"
                placeholder="Cari UID Tag, Nama Checkpoint, atau Status"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="text-gray-700 text-sm bg-gray-100"
              />
            </label>

            <div className="ml-3 flex items-center justify-end gap-2">
              <div className="dropdown dropdown-start">
                <div
                  tabIndex={0}
                  role="button"
                  className="bg-gray-100 rounded-sm px-3 py-2 cursor-pointer min-w-[190px]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <LocationDiscover
                        size={17}
                        color="gray"
                        className="shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Checkpoint</p>

                        <p className="text-xs text-gray-700 font-semibold truncate">
                          {selectedCheckpoint === "Semua"
                            ? "Semua Checkpoint"
                            : selectedCheckpoint}
                        </p>
                      </div>
                    </div>

                    <ArrowDown2 size={17} color="gray" className="shrink-0" />
                  </div>
                </div>

                <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-white rounded-lg z-20 w-64 max-h-64 overflow-y-auto p-2 mt-1 shadow-md border border-gray-200"
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => setSelectedCheckpoint("Semua")}
                      className={`text-xs rounded-md ${
                        selectedCheckpoint === "Semua"
                          ? "bg-blue-50 text-[#003B73] font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      Semua Checkpoint
                    </button>
                  </li>

                  {checkpointList.map((checkpoint) => (
                    <li key={checkpoint}>
                      <button
                        type="button"
                        onClick={() => setSelectedCheckpoint(checkpoint)}
                        className={`text-xs rounded-md ${
                          selectedCheckpoint === checkpoint
                            ? "bg-blue-50 text-[#003B73] font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {checkpoint}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {["Semua", "Aktif", "Tersedia", "Rusak / Fault", "Hilang"].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    selectedStatus === status
                      ? "bg-[#003B73] shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <p
                    className={`text-xs tracking-wide ${
                      selectedStatus === status
                        ? "font-semibold text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {status}
                  </p>
                </button>
              ),
            )}
          </div>
        </div>

        {/* TABEL NFC */}
        <div className="mt-5">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="uppercase">UID NFC</th>
                  <th className="uppercase">Label NFC</th>
                  <th className="uppercase">Status</th>
                  <th className="uppercase">Riwayat Patroli</th>
                  <th className="uppercase">Aksi</th>
                </tr>

                <tr className="bg-gray-50">
                  <th>
                    <input
                      type="text"
                      placeholder="Cari UID NFC..."
                      value={search.uid}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          uid: e.target.value,
                        }))
                      }
                      className="input input-sm input-bordered w-full min-w-[130px] bg-white font-normal"
                    />
                  </th>

                  <th>
                    <input
                      type="text"
                      placeholder="Cari area..."
                      value={search.label}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                      className="input input-sm input-bordered w-full min-w-[130px] bg-white font-normal"
                    />
                  </th>

                  <th>
                    <input
                      type="text"
                      placeholder="Cari status..."
                      value={search.status}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="input input-sm input-bordered w-full min-w-[110px] bg-white font-normal"
                    />
                  </th>

                  <th></th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <span className="loading loading-spinner loading-md text-[#003B73]" />
                      <p className="mt-2 text-sm text-gray-500">
                        Memuat data NFC...
                      </p>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <p className="text-sm font-semibold text-red-600">
                        Gagal memuat data NFC.
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Periksa koneksi ke server dan coba muat ulang halaman.
                      </p>
                    </td>
                  </tr>
                ) : filteredDataNFC.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <LocationDiscover size={32} color="#9CA3AF" />

                        <p className="text-sm font-semibold text-gray-600">
                          Data NFC tidak ditemukan
                        </p>

                        <p className="text-xs text-gray-400">
                          Coba ubah kata kunci atau filter yang digunakan.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            setSearch({
                              uid: "",
                              label: "",
                              status: "",
                            });
                            setGlobalSearch("");
                            setSelectedStatus("Semua");
                            setSelectedCheckpoint("Semua");
                          }}
                          className="mt-1 text-xs font-semibold text-[#003B73] hover:underline"
                        >
                          Reset Filter
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDataNFC.map((item) => {
                    const statusConfig = {
                      ACTIVE: {
                        label: "Aktif",
                        description: "Terikat",
                        className:
                          "bg-green-50 text-green-700 border-green-200",
                        dotClassName: "bg-green-500",
                      },
                      UNASSIGNED: {
                        label: "Tersedia",
                        description: "Belum terikat",
                        className: "bg-blue-50 text-blue-700 border-blue-200",
                        dotClassName: "bg-blue-500",
                      },
                      DAMAGED: {
                        label: "Rusak",
                        description: "Fault",
                        className: "bg-red-50 text-red-700 border-red-200",
                        dotClassName: "bg-red-500",
                      },
                      LOST: {
                        label: "Hilang",
                        description: "Missing",
                        className: "bg-gray-100 text-gray-600 border-gray-300",
                        dotClassName: "bg-gray-500",
                      },
                    } as const;

                    const status =
                      statusConfig[item.status as keyof typeof statusConfig];

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 transition-colors hover:bg-gray-50/80"
                      >
                        {/* UID NFC */}
                        <td>
                          <div className="min-w-[150px]">
                            <p className="font-mono text-xs font-semibold text-gray-800">
                              NFC-{item.uid}
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                              ID: {item.id?.slice(0, 8) ?? "-"}
                            </p>
                          </div>
                        </td>

                        {/* LABEL NFC */}
                        <td>
                          <div className="min-w-[170px]">
                            {item.label ? (
                              <p className="text-sm font-semibold text-gray-800">
                                {item.label}
                              </p>
                            ) : (
                              <p className="text-xs italic text-gray-500">
                                Belum ada Label NFC
                              </p>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td>
                          {status ? (
                            <div
                              className={`inline-flex flex-col gap-1 rounded-lg border px-3 py-2 ${status.className}`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-2 w-2 rounded-full ${status.dotClassName}`}
                                />

                                <span className="text-xs font-bold uppercase">
                                  {status.label}
                                </span>
                              </div>

                              <span className="pl-4 text-[10px]">
                                {status.description}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Status tidak dikenal
                            </span>
                          )}
                        </td>

                        {/* RIWAYAT */}
                        <td>
                          <div className="min-w-[190px]">
                            {item.status === "ACTIVE" ? (
                              <>
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="text-xs font-semibold text-gray-700">
                                    Terdaftar
                                  </span>

                                  <span className="text-xs text-gray-500">
                                    {formatRelativeTime(item.createdAt)}
                                  </span>
                                </div>

                                <div className="mt-2 flex items-center gap-1">
                                  <Personalcard size={14} color="#6B7280" />

                                  <p className="text-xs text-gray-500">
                                    {item.createdBy?.fullName ??
                                      "Pengguna tidak diketahui"}
                                  </p>
                                </div>
                              </>
                            ) : item.status === "UNASSIGNED" ? (
                              <>
                                <p className="text-xs font-medium text-gray-500">
                                  Belum ada riwayat patroli
                                </p>

                                <div className="mt-2 flex items-center gap-1">
                                  <CardAdd size={14} color="#9CA3AF" />

                                  <p className="text-xs text-gray-500">
                                    Didaftarkan:{" "}
                                    {formatDateTimeWITA(item.createdAt)}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-xs font-semibold text-gray-600">
                                  {item.status === "DAMAGED"
                                    ? "Status: Rusak"
                                    : "Status: Hilang"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  Terakhir diperbarui:
                                </p>

                                <p className="mt-1 text-xs font-medium text-gray-600">
                                  {formatDateTimeWITA(
                                    item.updatedAt ?? item.createdAt,
                                  )}
                                </p>
                              </>
                            )}
                          </div>
                        </td>

                        {/* AKSI */}
                        <td>
                          {item.status === "ACTIVE" ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                title="Edit NFC"
                                className="rounded-lg p-2 transition-colors hover:bg-blue-50"
                              >
                                <Edit size={17} color="#6B7280" />
                              </button>

                              <button
                                type="button"
                                title="Detail NFC"
                                className="rounded-lg p-2 transition-colors hover:bg-blue-50"
                              >
                                <Eye size={17} color="#6B7280" />
                              </button>

                              <button
                                type="button"
                                title="Menu lainnya"
                                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                              >
                                <More size={17} color="#6B7280" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-full">
                              <button
                                type="button"
                                onClick={() => handleOpenModal(item)}
                                disabled={isPending}
                                className="flex items-center bg-[#FED400] rounded-lg px-4 py-1 cursor-pointer hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <CardAdd size={20} color="black" />
                                <p className="ml-2 font-semibold text-sm text-gray-800">
                                  Daftarkan
                                </p>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col gap-2 px-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-gray-500">
                        Menampilkan{" "}
                        <span className="font-semibold text-gray-700">
                          {filteredDataNFC.length}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-gray-700">
                          {dataNFCTags.length}
                        </span>{" "}
                        tag NFC
                      </p>

                      <p className="text-xs text-gray-400">
                        Data inventaris NFC gardu induk
                      </p>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* ================================================= */}
            {/* MODAL AKTIVASI NFC */}
            {/* ================================================= */}
            <dialog id="activate_nfc" className="modal">
              <div className="modal-box w-11/12 max-w-lg overflow-visible rounded-2xl bg-white p-0 shadow-2xl">
                {/* HEADER */}
                <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FED400]">
                      <CardAdd size={22} color="#111827" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        Aktivasi NFC
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Aktivasi dan penetapan NFC ke area patroli
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
                    aria-label="Tutup modal"
                  >
                    <CloseCircle size={21} color="currentColor" />
                  </button>
                </div>

                {/* BODY */}
                <div className="space-y-5 px-5 py-5">
                  {/* UID NFC */}
                  <div>
                    <label
                      htmlFor="nfc-uid"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      UID NFC
                    </label>

                    <input
                      id="nfc-uid"
                      type="text"
                      value={uid}
                      readOnly
                      placeholder="UID NFC"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none"
                    />

                    <p className="mt-1.5 text-xs text-gray-400">
                      UID NFC yang dipilih untuk diaktifkan.
                    </p>
                  </div>

                  {/* CHECKPOINT CONFIGURATION */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                        <LocationDiscover size={19} color="#64748B" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          Hubungkan ke Titik Checkpoint
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                          Centang untuk menghubungkan NFC ke titik patroli yang
                          berstatus nonaktif. Jika tidak dicentang, NFC hanya
                          akan diaktifkan sebagai tag cadangan.
                        </p>
                      </div>

                      <input
                        id="assign-checkpoint"
                        type="checkbox"
                        checked={isAssignCheckpoint}
                        disabled={isPending}
                        onChange={(event) => {
                          const checked = event.target.checked;

                          setIsAssignCheckpoint(checked);

                          if (!checked) {
                            setSelectedCheckpointId(null);
                          }
                        }}
                        className="checkbox checkbox-sm mt-1 shrink-0 rounded border-gray-300 [--chkbg:#FED400] [--chkfg:#111827]"
                      />
                    </div>

                    {/* PILIHAN CHECKPOINT */}
                    {isAssignCheckpoint && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                          Pilih Titik Checkpoint
                        </label>

                        <div className="dropdown dropdown-bottom w-full">
                          <div
                            tabIndex={0}
                            role="button"
                            aria-disabled={isPending}
                            className={`flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition ${
                              isPending
                                ? "cursor-not-allowed opacity-60"
                                : "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-100"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <LocationDiscover
                                size={18}
                                color="#64748B"
                                className="shrink-0"
                              />

                              <span
                                className={`truncate text-sm ${
                                  selectedCheckpointId
                                    ? "font-semibold text-gray-800"
                                    : "text-gray-400"
                                }`}
                              >
                                {nonActiveArea.find(
                                  (area) => area.id === selectedCheckpointId,
                                )?.name ?? "Pilih checkpoint patroli"}
                              </span>
                            </div>

                            <ArrowDown2
                              size={18}
                              color="#64748B"
                              className="shrink-0"
                            />
                          </div>

                          <ul
                            tabIndex={0}
                            className="dropdown-content menu z-[60] mt-2 max-h-52 w-full flex-nowrap overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
                          >
                            {nonActiveArea.length > 0 ? (
                              nonActiveArea.map((area) => (
                                <li key={area.id}>
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={(event) => {
                                      setSelectedCheckpointId(area.id);

                                      (
                                        event.currentTarget
                                          .closest(".dropdown")
                                          ?.querySelector(
                                            '[role="button"]',
                                          ) as HTMLElement | null
                                      )?.blur();
                                    }}
                                    className={`rounded-lg px-3 py-2.5 text-left text-sm transition ${
                                      selectedCheckpointId === area.id
                                        ? "bg-yellow-50 font-semibold text-gray-900"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <LocationDiscover
                                        size={16}
                                        color={
                                          selectedCheckpointId === area.id
                                            ? "#B38F00"
                                            : "#94A3B8"
                                        }
                                      />

                                      <span className="truncate">
                                        {area.name}
                                      </span>
                                    </div>
                                  </button>
                                </li>
                              ))
                            ) : (
                              <li>
                                <span className="px-3 py-3 text-xs text-gray-400">
                                  Tidak ada checkpoint berstatus nonaktif.
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>

                        {!selectedCheckpointId && (
                          <p className="mt-2 text-xs text-amber-600">
                            Silakan pilih titik checkpoint untuk menghubungkan
                            NFC.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* INFORMASI STATUS */}
                  <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2.5">
                    <Radar
                      size={17}
                      color="#2563EB"
                      className="mt-0.5 shrink-0"
                    />

                    <p className="text-xs leading-relaxed text-blue-700">
                      {isActivating
                        ? "Sedang mengaktifkan NFC..."
                        : isAssigning
                          ? "NFC aktif. Sedang menghubungkan ke titik checkpoint..."
                          : isAssignCheckpoint
                            ? "NFC akan diaktifkan terlebih dahulu, kemudian dihubungkan ke titik checkpoint yang dipilih."
                            : "NFC akan diaktifkan tanpa penetapan checkpoint dan dapat disiapkan sebagai tag cadangan."}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isPending}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    disabled={
                      isPending ||
                      !selectedId ||
                      (isAssignCheckpoint && !selectedCheckpointId)
                    }
                    onClick={handleAssignNfc}
                    className="flex items-center gap-2 rounded-xl bg-[#FED400] px-4 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <CardAdd size={17} color="#111827" />
                    )}

                    {isActivating
                      ? "Mengaktifkan NFC..."
                      : isAssigning
                        ? "Menghubungkan NFC..."
                        : "Aktivasi NFC"}
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfcManage;

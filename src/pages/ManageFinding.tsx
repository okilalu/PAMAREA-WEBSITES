import { ExportCurve } from "iconsax-react";
import React, { useMemo, useState } from "react";
import { useFindings } from "../hooks/finding/useFIndings";
import HazardShiftChart from "../components/hazard/HazardShiftChart";
import { formatDateTimeWITA } from "../helpers/dateTime";
import { exportFindingExcel } from "../utils/exportFindingExcel";

const ManageFinding = () => {
  const [search, setSearch] = useState({
    title: "",
    reportBy: "",
    patrolPoint: "",
  });

  const { data: findings, isLoading } = useFindings();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const dataFinding = findings?.data ?? [];

  console.log("FINDING", JSON.stringify(dataFinding, null, 2));

  const filteredData = useMemo(() => {
    const titleSearch = search.title.trim().toLowerCase();
    const reportBySearch = search.reportBy.trim().toLowerCase();
    const patrolPointSearch = search.patrolPoint.trim().toLowerCase();

    return dataFinding.filter((f) => {
      const normalizedTitle = f.title?.toLowerCase() ?? "";
      const normalizedReportBy = f.reportedBy?.fullName?.toLowerCase() ?? "";
      const normalizedPatrolPoint = f.patrolPoint?.name?.toLowerCase() ?? "";

      const titleMatch = normalizedTitle.includes(titleSearch);
      const reportByMatch = normalizedReportBy.includes(reportBySearch);
      const patrolPointMatch =
        normalizedPatrolPoint.includes(patrolPointSearch);

      return titleMatch && reportByMatch && patrolPointMatch;
    });
  }, [dataFinding, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedHazard = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const API_URL =
    import.meta.env.VITE_API_URL || "https://api.pamarea.com/api/v1";

  const API_ORIGIN = new URL(API_URL).origin;

  const getPhotoUrl = (fileUrl?: string | null): string => {
    if (!fileUrl) return "";

    // Jika URL sudah absolut, gunakan langsung.
    if (/^https?:\/\//i.test(fileUrl)) {
      return fileUrl;
    }

    // Jika URL relatif, arahkan ke origin backend.
    return new URL(
      fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`,
      API_ORIGIN,
    ).toString();
  };

  // Nomor data yang sedang ditampilkan
  const startItem = filteredData.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(startIndex + itemsPerPage, filteredData.length);

  // React.useEffect(() => {
  //   setCurrentPage(1);
  // }, [search]);

  const shiftChartData = useMemo(() => {
    const counts = new Map<string, number>();

    dataFinding.forEach((finding) => {
      const checkpointName =
        finding.patrolPoint?.name?.trim() || "Checkpoint Tidak Diketahui";

      counts.set(checkpointName, (counts.get(checkpointName) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([name, total]) => ({
        name,
        total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [dataFinding]);

  const handleExportExcel = async () => {
    try {
      if (filteredData.length === 0) {
        console.warn("Tidak ada data temuan untuk diekspor.");
        return;
      }

      await exportFindingExcel(filteredData);
    } catch (error) {
      console.error("Gagal export laporan temuan:", error);
    }
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
        <div className="my-5 grid grid-cols-2">
          <div className="">
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">Manajemen Temuan</h1>
            </div>
            <p className="text-gray-500 text-sm">
              Konsol pemantauan insiden fisik dan K3 real-time seluruh Arrea PLN
              Sambelia. Menghubungkan pelaporan patroli satuan pengamanan
              lapangan dengan tim investigasi teknis.
            </p>
          </div>
          <div className="flex items-center justify-end ">
            <button
              onClick={handleExportExcel}
              disabled={filteredData.length === 0}
              className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              <ExportCurve size={20} color="black" />
              <p className="ml-2 font-semibold text-sm">Export Laporan</p>
            </button>
          </div>
        </div>

        {/* GRAFIK CARD */}
        <HazardShiftChart
          data={shiftChartData}
          totalReports={shiftChartData.reduce(
            (total, item) => total + item.total,
            0,
          )}
          isLoading={isLoading}
        />
        {/* GRAFIK CARD */}

        {/* TABEL LAPORAN HAZARD */}
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Laporan Temuan Hazard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Daftar laporan temuan hazard berdasarkan hasil patroli satpam.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg bg-blue-50 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#003B73]" />
              <span className="text-sm font-semibold text-[#003B73]">
                {dataFinding.length} Laporan
              </span>
            </div>
          </div>

          {/* TABEL */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">No.</th>
                  <th className="px-5 py-4">Temuan Hazard</th>
                  <th className="px-5 py-4">Pelapor</th>
                  <th className="px-5 py-4">Area Patrol</th>
                  <th className="px-5 py-4">Waktu Laporan</th>
                  <th className="px-5 py-4">Foto Temuan</th>
                </tr>

                <tr className="bg-gray-50">
                  <th className="px-5 py-3">
                    <span className="text-xs font-medium text-gray-400">
                      Filter
                    </span>
                  </th>
                  <th className="px-3 py-3">
                    <input
                      type="text"
                      placeholder="Cari judul temuan..."
                      value={search.title}
                      onChange={(event) =>
                        setSearch((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                      aria-label="Filter judul temuan"
                      className="h-9 w-full min-w-[170px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-normal text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-[#003B73] focus:bg-white focus:ring-2 focus:ring-[#003B73]/10"
                    />
                  </th>

                  <th className="px-3 py-3">
                    <input
                      type="text"
                      placeholder="Nama atau Satpam ID..."
                      value={search.reportBy}
                      onChange={(event) =>
                        setSearch((prev) => ({
                          ...prev,
                          reportBy: event.target.value,
                        }))
                      }
                      aria-label="Filter nama atau Satpam ID pelapor"
                      className="h-9 w-full min-w-[170px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-normal text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-[#003B73] focus:bg-white focus:ring-2 focus:ring-[#003B73]/10"
                    />
                  </th>

                  <th className="px-3 py-3">
                    <input
                      type="text"
                      placeholder="Cari area patroli..."
                      value={search.patrolPoint}
                      onChange={(event) =>
                        setSearch((prev) => ({
                          ...prev,
                          patrolPoint: event.target.value,
                        }))
                      }
                      aria-label="Filter area patroli"
                      className="h-9 w-full min-w-[160px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-normal text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-[#003B73] focus:bg-white focus:ring-2 focus:ring-[#003B73]/10"
                    />
                  </th>

                  <th className="px-5 py-3">
                    <span className="text-xs text-gray-400">Semua tanggal</span>
                  </th>

                  <th className="px-5 py-3">
                    <span className="text-xs text-gray-400">Semua foto</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedHazard.map((item, index) => {
                  const photos = item.photos ?? [];

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50/80"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-600">
                          {startIndex + index + 1}
                        </span>
                      </td>

                      <td className="max-w-[250px] px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-gray-500">
                          {item.description}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="">
                            <p className="text-sm font-semibold text-gray-800">
                              {item.reportedBy?.fullName}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {item.reportedBy?.employeeNumber}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#003B73]">
                          {item.patrolPoint?.name}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="text-sm font-semibold text-gray-700">
                          {formatDateTimeWITA(item.createdAt)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-medium text-gray-500">
                            {photos.length} foto temuan
                          </span>

                          <div className="flex items-center gap-2">
                            {photos.slice(0, 3).map((photo, photoIndex) => (
                              <button
                                key={photoIndex}
                                type="button"
                                onClick={() =>
                                  setSelectedPhoto(getPhotoUrl(photo.fileUrl))
                                }
                                aria-label={`Lihat foto ${photoIndex + 1} dari ${item.title}`}
                                className="group relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003B73] focus:ring-offset-2"
                              >
                                <img
                                  src={getPhotoUrl(photo.fileUrl)}
                                  alt={`Foto ${item.title} ${photoIndex + 1}`}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                              </button>
                            ))}

                            {photos.length > 3 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPhoto(photos[3].fileUrl)
                                }
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200"
                                aria-label={`Lihat foto lainnya dari ${item.title}`}
                              >
                                +{photos.length - 3}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* DATA KOSONG */}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <span className="text-xl text-gray-400">!</span>
                        </div>

                        <p className="font-semibold text-gray-700">
                          Belum Ada Laporan Hazard
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Laporan temuan hazard akan ditampilkan di sini.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER TABEL + PAGINATION */}
          {filteredData.length > 0 && totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              {/* INFORMASI JUMLAH DATA */}
              <div>
                <p className="text-xs text-gray-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-800">
                    {startItem}-{endItem}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredData.length}
                  </span>{" "}
                  laporan hazard
                </p>

                <p className="mt-1 text-xs font-medium text-gray-400">
                  Data Laporan Patroli
                </p>
              </div>

              {/* NAVIGASI PAGINATION */}
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                {/* SEBELUMNYA */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={safeCurrentPage === 1}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sebelumnya
                </button>

                {/* NOMOR HALAMAN */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    const isActive = safeCurrentPage === pageNumber;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setCurrentPage(pageNumber)}
                        aria-label={`Halaman ${pageNumber}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-[#003B73] text-white shadow-sm"
                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* SELANJUTNYA */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={safeCurrentPage >= totalPages}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300"
                aria-label="Tutup preview foto"
              >
                &times;
              </button>
              <img
                src={selectedPhoto}
                alt="Preview foto kejadian"
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFinding;

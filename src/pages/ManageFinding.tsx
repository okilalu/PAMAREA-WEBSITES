import { SearchNormal } from "iconsax-react";
import React, { useState } from "react";

const ManageFinding = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const cardHazard = [
    {
      alert: "Critical",
      time: "14.12 WIB",
      title: "Kawat Duri Pagar Pembatas Sektor Barat Terputus",
      note: "Potensi akses masuk liar di dekat tiang transmisi no. 4. Telah dipasang pita pengaman sementara.",
      reportBy: {
        guard: "Dimas",
        id: "SEC-001",
        shift: "Shift 1",
      },

      patrolPoint: {
        location: "Pagar Luar Barat (Zona 1)",
      },

      photo: [
        "https://images.unsplash.com/photo-1564363748063-d52dc96f039a?w=600&auto=format&fit=crop&q=60",
        "https://plus.unsplash.com/premium_photo-1674331357798-eeb34144adce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      ],
    },
    {
      alert: "High",
      time: "13.47 WIB",
      title: "Lampu Penerangan Area Parkir Tidak Berfungsi",
      note: "Area parkir sisi timur dalam kondisi minim penerangan. Perlu dilakukan pemeriksaan dan penggantian lampu.",
      reportBy: {
        guard: "Rizky",
        id: "SEC-002",
        shift: "Shift 1",
      },

      patrolPoint: {
        location: "Area Parkir Kendaraan",
      },

      photo:
        "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=60",
    },
    {
      alert: "Medium",
      time: "12.35 WIB",
      title: "Genangan Air Ditemukan di Jalur Akses Panel",
      note: "Terdapat genangan air di sekitar jalur akses panel. Area telah diberi tanda peringatan untuk mencegah risiko terpeleset.",
      reportBy: {
        guard: "Andi",
        id: "SEC-003",
        shift: "Shift 1",
      },

      patrolPoint: {
        location: "Ruang Panel Utama",
      },

      photo:
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=60",
    },
    {
      alert: "High",
      time: "11.58 WIB",
      title: "Pintu Gudang Material Tidak Terkunci Sempurna",
      note: "Pintu gudang ditemukan tidak tertutup rapat. Telah dilakukan penguncian sementara dan dilaporkan kepada petugas terkait.",
      reportBy: {
        guard: "Fajar",
        id: "SEC-004",
        shift: "Shift 2",
      },

      patrolPoint: {
        location: "Gudang Material Utama",
      },

      photo:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
    },
    {
      alert: "Low",
      time: "10.26 WIB",
      title: "Tumpukan Material Menghalangi Sebagian Jalur Inspeksi",
      note: "Beberapa material berada terlalu dekat dengan jalur inspeksi. Diperlukan penataan ulang agar akses petugas tetap aman.",
      reportBy: {
        guard: "Bima",
        id: "SEC-005",
        shift: "Shift 2",
      },

      patrolPoint: {
        location: "Area Trafo Daya 1",
      },

      photo:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60",
    },
    {
      alert: "Critical",
      time: "09.41 WIB",
      title: "Pagar Pembatas Area Trafo Mengalami Kerusakan",
      note: "Ditemukan bagian pagar pembatas yang bengkok dan berpotensi mengurangi keamanan area. Perlu segera dilakukan perbaikan.",
      reportBy: {
        guard: "Hendra",
        id: "SEC-006",
        shift: "Shift 3",
      },

      patrolPoint: {
        location: "Area Trafo Daya 2",
      },

      photo:
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=60",
    },
  ];

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
        <div className="my-5">
          <div>
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
        </div>

        <div className="bg-white rounded-lg p-3">
          <label className="input bg-gray-100 w-[60%]">
            <SearchNormal size={20} color="gray" />
            <input
              type="search"
              required
              placeholder="Search Satpam ID, Name, Or Station"
              className="text-gray-700 text-sm bg-gray-100"
              //   value={search}
              //   onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-5 mt-5">
          {cardHazard.map((item) => (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="">
                <p className="text-gray-800 font-bold text-xl mb-1">
                  {item.title}
                </p>
                <p className="text-gray-600 text-sm tracking-wide mb-1">
                  {item.note}
                </p>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center justify-between w-[50%]">
                  <div className="flex items-center">
                    <div className="bg-[#003B73] rounded-xl p-1.5 w-10 h-10">
                      <p className="text-white font-bold px-1">AP</p>
                    </div>

                    <div className="ml-3">
                      <p className=" text-sm font-semibold">
                        {item.reportBy.guard}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.reportBy.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="ml-3">
                    <p className="text-gray-900 text-sm">
                      {item.reportBy.shift}
                    </p>
                  </div>
                  <div className="h-[1px] bg-[#003B73] py-3 px-0.5" />
                  <div className="items-start justify-start">
                    <p className="font-bold">Report At</p>
                    <p className="text-gray-500 font-semibold text-sm">
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Foto Temuan
                  </p>
                  <span className="text-xs text-gray-500">
                    {item.photo.length} foto
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {(Array.isArray(item.photo) ? item.photo : [item.photo]).map(
                    (photo, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedPhoto(photo)}
                        className="relative group overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003B73]"
                      >
                        <img
                          src={photo}
                          alt={`Foto ${item.title} ${index + 1}`}
                          className="w-48 h-28 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg" />
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          ))}
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

import {
  AddCircle,
  ArrowDown2,
  Edit,
  HashtagDown,
  Location,
  LocationDiscover,
  SecurityUser,
  Sun,
  TaskSquare,
  Trash,
  UserAdd,
} from "iconsax-react";
import React, { useMemo, useState } from "react";

const QuestionBuilder = () => {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState("");
  const questionBuilder = [
    {
      id: 1,
      ids: "Q-Sec-001",
      question:
        "Apakah kondisi pagar di area checkpoint dalam kondisi baik dan tidak mengalami kerusakan?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Keamanan Area",
      status: "Aktif",
      checkpoint: "Gedung Kontrol",
    },
    {
      id: 2,
      ids: "Q-Sec-001",
      question:
        "Apakah pintu atau akses masuk checkpoint dalam kondisi tertutup dan terkunci dengan baik?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Akses",
      status: "Aktif",
      checkpoint: "Gedung Kontrol 2",
    },
    {
      id: 3,
      ids: "Q-Sec-001",
      question:
        "Apakah area sekitar checkpoint bebas dari benda mencurigakan atau barang yang tidak seharusnya berada di lokasi?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Keamanan Area",
      status: "Aktif",
      checkpoint: "Gedung Kontrol",
    },
    {
      id: 4,
      ids: "Q-Sec-001",
      question:
        "Apakah lampu penerangan di sekitar checkpoint berfungsi dengan baik?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Fasilitas",
      status: "Aktif",
      checkpoint: "Gedung Kontrol 2",
    },
    {
      id: 5,
      ids: "Q-Sec-001",
      question:
        "Apakah CCTV di sekitar checkpoint terlihat aktif dan tidak mengalami gangguan?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Monitoring",
      status: "Aktif",
      checkpoint: "Gedung Kontrol 2",
    },
    {
      id: 6,
      ids: "Q-Sec-001",
      question:
        "Apakah kondisi peralatan keselamatan di sekitar checkpoint dalam keadaan lengkap dan mudah diakses?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Keselamatan",
      status: "Aktif",
      checkpoint: "Gedung Kontrol 2",
    },
    {
      id: 7,
      ids: "Q-Sec-001",
      question:
        "Apakah tidak terdapat genangan air atau kondisi lingkungan yang berpotensi membahayakan di sekitar checkpoint?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Lingkungan",
      status: "Aktif",
      checkpoint: "Gedung Kontrol",
    },
    {
      id: 8,
      ids: "Q-Sec-001",
      question:
        "Apakah area checkpoint dalam kondisi bersih dan bebas dari sampah atau material yang mengganggu?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Kebersihan",
      status: "Aktif",
      checkpoint: "Gedung Kontrol 2",
    },
    {
      id: 9,
      ids: "Q-Sec-001",
      question:
        "Apakah terdapat aktivitas atau orang yang mencurigakan di sekitar checkpoint?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Keamanan",
      status: "Aktif",
      checkpoint: "Gedung Kontrol",
    },
    {
      id: 10,
      ids: "Q-Sec-001",
      question:
        "Apakah seluruh kondisi checkpoint secara keseluruhan dalam keadaan aman dan normal?",
      type: "YES_NO",
      required: true,
      requireReasonIfNo: true,
      category: "Kondisi Umum",
      status: "Aktif",
      checkpoint: "Gedung Kontrol 2",
    },
  ];

  const filterQuestion = useMemo(() => {
    return questionBuilder.filter((q) => {
      return selectedCheckpoint === q.checkpoint;
    });
  }, [questionBuilder, selectedCheckpoint]);

  const checkpointList = useMemo(() => {
    return [...new Set(questionBuilder.map((q) => q.checkpoint))];
  }, []);

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
        <div className=" mt-5 grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <p className="font-bold text-2xl tracking-wide">
                Checkpoint Inspection & K3 Question Builder
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Susun urutan pertanyaan inspeksi keselamatan kerja (K3) dan
              verifikasi fisik keamanan per titik checkpoint patroli gardu induk
              secara adaptif.
            </p>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => console.log("Click")}
              className="bg-[#FED400] shadow-sm rounded-lg p-3 cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <div className="bg-[#FED400] p-1 rounded-lg">
                  <UserAdd size={17} color="#6F5C00" />
                </div>
                <div className="ml-1">
                  <p className="text-gray-900 text-sm font-semibold">
                    Tambah Pertanyaan Baru
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-lg flex items-center justify-between px-3 py-2">
            <div className="flex items-center ">
              <Location size={17} color="gray" />
              <div className="ml-2">
                <p className="text-gray-500 text-xs">
                  Titik Checkpoint Terpilih :
                </p>
                <p className="font-semibold text-gray-500 text-xs">
                  {selectedCheckpoint || "Tidak ada checkpoint terpilih"}
                </p>
              </div>
            </div>

            <div className="bg-[#D5E3FF] rounded-lg px-3 py-1 ml-4">
              <p className="font-semibold text-xs text-[#001B3B]">
                {filterQuestion.length} Pertanyaan Aktif
              </p>
            </div>
          </div>

          <div className="flex bg-gray-100 rounded-lg px-3 py-2 gap-4">
            <div className="dropdown dropdown-start w-[50%]">
              <div
                tabIndex={0}
                role="button"
                className="bg-gray-200 rounded-sm px-3 py-2 cursor-pointer"
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
                        {selectedCheckpoint || "Pilih Checkpoint"}
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
                      onClick={() => setSelectedCheckpoint(checkpoint)}
                      className="text-xs text-gray-600 hover:bg-gray-200 rounded-md"
                    >
                      {checkpoint}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button className="bg-gray-200 rounded-sm w-[50%] px-2 py-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SecurityUser size={17} color="gray" />
                  <div>
                    <p className="text-xs text-gray-500 text-start">
                      Pilih Shift:
                    </p>
                    <p className="text-xs text-gray-500 font-semibold">
                      Shift 2 (Siang)
                    </p>
                  </div>
                </div>
                <ArrowDown2 size={17} color="gray" />
              </div>
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
            <TaskSquare size={20} color="black" />
            <div>
              <h1 className="font-bold text-xl">
                Urutan Pertanyaan Terdaftar ({filterQuestion.length})
              </h1>
            </div>
          </div>

          <div className=" mt-3">
            {filterQuestion.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4 bg-white rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2 ">
                  <div className="bg-[#00529C] px-3 py-1 rounded-lg">
                    <p className="text-white text-md">
                      {item.id.toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-[#E5EBF1] flex items-center gap-1 rounded-full px-2 py-0.5">
                        <HashtagDown size={12} color="#0D457A" />
                        <p className="text-xs text-[#0D457A] font-semibold">
                          {item.type}
                        </p>
                      </div>
                      <div className="bg-[#FEF2B2] flex items-center  gap-1 rounded-full px-2 py-0.5">
                        <Sun size={12} color="#7B680F" />
                        <p className="text-xs text-[#7B680F] font-semibold">
                          {item.status}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold">{item.question}</p>
                    <div className="flex items-center  gap-2">
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500">ID :</p>
                        <p className="text-xs text-gray-500 font-semibold ml-1">
                          {item.ids}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500">Kategori :</p>
                        <p className="text-xs text-gray-500 font-semibold ml-1">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1">
                    <Edit size={17} color="gray" />
                    <p className="text-xs text-gray-500 tracking-wide">Edit</p>
                  </button>
                  <button className="flex items-center gap-1">
                    <Trash size={17} color="gray" />
                    <p className="text-xs text-gray-500 tracking-wide">Hapus</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="bg-gray-200 rounded-lg py-3 w-full">
          <div className="flex items-center justify-center gap-2 flex-1">
            <AddCircle size={17} color="gray" />
            <p className="text-gray-500 font-semibold text-sm capitalize">
              Sisipkan pertanyaan baru pada checkpoint ini
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuestionBuilder;

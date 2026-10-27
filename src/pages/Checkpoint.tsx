import {
  Box,
  Card,
  CloseCircle,
  LinkSquare,
  Location,
  LocationAdd,
  Pointer,
  SearchNormal,
  TickCircle,
  UserAdd,
  Warning2,
} from "iconsax-react";
import React, { useMemo, useState } from "react";
import {
  useCreatePatrolPoint,
  usePatrolPoints,
} from "../hooks/patrol-point/usePatrolPoints";
import { useAuthContext } from "../hooks/auth/useAuthContext";

const Checkpoint = () => {
  const { user } = useAuthContext();
  const siteId = user?.siteId;
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  // const [selectedNfc, setSelectedNfc] = useState("Semua");
  const { mutateAsync: createCheckpoint, isPending: isRegitering } =
    useCreatePatrolPoint();

  const { data: listCheckpoints, isPending, isError } = usePatrolPoints();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [radiusMeters, setRadiusMeters] = useState<number>(0);

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // console.log("DATA", JSON.stringify(listCheckpoints, null, 2));

  const filterStatus = [
    {
      name: "Semua",
    },
    {
      name: "Aktif",
    },
    {
      name: "Nonaktif",
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return listCheckpoints?.filter((item) => {
      // 1. Filter pencarian
      const matchesSearch =
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        item.site.name.toLowerCase().includes(keyword);

      // 2. Filter berdasarkan kategori
      // eslint-disable-next-line no-useless-assignment
      let matchesStatus = true;

      switch (selectedStatus) {
        case "Aktif":
          matchesStatus = item.status === "ACTIVE";
          break;

        case "Nonaktif":
          matchesStatus = item.status === "INACTIVE";
          break;

        // case "Tanpa Tag":
        //   matchesStatus = item.nfcStatus === null;
        //   break;

        case "Semua":
        default:
          matchesStatus = true;
          break;
      }

      // 3. Data ditampilkan jika kedua kondisi terpenuhi
      return matchesSearch && matchesStatus;
    });
  }, [listCheckpoints, search, selectedStatus]);

  const cardSummary = [
    {
      icon: <Location size={17} color="black" />,
      value: listCheckpoints?.length,
      title: "Area Register",
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      icon: <LinkSquare size={17} color="black" />,
      value: listCheckpoints?.filter((item) =>
        item.nfcAssignments.map((i) => i.status === "ACTIVE"),
      ).length,
      title: "NFC Active",
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      icon: <Warning2 size={17} color="#93000A" />,
      value: listCheckpoints?.filter((item) => item.status === "INACTIVE")
        .length,
      title: "NFC Non Active",
      bgColor: "bg-[#FFDAD6]",
      textColor: "text-[#93000A]",
    },
  ];

  const handleOpenModal = () => {
    const modal = document.getElementById(
      "add_checkpoint",
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "add_checkpoint",
    ) as HTMLDialogElement;
    modal.close();
  };

  const resetRegisterForm = () => {
    setCode("");
    setName("");
    setDescription("");
    setLatitude(0);
    setLongitude(0);
    setRegisterError("");
  };

  const handleRegisterCheckpoint = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    if (
      !code ||
      !name ||
      !description ||
      !latitude ||
      !longitude ||
      !radiusMeters
    ) {
      setRegisterError("Lengkapi semua field yang wajib diisi.");
      return;
    }

    if (!Number.isFinite(radiusMeters) || radiusMeters <= 0) {
      return;
    }

    if (!siteId) {
      setRegisterError("Site admin yang sedang login tidak ditemukan.");
      return;
    }

    const payload = {
      code: code,
      name: name,
      description,
      latitude,
      longitude,
      radiusMeters,
      siteId,
    };

    console.log("PAYLOAD", JSON.stringify(payload, null, 2));

    try {
      await createCheckpoint(payload);

      setRegisterSuccess("Patrol point  berhasil didaftarkan.");
      resetRegisterForm();
      handleCloseModal();
    } catch (error) {
      console.log(error);
      alert("Error. saat tambah patrol point");
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
        <p className="ml-3 text-sm text-gray-500">Memuat data checkpoint...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <p className="font-semibold text-red-600">
          Gagal memuat data checkpoint.
        </p>

        <p className="text-sm text-gray-500">{""}</p>
      </div>
    );
  }

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
                Setup Area Patrol & Aset NFC
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              pariatur error incidunt dolor impedit cumque.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            {cardSummary.map((item) => (
              <div
                className={`flex items-center gap-1 ${item.bgColor} rounded-lg px-4 py-2`}
              >
                <div className="">{item.icon}</div>
                <p className={`${item.textColor} tracking-wide text-sm`}>
                  {item.value}
                </p>
                <p className={`${item.textColor} tracking-wide text-sm`}>
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 mt-4 rounded-lg">
          <label className="input bg-gray-100 w-full">
            <SearchNormal size={20} color="gray" />
            <input
              type="search"
              placeholder="Cari nama atau kode checkpoint..."
              className="text-gray-700 text-sm bg-gray-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="bg-gray-100 rounded-lg px-4 py-1 grid grid-cols-3 w-[50%] gap-3">
            {filterStatus.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelectedStatus(item.name)}
                className={`flex items-center justify-center gap-1 px-1 py-2 rounded-lg transition-color ${selectedStatus === item.name ? "bg-[#003B73] shadow-sm" : "hover:bg-white/50"}`}
              >
                <p
                  className={`text-xs text-center ${selectedStatus === item.name ? "text-white" : "text-gray-700"}`}
                >
                  {item.name}
                </p>
                {/* <div className="bg-blue-100 rounded-full px-2 py-1">
                  <p className="text-gray-800 text-xs">{item.value}</p>
                </div> */}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-[#FED400] shadow-sm w-[30%] rounded-lg px-3 py-2 cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <div className="bg-[#FED400] p-1 rounded-lg">
                <UserAdd size={17} color="#6F5C00" />
              </div>
              <div className="ml-1">
                <p className="text-gray-900 text-sm font-semibold">
                  Tambah Titik Patroli
                </p>
              </div>
            </div>
          </button>
        </div>
        {/* Input */}

        {registerSuccess && (
          <div className="alert alert-success mt-4 bg-green-50 text-green-800 border border-green-200 p-3 rounded-lg flex justify-between">
            <span className="text-sm font-medium">{registerSuccess}</span>
            <button
              type="button"
              onClick={() => setRegisterSuccess("")}
              className="btn btn-sm btn-ghost hover:bg-green-100"
            >
              <CloseCircle size={18} color="black" />
            </button>
          </div>
        )}

        {/* Data */}
        <div className="grid grid-cols-3 gap-5 mt-5">
          {(filteredData?.length ?? 0 > 0) ? (
            filteredData?.map((item) => {
              return (
                <div
                  key={item.id}
                  className={` ${item.nfcAssignments.find((i) => i.status) ? "" : "border border-[#DEB0B1] p-3"}bg-white shadow-sm rounded-lg px-6 py-4 flex flex-col gap-2 hover:shadow-white/30`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`${item.nfcAssignments.find((i) => i.status) ? "bg-[#E6E8EA]" : "bg-[#FED400]"} rounded-lg px-2 py-1`}
                    >
                      <p className="text-[#16517E]">{item.code}</p>
                    </div>
                    {item.nfcAssignments.find((i) => i.status) ? (
                      <div className="bg-[#ECFDF5] rounded-lg px-2 py-1">
                        <p className="text-[#059669] text-sm">Aktif</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {/* <div className="bg-[#ECFDF5] rounded-lg px-2 py-1">
                          <p className="text-[#059669] text-sm">Tidak Aktif</p>
                        </div> */}
                        <div className="bg-[#FFDFDB] rounded-lg px-2.5 py-1 animate-pulse">
                          <p className="text-[#AA2F36] text-sm font-medium">
                            Action Needed
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <h1 className="text-xl font-semibold mt-3">{item.name}</h1>

                  <div className="flex items-center gap-2">
                    <p className="text-gray-500">{item.description}</p>
                    {/* <div className="p-0.5 rounded-full h-[1px] bg-gray-400 mt-1" /> */}
                    {/* <p className="text-red-600">{item.level}</p> */}
                  </div>

                  <div className="bg-gray-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center gap-2">
                      <Location size={17} color="black" />
                      <p className="text-xs font-semibold text-gray-600 tracking-wider">
                        Geofence GPS
                      </p>
                      <p className="text-xs font-semibold tracking-wider ml-5">
                        {item.radiusMeters} Radius Meter
                      </p>
                    </div>
                  </div>
                  {/* <div className=" min-h-[45px]"> */}
                  {item.nfcAssignments.find((i) => i.status) ? (
                    <div className="grid grid-cols-2 gap-6 items-center mt-5">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold tracking-wide">
                          Terhubung ke NFC :
                        </p>
                      </div>
                      <div className="bg-gray-100 px-4 py-2 flex items-center gap-1 rounded-lg">
                        <TickCircle size={20} color="green" />
                        <p className="font-semibold text-xs tracking-wider">
                          NFC-
                          {item.nfcAssignments.map((i) =>
                            i.nfcTagId.split("", 10),
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-[#FFF0EF] border border-rose-200 rounded-lg p-2 mt-5">
                      <p className="text-[#BC1A1A] text-xs tracking-wide">
                        Status Tag NFC :
                      </p>
                      <div className="flex items-center gap-2 bg-[#B91A1A] rounded-sm p-2">
                        <Warning2 size={17} color="white" />
                        <p className="text-white font-semibold text-xs tracking-wide">
                          Belum ada NFC Tag
                        </p>
                      </div>
                    </div>
                  )}
                  {/* </div> */}

                  <div className="flex items-center justify-evenly gap-2 mt-auto pt-5">
                    <button className="bg-gray-100 rounded-sm py-1 items-center justify-center flex-1 cursor-pointer">
                      <p>Edit Titik</p>
                    </button>
                    {item.status ? (
                      <button className="flex items-center gap-1 justify-center bg-gray-200 rounded-sm py-1 flex-1 cursor-pointer">
                        <Card size={17} color="#003B73" />
                        <p className="text-[#003B73] font-semibold">
                          Assign NFC Tag
                        </p>
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 justify-center bg-[#FED400] rounded-sm py-1 flex-1 cursor-pointer">
                        <Pointer size={17} color="#003B73" />
                        <p className="text-[#003B73] font-semibold">
                          Assign NFC Tag
                        </p>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center bg-white shadow-sm rounded-lg py-16 px-6 border-2 border-dashed border-gray-200">
              <div className="bg-gray-100 p-4 rounded-full mb-4 shadow-sm">
                <Box size={45} color="gray" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
                Maaf, tidak ada data lokasi atau tag NFC yang cocok dengan
                filter pencarian Anda saat ini.
              </p>
            </div>
          )}
        </div>
        {/* Data */}

        {/* MODAL ADD CHECKPOINT */}
        <dialog id="add_checkpoint" className="modal">
          <div
            className="
            modal-box
            max-w-none
            w-[450px]
            h-screen
            max-h-screen
            rounded-none
            absolute
            right-0
            top-0
            m-0
            p-0"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="bg-[#FACC15] p-3 rounded-sm">
                  <LocationAdd size={20} color="black" />
                </div>
                <div className="ml-1">
                  <p className="font-semibold">Register Titik Point</p>
                  <p className="text-xs text-gray-500 tracking-wide font-semibold">
                    Masukkan data lengkap dari checkpoint yang akan ditambahkan
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleRegisterCheckpoint}
              className="p-6 overflow-y-auto h-[calc(100vh-90px)]"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Kode Area
                  </label>

                  <input
                    type="text"
                    name="code"
                    placeholder="Enter kode area"
                    className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nama Area
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter nama area"
                    className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Sub-Area
                  </label>

                  <input
                    type="text"
                    name="description"
                    placeholder="Enter sub-area name"
                    className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Latitude
                  </label>

                  <input
                    type="text"
                    name="latitude"
                    min={1}
                    placeholder="Masukkan latitude"
                    className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Longitude
                  </label>

                  <input
                    type="text"
                    name="longitude"
                    min={1}
                    placeholder="Masukkan longitude"
                    className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Radius Meter
                  </label>

                  <input
                    type="number"
                    name="rediusMeters"
                    min={1}
                    placeholder="Masukkan radius meter"
                    className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={radiusMeters}
                    onChange={(e) => setRadiusMeters(Number(e.target.value))}
                    required
                  />
                </div>

                {registerError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    <span>{registerError}</span>
                  </div>
                )}
                <div className="flex items-center justify-evenly gap-4">
                  <button
                    className="bg-gray-100 border border-gray-200 py-3 rounded-sm hover:bg-gray-200 text-sm font-semibold flex-1"
                    disabled={isRegitering}
                    onClick={() => {
                      setRegisterError("");
                      handleCloseModal();
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isRegitering || !siteId}
                    className="bg-[#FACC15] border border-yellow-200 py-3 rounded-sm hover:bg-yellow-500 text-sm font-semibold flex-1 disabled:opacity-50"
                  >
                    {/* {isRegitering ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan"
                    )} */}

                    {isRegitering
                      ? "Mendaftarkan..."
                      : "Daftarkan Titik Patroli"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </dialog>
        {/* MODAL ADD CHECKPOINT */}
      </div>
    </div>
  );
};

export default Checkpoint;

import {
  Card,
  LinkSquare,
  Location,
  Pointer,
  SearchNormal,
  TickCircle,
  UserAdd,
  Warning2,
} from "iconsax-react";
import React from "react";

const Checkpoint = () => {
  const filterStatus = [
    {
      name: "Semua",
      //   value: users.length,
      value: 10,
      role: "",
    },
    {
      name: "Aktif",
      value: 10,
      //   value: users.map((item) => item.role === "Admin").length,
      role: "Admin",
    },
    {
      name: "Nonaktif",
      value: 10,
      //   value: users.map((item) => item.role === "Admin").length,
      role: "Admin",
    },
    {
      name: "Tanpa Tag",
      value: 10,
      //   value: users.map((item) => item.role === "Security").length,
      role: "Security",
    },
  ];

  const cardSummary = [
    {
      icon: <Location size={17} color="black" />,
      value: 10,
      title: "Titik Terdaftar",
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      icon: <LinkSquare size={17} color="black" />,
      value: 9,
      title: "Tag Terhubung",
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      icon: <Warning2 size={17} color="#93000A" />,
      value: 3,
      title: "Butuh Tag",
      bgColor: "bg-[#FFDAD6]",
      textColor: "text-[#93000A]",
    },
  ];

  const dataPatroli = [
    {
      name: "Area Trafo Daya 1",
      area: "Perimeter Timur",
      kodeLoc: "PP-GMB-01",
      level: "Level Resiko : Tinggi",
      radius: "25 Meter Radius",
      nfc: "NFC-77A0-9941",
    },
    {
      name: "Area Trafo Daya 2",
      area: "Perimeter Barat",
      kodeLoc: "PP-GMB-02",
      level: "Level Resiko : Tinggi",
      radius: "30 Meter Radius",
      nfc: "NFC-82B1-4527",
    },
    {
      name: "Gudang Material Utama",
      area: "Zona Utara",
      kodeLoc: "PP-GMB-03",
      level: "Level Resiko : Sedang",
      radius: "20 Meter Radius",
      nfc: null,
    },
    {
      name: "Ruang Panel Utama",
      area: "Zona Tengah",
      kodeLoc: "PP-GMB-04",
      level: "Level Resiko : Tinggi",
      radius: "15 Meter Radius",
      nfc: "NFC-91D3-2268",
    },
    {
      name: "Gerbang Utama",
      area: "Perimeter Selatan",
      kodeLoc: "PP-GMB-05",
      level: "Level Resiko : Rendah",
      radius: "35 Meter Radius",
      nfc: null,
    },
    {
      name: "Area Parkir Kendaraan",
      area: "Zona Timur",
      kodeLoc: "PP-GMB-06",
      level: "Level Resiko : Sedang",
      radius: "40 Meter Radius",
      nfc: null,
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
        <div className="mt-5 grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">
                Manajemen Checkpoint & Aset NFC
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
              required
              placeholder="Cari nama titik, kode PP"
              className="text-gray-700 text-sm bg-gray-100"
              //   value={search}
              //   onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="bg-gray-100 rounded-lg px-4 py-2 grid grid-cols-4 w-[50%] gap-3">
            {filterStatus.map((item) => (
              <button
                key={item.name}
                type="button"
                // onClick={() => setSelectedRole(item.role)}
                // className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-color ${selectedRole === item.role ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
              >
                <p className="text-gray-800 text-xs">{item.name}</p>
                <div className="bg-blue-100 rounded-full px-2 py-1">
                  <p className="text-gray-800 text-xs">{item.value}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => console.log("Click")}
            className="bg-[#FED400] shadow-sm w-[30%] rounded-lg p-3 cursor-pointer"
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

        {/* Data */}
        <div className="grid grid-cols-3 gap-5 mt-5">
          {dataPatroli.map((item) => (
            <div
              className={` ${item.nfc ? "" : "border border-[#DEB0B1] p-3"}bg-white shadow-sm rounded-lg px-6 py-4 flex flex-col gap-2 hover:shadow-white/30`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`${item.nfc ? "bg-[#E6E8EA]" : "bg-[#FED400]"} rounded-lg px-2 py-1`}
                >
                  <p className="text-[#16517E]">{item.kodeLoc}</p>
                </div>
                {item.nfc ? (
                  <div className="bg-[#ECFDF5] rounded-lg px-2 py-1">
                    <p className="text-[#059669] text-sm">Aktif</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="bg-[#ECFDF5] rounded-lg px-2 py-1">
                      <p className="text-[#059669] text-sm">Aktif</p>
                    </div>
                    <div className="bg-[#FFDFDB] rounded-lg px-2 py-1">
                      <p className="text-[#AA2F36] text-sm">Action Needed</p>
                    </div>
                  </div>
                )}
              </div>

              <h1 className="text-xl font-semibold mt-3">{item.name}</h1>

              <div className="flex items-center gap-2">
                <p className="text-gray-500">{item.area}</p>
                <div className="p-0.5 rounded-full h-[1px] bg-gray-400 mt-1" />
                <p className="text-red-600">{item.level}</p>
              </div>

              <div className="bg-gray-200 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2">
                  <Location size={17} color="black" />
                  <p className="text-xs font-semibold text-gray-600 tracking-wider">
                    Geofence GPS
                  </p>
                  <p className="text-xs font-semibold tracking-wider ml-5">
                    {item.radius}
                  </p>
                </div>
              </div>
              {/* <div className=" min-h-[45px]"> */}
              {item.nfc ? (
                <div className="flex items-center justify-between mt-5">
                  <p>Terhubung ke Tag :</p>
                  <div className="bg-gray-200 px-2 py-1 flex items-center gap-1 rounded-lg">
                    <TickCircle size={17} color="green" variant="Bulk" />
                    <p className="font-semibold text-xs tracking-wider">
                      {item.nfc}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-[#FFF0EF] rounded-sm p-2 mt-5">
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
                {item.nfc ? (
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
          ))}
        </div>
        {/* Data */}
      </div>
    </div>
  );
};

export default Checkpoint;

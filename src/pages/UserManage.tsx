import { ArrowDown2, Personalcard, SearchNormal, UserAdd } from "iconsax-react";
import React from "react";

const UserManage = () => {
  const userTable = [
    {
      nama: "Dimas",
      Nip: "520210210210120",
      section: "SEC-001",
      unit: "Zona 1",
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
    {
      nama: "Dimas",
      Nip: "520210210210120",
      section: "SEC-001",
      unit: "Zona 1",
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
    {
      nama: "Dimas",
      Nip: "520210210210120",
      section: "SEC-001",
      unit: "Zona 1",
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
    {
      nama: "Dimas",
      Nip: "520210210210120",
      section: "SEC-001",
      unit: "Zona 1",
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
    {
      nama: "Dimas",
      Nip: "520210210210120",
      section: "SEC-001",
      unit: "Zona 1",
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
  ];

  const filterRole = [
    {
      name: "Semua Role",
      value: "5",
    },
    {
      name: "Admin SOC",
      value: "5",
    },
    {
      name: "Security / Satpam",
      value: "5",
    },
  ];

  // const filterUnit = [
  //   {
  //     name: "Zona 1",
  //   },
  //   {
  //     name: "Zona 2",
  //   },
  //   {
  //     name: "Zona 3",
  //   },
  // ];

  // const filterStatus = [
  //   {
  //     status: "Aktif",
  //   },
  //   {
  //     status: "Non-Aktif",
  //   },
  // ];
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

      <div className="px-6">
        <div className="my-5 grid grid-cols-2 gap-4">
          <div className="">
            <h1 className="text-[#003B73] font-bold text-2xl">
              Management User & Security Patrol
            </h1>
            <p className="text-gray-600 tracking-wide text-sm">
              Kelola akun personel keamanan gardu induk, hak akses role, serta
              otentikasi perangkat terikat patroli NFC/GPS.
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="bg-white shadow-sm w-[70%] rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="bg-cyan-100 p-1 rounded-lg">
                  <Personalcard size={17} color="blue" />
                </div>
                <div className="ml-2">
                  <p className="text-gray-600 text-sm">Total Personal: 28</p>
                </div>
              </div>
            </div>
            <div className="bg-[#FED400] shadow-sm w-[70%] rounded-lg p-3">
              <div className="flex items-center gap-1">
                <div className="bg-[#FED400] p-1 rounded-lg">
                  <UserAdd size={17} color="#6F5C00" />
                </div>
                <div className="ml-1">
                  <p className="text-gray-900 text-sm font-semibold">
                    Register Satpam Baru
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Input */}
        <div className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 mt-2 rounded-lg">
          <label className="input bg-gray-100 w-[45%]">
            <SearchNormal size={20} color="gray" />
            <input
              type="search"
              required
              placeholder="Search Satpam ID, Name, Or Station"
              className="text-gray-700 text-sm bg-gray-100"
            />
          </label>

          <div className="bg-gray-100 rounded-lg px-2 py-2 flex gap-3">
            {filterRole.map((item) => (
              <div className="flex items-center gap-1">
                <p className="text-gray-800 text-xs">{item.name}</p>
                <div className="bg-blue-100 rounded-full px-2 py-1">
                  <p className="text-gray-800 text-xs">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dropdown dropdown-start bg-gray-100 rounded-lg">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-gray-100 flex items-center"
            >
              <a href="" className="text-xs">
                Semua Unit / GI
              </a>

              <ArrowDown2 size={17} color="gray" />
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-gray-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
          <div className="dropdown dropdown-start bg-gray-100 rounded-lg">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-gray-100 flex items-center"
            >
              <a href="" className="text-xs">
                Status
              </a>

              <ArrowDown2 size={17} color="gray" />
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-gray-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </div>
        {/* Input */}

        {/* Card */}
        {/* <div className="grid grid-cols-4 gap-3 mt-5">
          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
            <div className="gap-3">
              <div>
                <h1 className="text-gray-500 uppercase text-sm">
                  total security officers
                </h1>
                <div className="flex gap-1 mt-2">
                  <p className="text-black font-bold text-xl">154</p>
                  <p className="text-blue-700 text-xs self-end mb-0.5 ml-1">
                    12 Sub-areas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-100 rounded-lg p-2">
              <UserSquare size={20} color="black" />
            </div>
          </div>

          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
            <div className="gap-3">
              <div>
                <h1 className="text-gray-500 uppercase text-sm">
                  total security officers
                </h1>
                <div className="flex gap-1 mt-2">
                  <p className="text-black font-bold text-xl">154</p>
                  <p className="text-blue-700 text-xs self-end mb-0.5 ml-1">
                    12 Sub-areas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-100 rounded-lg p-2">
              <UserSquare size={20} color="black" />
            </div>
          </div>
          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
            <div className="gap-3">
              <div>
                <h1 className="text-gray-500 uppercase text-sm">
                  total security officers
                </h1>
                <div className="flex gap-1 mt-2">
                  <p className="text-black font-bold text-xl">154</p>
                  <p className="text-blue-700 text-xs self-end mb-0.5 ml-1">
                    12 Sub-areas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-100 rounded-lg p-2">
              <UserSquare size={20} color="black" />
            </div>
          </div>
          <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
            <div className="gap-3">
              <div>
                <h1 className="text-gray-500 uppercase text-sm">
                  total security officers
                </h1>
                <div className="flex gap-1 mt-2">
                  <p className="text-black font-bold text-xl">154</p>
                  <p className="text-blue-700 text-xs self-end mb-0.5 ml-1">
                    12 Sub-areas
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-100 rounded-lg p-2">
              <UserSquare size={20} color="black" />
            </div>
          </div>
        </div> */}
        {/* Card */}

        {/* Table */}
        <div className="mt-5 rounded-lg bg-white p-4 shadow-sm">
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Personel Keamanan
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Lihat Penugasan
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Role Akses
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Device
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Status Akun
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {userTable.map((item) => (
                    <tr className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {item.nama}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.section}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">
                          {item.unit}
                        </div>
                        <div className="text-xs text-gray-500">Main Gate</div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          {item.role}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          {item.device}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default UserManage;

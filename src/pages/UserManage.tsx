import {
  ArrowDown2,
  CloseCircle,
  People,
  SearchNormal,
  SearchStatus,
  UserAdd,
} from "iconsax-react";
import React, { useMemo, useState } from "react";

const UserManage = () => {
  const listUnit = [
    "Area Trafo Daya 1",
    "Area Trafo Daya 2",
    "Gudang Material Utama",
    "Ruang Panel Utama",
    "Gerbang Utama",
    "Area Parkir Kendaraan",
  ];

  const listStatus = ["Aktif", "Nonaktif"];
  const userTable = [
    {
      nama: "Dimas",
      Nip: "520210210210120",
      section: "SEC-001",
      unit: "Area Trafo Daya 1",
      role: "Admin",
      device: "Samsung",
      status: "Aktif",
    },
    {
      nama: "Andi",
      Nip: "520210210210121",
      section: "SEC-002",
      unit: null,
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
    {
      nama: "Rizky",
      Nip: "520210210210122",
      section: "SEC-003",
      unit: "Area Trafo Daya 2",
      role: "Security",
      device: "Xiaomi",
      status: "Aktif",
    },
    {
      nama: "Fajar",
      Nip: "520210210210123",
      section: "SEC-004",
      unit: "Ruang Panel Utama",
      role: "Security",
      device: "Oppo",
      status: "Nonaktif",
    },
    {
      nama: "Bayu",
      Nip: "520210210210124",
      section: "SEC-005",
      unit: "Gudang Material Utama",
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
    {
      nama: "Ardi",
      Nip: "520210210210125",
      section: "SEC-006",
      unit: "Gerbang Utama",
      role: "Security",
      device: "Vivo",
      status: "Aktif",
    },
    {
      nama: "Rian",
      Nip: "520210210210126",
      section: "SEC-007",
      unit: null,
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
    {
      nama: "Ilham",
      Nip: "520210210210127",
      section: "SEC-008",
      unit: "Area Parkir Kendaraan",
      role: "Security",
      device: "Xiaomi",
      status: "Aktif",
    },
    {
      nama: "Agus",
      Nip: "520210210210128",
      section: "SEC-009",
      unit: null,
      role: "Security",
      device: "Oppo",
      status: "Aktif",
    },
    {
      nama: "Rendi",
      Nip: "520210210210129",
      section: "SEC-010",
      unit: "Ruang Panel Utama",
      role: "Security",
      device: "Samsung",
      status: "Aktif",
    },
  ];

  const [users, setUsers] = useState(userTable);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredUser = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return users.filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(keyword) ||
        item.Nip.toLowerCase().includes(keyword) ||
        item.section.toLowerCase().includes(keyword) ||
        item.unit?.toLowerCase().includes(keyword) ||
        item.device.toLowerCase().includes(keyword);

      const matchesRole = selectedRole === "" || item.role === selectedRole;

      const matchUnit = selectedUnit === "" || item.unit === selectedUnit;
      const matchStatus =
        selectedStatus === "" || item.status === selectedStatus;

      return matchesSearch && matchesRole && matchUnit && matchStatus;
    });
  }, [users, search, selectedRole, selectedUnit, selectedStatus]);

  const itemPerPage = 6;

  const totalPages = Math.ceil(filteredUser.length / itemPerPage);
  const startIndex = (currentPage - 1) * itemPerPage;

  const currentUsers = filteredUser.slice(startIndex, startIndex + itemPerPage);

  const filterRole = [
    {
      name: "Semua Role",
      value: users.length,
      role: "",
    },
    {
      name: "Admin PAMAREA",
      value: users.map((item) => item.role === "Admin").length,
      role: "Admin",
    },
    {
      name: "Security / Satpam",
      value: users.map((item) => item.role === "Security").length,
      role: "Security",
    },
  ];

  const handleStatusChange = (Nip: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.Nip === Nip
          ? {
              ...user,
              status: user.status === "Aktif" ? "Nonaktif" : "Aktif",
            }
          : user,
      ),
    );
  };

  const openRegisterModal = () => {
    const modal = document.getElementById(
      "register_satpam_modal",
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const closeRegisterModal = () => {
    const modal = document.getElementById(
      "register_satpam_modal",
    ) as HTMLDialogElement;
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

      <div className="px-6">
        <div className="my-5 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <h1 className="font-bold text-2xl">
                Management User & Security Patrol
              </h1>
            </div>
            <p className="text-gray-600 tracking-wide text-sm">
              Kelola akun personel keamanan gardu induk, hak akses role, serta
              otentikasi perangkat terikat patroli NFC/GPS.
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="bg-white shadow-sm w-[70%] rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="bg-cyan-100 p-1 rounded-lg">
                  <People size={17} color="blue" />
                </div>
                <div className="ml-2">
                  <p className="text-gray-600 text-sm">
                    Total Personel: {users.length}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openRegisterModal}
              className="bg-[#FED400] shadow-sm w-[70%] rounded-lg p-3 cursor-pointer"
            >
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
            </button>

            {/* Form & Modal */}
            <dialog id="register_satpam_modal" className="modal">
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
            p-0
          "
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Register New Satpam
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Add a new security personnel to the system
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeRegisterModal}
                    className="btn btn-sm btn-circle btn-ghost"
                  >
                    <CloseCircle size={22} color="gray" />
                  </button>
                </div>

                {/* Form */}
                <form className="p-6 overflow-y-auto h-[calc(100vh-90px)]">
                  <div className="space-y-4">
                    {/* Satpam ID */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Satpam ID
                      </label>

                      <input
                        type="text"
                        placeholder="Enter satpam ID"
                        className="input input-bordered w-full mt-1 bg-gray-50"
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        placeholder="Enter full name"
                        className="input input-bordered w-full mt-1 bg-gray-50"
                      />
                    </div>

                    {/* Station */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Station
                      </label>

                      <select className="select select-bordered w-full mt-1 bg-gray-50">
                        <option disabled selected>
                          Select station
                        </option>
                        {listUnit.map((item) => (
                          <option>{item}</option>
                        ))}
                      </select>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        className="input input-bordered w-full mt-1 bg-gray-50"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>

                      <input
                        type="email"
                        placeholder="Enter email address"
                        className="input input-bordered w-full mt-1 bg-gray-50"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>

                      <input
                        type="password"
                        placeholder="Enter password"
                        className="input input-bordered w-full mt-1 bg-gray-50"
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Role
                      </label>

                      <select className="select select-bordered w-full mt-1 bg-gray-50">
                        <option disabled selected>
                          Select role
                        </option>
                        <option>Satpam</option>
                        <option>Supervisor</option>
                        <option>Admin</option>
                      </select>
                    </div>

                    {/* Action */}
                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={closeRegisterModal}
                        className="btn flex-1 bg-gray-100 border-none text-gray-700"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn flex-1 bg-[#FED400] border-none text-gray-900 hover:bg-[#e8c200]"
                      >
                        Register Satpam
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Click outside to close */}
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            {/* Form & Modal */}
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 mt-2 rounded-lg">
          <label className="input bg-gray-100 w-[40%]">
            <SearchNormal size={20} color="gray" />
            <input
              type="search"
              required
              placeholder="Search Satpam ID, Name, Or Station"
              className="text-gray-700 text-sm bg-gray-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="bg-gray-100 rounded-lg px-2 py-2 flex gap-3">
            {filterRole.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelectedRole(item.role)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-color ${selectedRole === item.role ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
              >
                <p className="text-gray-800 text-xs">{item.name}</p>
                {/* <div className="bg-blue-100 rounded-full px-2 py-1">
                  <p className="text-gray-800 text-xs">{item.value}</p>
                </div> */}
              </button>
            ))}
          </div>

          <div className="dropdown dropdown-start bg-gray-100 rounded-lg">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-gray-100 flex items-center gap-2 border-0"
            >
              <span className="text-xs text-gray-700">
                {selectedUnit || "Semua Unit"}
              </span>

              <ArrowDown2 size={17} color="gray" />
            </div>

            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-gray-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedUnit("")}
                  className="text-xs"
                >
                  Semua Unit
                </button>
              </li>

              {listUnit.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setSelectedUnit(item)}
                    className="text-xs"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="dropdown dropdown-start bg-gray-100 rounded-lg">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-gray-100 flex items-center"
            >
              <span className="text-xs text-gray-700">
                {selectedUnit || "Semua"}
              </span>

              <ArrowDown2 size={17} color="gray" />
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-gray-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("")}
                  className="text-xs"
                >
                  Semua
                </button>
              </li>

              {listStatus.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setSelectedStatus(item)}
                    className="text-xs"
                  >
                    {item}
                  </button>
                </li>
              ))}
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
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
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
                      Status Akun
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((item) => {
                      return (
                        <tr
                          key={item.Nip}
                          className="transition-colors hover:bg-gray-50"
                        >
                          {/* PERSONEL */}
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {item.nama}
                            </div>

                            <div className="text-xs text-gray-500">
                              {item.section}
                            </div>
                          </td>

                          {/* PENUGASAN */}
                          <td className="px-4 py-3">
                            {item.unit ? (
                              <div>
                                <div className="font-medium text-gray-800">
                                  {item.unit}
                                </div>

                                <div className="text-xs text-gray-500">
                                  Main Gate
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-gray-500 italic text-xs">
                                  Unit not assign now
                                </p>
                              </div>
                            )}
                          </td>

                          {/* ROLE */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                              {item.role}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className="toggle toggle-success toggle-sm"
                                checked={item.status === "Aktif"}
                                onChange={() => handleStatusChange(item.Nip)}
                              />

                              <span
                                className={`text-xs font-medium ${
                                  item.status === "Aktif"
                                    ? "text-green-700"
                                    : "text-gray-500"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </td>

                          {/* ACTION */}
                          <td className="px-4 py-3 text-center">
                            <button className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200">
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex min-h-[250px] flex-col items-center justify-center">
                          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <SearchStatus
                              size={28}
                              color="#9CA3AF"
                              variant="Linear"
                            />
                          </div>

                          <p className="text-sm font-semibold text-gray-800">
                            User Not Found
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Tidak ada user yang sesuai dengan pencarian atau
                            filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <div className="text-xs text-gray-500">
                Menampilkan{" "}
                <span className="font-medium text-gray-700">
                  {startIndex + 1}
                </span>{" "}
                -{" "}
                <span className="font-medium text-gray-700">
                  {Math.min(startIndex + itemPerPage, users.length)}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-gray-700">
                  {users.length}
                </span>{" "}
                personel
              </div>

              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  «
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      className={`join-item btn btn-sm ${
                        currentPage === page ? "btn-active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  className="join-item btn btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default UserManage;

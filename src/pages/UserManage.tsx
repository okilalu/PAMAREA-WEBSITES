import {
  ArrowDown2,
  CloseCircle,
  Edit,
  Eye,
  People,
  SearchNormal,
  SearchStatus,
  Trash,
  UserAdd,
} from "iconsax-react";
import React, { useMemo, useState } from "react";
import { useCreateUser, useUsers } from "../hooks/users/useUsers";
import { useRoles } from "../hooks/role/useRole";
import UserPagination from "../components/manageUser/UserPagination";

const UserManage = () => {
  const { data: listUsers } = useUsers();
  const { mutateAsync: register, isPending: isRegistering } = useCreateUser();
  const {
    data: rolesResponse,
    isPending: isRolesPending,
    isError: isRolesError,
  } = useRoles();
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  // const [selectedStatus, setSelectedStatus] = useState("");

  const users = listUsers?.data ?? [];
  const roles = rolesResponse?.data ?? [];

  console.log("USERS", JSON.stringify(users, null, 2));

  const listUnit = useMemo(() => {
    return Array.from(
      new Set(
        users
          .map((user) => user.site?.name)
          .filter((name): name is string => Boolean(name)),
      ),
    );
  }, [users]);

  const filteredUser = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return users.filter((item) => {
      const matchesSearch =
        item.fullName.toLowerCase().includes(keyword) ||
        (item.employeeNumber ?? "").toLowerCase().includes(keyword) ||
        (item.username ?? "").toLowerCase().includes(keyword) ||
        (item.role?.name ?? "").toLowerCase().includes(keyword) ||
        (item.site?.name ?? "").toLowerCase().includes(keyword) ||
        (item.phone ?? "").toLowerCase().includes(keyword);

      const matchesRole =
        selectedRole === "" || item.role?.name === selectedRole;

      const matchUnit = selectedUnit === "" || item.site?.name === selectedUnit;

      // const matchStatus =
      //   selectedStatus === "" || item.status === selectedStatus;

      return matchesSearch && matchesRole && matchUnit;
    });
  }, [users, search, selectedRole, selectedUnit]);

  const itemPerPage = 6;

  const totalPages = Math.ceil(filteredUser?.length / itemPerPage);
  const startIndex = (currentPage - 1) * itemPerPage;

  const currentUsers = filteredUser?.slice(
    startIndex,
    startIndex + itemPerPage,
  );

  const filterRole = [
    {
      name: "Semua Role",
      value: users.length,
      role: "",
    },
    {
      name: "Admin",
      value: users.filter((user) => user.role?.name === "ADMIN").length,
      role: "ADMIN",
    },
    {
      name: "Security",
      value: users.filter((user) => user.role?.name === "SECURITY").length,
      role: "SECURITY",
    },
  ];

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

  const resetRegisterForm = () => {
    setEmployeeNumber("");
    setFullName("");
    setUsername("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRoleId("");
    setRegisterError("");
  };

  const handleRegisterUser = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    const normalizedEmployeeNumber = employeeNumber.trim();
    const normalizedFullName = fullName.trim();
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (
      !normalizedEmployeeNumber ||
      !normalizedFullName ||
      !normalizedUsername ||
      !normalizedEmail ||
      !normalizedPhone ||
      !password ||
      !roleId
    ) {
      setRegisterError("Lengkapi semua field yang wajib diisi.");
      return;
    }
    if (!/^\d+$/.test(normalizedEmployeeNumber)) {
      setRegisterError("Satpam ID hanya boleh berisi angka.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setRegisterError("Format email tidak valid.");
      return;
    }

    if (!/^\+?[\d\s()-]{8,20}$/.test(normalizedPhone)) {
      setRegisterError("Format nomor telepon tidak valid.");
      return;
    }

    if (password.length < 8) {
      setRegisterError("Password minimal 8 karakter.");
      return;
    }

    // Validasi duplikasi Satpam ID dan email
    const duplicateID = users.some(
      (user) =>
        user.employeeNumber?.toLowerCase() ===
        normalizedEmployeeNumber.toLowerCase(),
    );

    if (duplicateID) {
      setRegisterError("Satpam ID sudah terdaftar.");
      return;
    }

    const duplicateEmail = users.some(
      (user) => user.email?.toLowerCase() === normalizedEmail,
    );

    if (duplicateEmail) {
      setRegisterError("Email sudah terdaftar.");
      return;
    }

    const selectedRoleData = roles.find((role) => role.id === roleId);
    if (!selectedRoleData) {
      setRegisterError("Role belum ditemukan. Periksa data role dari backend.");
      return;
    }
    const payload = {
      employeeNumber: normalizedEmployeeNumber,
      fullName: normalizedFullName,
      username: normalizedUsername,
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
      roleId: selectedRoleData.id,
    };
    console.log("PAYLOAD", payload);
    try {
      await register(payload);

      setRegisterSuccess("Pengguna berhasil didaftarkan.");
      resetRegisterForm();
      closeRegisterModal();
    } catch (error) {
      alert("Error saat register user");
      console.log(error);
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

      <div className="px-6">
        <div className="my-5 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[px] rounded-xs" />
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
                    Total Personel: {filteredUser?.length}
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
                    onClick={() => {
                      // setRegisterForm(initialRegisterForm);
                      setRegisterError("");
                      closeRegisterModal();
                    }}
                    className="btn btn-sm btn-circle btn-ghost"
                  >
                    <CloseCircle size={22} color="gray" />
                  </button>
                </div>

                {/* Form */}
                <form
                  className="p-6 overflow-y-auto h-[calc(100vh-90px)]"
                  onSubmit={handleRegisterUser}
                >
                  <div className="space-y-4">
                    {/* Satpam ID */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Satpam ID
                      </label>

                      <input
                        type="text"
                        name="Nip"
                        placeholder="Enter satpam ID"
                        className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={employeeNumber}
                        onChange={(e) => setEmployeeNumber(e.target.value)}
                        required
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="nama"
                        placeholder="Enter full name"
                        className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Username
                      </label>

                      <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Role
                      </label>

                      <select
                        className="select select-bordered w-full mt-1 bg-white border-gray-300 text-sm"
                        name="role"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        disabled={
                          isRolesPending || isRolesError || roles.length === 0
                        }
                        required
                      >
                        <option value="" disabled>
                          {isRolesPending
                            ? "Memuat Role..."
                            : isRolesError
                              ? "Gagal memuat role"
                              : roles.length === 0
                                ? "Role tidak tersedia"
                                : "Select role"}
                        </option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action */}
                    {registerError && (
                      <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                      >
                        <span>{registerError}</span>
                      </div>
                    )}
                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterError("");
                          closeRegisterModal();
                        }}
                        disabled={isRegistering}
                        className="btn flex-1 bg-gray-100 border-none text-gray-700"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isRegistering}
                        className="btn flex-1 bg-[#FED400] border-none text-gray-900 hover:bg-[#e8c200]"
                      >
                        {isRegistering ? "Mendaftarkan..." : "Register Satpam"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Click outside to close */}
              <form method="dialog" className="modal-backdrop">
                <button
                  onClick={() => {
                    setRegisterError("");
                    closeRegisterModal();
                  }}
                >
                  close
                </button>
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

          <div className="bg-gray-100 rounded-lg px-4 py-1 flex gap-3">
            {filterRole.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelectedRole(item.role)}
                className={`flex items-center justify-center gap-1 px-1 py-2 rounded-lg transition-color ${selectedRole === item.role ? "bg-[#003B73] shadow-sm" : "hover:bg-white/50"}`}
              >
                <p
                  className={`text-xs ${selectedRole === item.role ? "text-white" : "text-gray-700"}`}
                >
                  {item.name}
                </p>
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
                  onClick={() => {
                    setSelectedUnit("");
                    setCurrentPage(1);
                  }}
                  className="text-xs"
                >
                  Semua Unit
                </button>
              </li>

              {listUnit.map((unit) => (
                <li key={unit}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUnit(unit);
                      setCurrentPage(1);
                    }}
                    className="text-xs"
                  >
                    {unit}
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
              <CloseCircle size={18} />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="mt-5 rounded-lg bg-white p-4 shadow-sm">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Personel Pamarea
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
                  {currentUsers?.length > 0 ? (
                    currentUsers?.map((item) => {
                      return (
                        <tr
                          key={item.employeeNumber}
                          className="transition-colors hover:bg-gray-50"
                        >
                          {/* PERSONEL */}
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {item.fullName}
                            </div>

                            <div className="text-xs text-gray-500">
                              {item.site?.code ?? "-"}
                            </div>
                          </td>

                          {/* PENUGASAN */}
                          <td className="px-4 py-3">
                            {item.site?.name ? (
                              <div>
                                <div className="font-medium text-gray-800">
                                  {item.site.name}
                                </div>

                                <div className="text-xs text-gray-500">
                                  Main Gate
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-gray-500 italic text-xs">
                                  Belum Ditugaskan
                                </p>
                              </div>
                            )}
                          </td>

                          {/* ROLE */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                              {item.role?.name}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                                item.status === "ACTIVE"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  item.status === "ACTIVE"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              />

                              {item.status === "ACTIVE"
                                ? "Aktif"
                                : "Tidak Aktif"}
                            </span>
                          </td>

                          {/* ACTION */}
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-4">
                              <button className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200">
                                <Edit size={17} color="gray" />
                              </button>
                              <button className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-red-200">
                                <Trash size={17} color="red" />
                              </button>
                              <button className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200">
                                <Eye size={17} color="gray" />
                              </button>
                            </div>
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

            {/* Modal Detail User */}
            {/* Modal Detail User */}

            {/* PAGINATION */}
            <UserPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUser.length}
              itemPerPage={itemPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default UserManage;

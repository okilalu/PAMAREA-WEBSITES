import {
  ArrowDown2,
  Call,
  CloseCircle,
  Edit,
  People,
  SearchNormal,
  SearchStatus,
  Trash,
  UserAdd,
} from "iconsax-react";
import React, { useMemo, useState } from "react";
import {
  useActivateUser,
  useCreateUser,
  useDeactivateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "../hooks/users/useUsers";
import { useRoles } from "../hooks/role/useRole";
import UserPagination from "../components/manageUser/UserPagination";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import type { CreateUserRequest, UpdateUserRequest } from "../types";
import type { CreateTeamPayload } from "../types/team/team";
import { useCreateTeam, useTeams } from "../hooks/team/useTeams";

const UserManage = () => {
  const { user } = useAuthContext();
  const siteId = user?.siteId;
  const { data: listUsers } = useUsers();
  const { data: teams } = useTeams();

  const { mutateAsync: register, isPending: isRegistering } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  const { mutateAsync: removeUser, isPending: isDeletingUser } =
    useDeleteUser();
  const { mutateAsync: deactivated } = useDeactivateUser();
  const { mutateAsync: activated } = useActivateUser();
  const { mutateAsync: createTeam, isPending: isCreateTeam } = useCreateTeam();
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
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);

  const users = listUsers?.data ?? [];

  // console.log("USERS", JSON.stringify(teams, null, 2));

  // const listRegu = useMemo(() => {
  //   return Array.from(
  //     new Set(
  //       teams
  //         ?.map((item) => item.name)
  //         .filter((name): name is string => Boolean(name)),
  //     ),
  //   );
  // }, [teams]);

  const roles = rolesResponse?.data ?? [];
  const team = teams ?? [];

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
        (item.phone ?? "").toLowerCase().includes(keyword) ||
        (item.team?.name ?? "").toLowerCase().includes(keyword);

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
      name: "Danru",
      value: users.filter((user) => user.role?.name === "DANRU_SECURITY")
        .length,
      role: "DANRU_SECURITY",
    },
    {
      name: "Chief",
      value: users.filter((user) => user.role?.name === "CHIEF_SECURITY")
        .length,
      role: "CHIEF_SECURITY",
    },
    {
      name: "Security",
      value: users.filter((user) => user.role?.name === "SECURITY").length,
      role: "SECURITY",
    },
  ];

  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;

    if (modal && !modal.open) {
      modal.showModal();
    }
  };

  const closeModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;

    if (modal?.open) {
      modal.close();
    }
  };

  const openRegisterModal = () => {
    resetRegisterForm();
    setSelectedUserId("");
    setIsEditMode(false);

    const modal = document.getElementById(
      "register_satpam_modal",
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const openEditModal = (user: (typeof users)[number]) => {
    setSelectedUserId(user.id);
    setIsEditMode(true);

    setEmployeeNumber(user.employeeNumber ?? "");
    setFullName(user.fullName ?? "");
    setUsername(user.username ?? "");
    setEmail(user.email ?? "");
    setPhone(user.phone ?? "");
    setPassword("");
    setTeamName(user.team?.name ?? "");
    setTeamCode(user.team?.code ?? "");
    setTeamDescription(user.team?.description ?? "");
    setRoleId(user.roleId ?? user.role?.id ?? "");
    setTeamId(user.teamId ?? user.team?.id ?? "");

    setRegisterError("");
    setRegisterSuccess("");

    const modal = document.getElementById(
      "register_satpam_modal",
    ) as HTMLDialogElement | null;

    modal?.showModal();
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
    setTeamName("");
    setTeamCode("");
    setTeamDescription("");
    setRoleId("");
    setTeamId("");

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

    // Validasi field wajib
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

    // Validasi email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setRegisterError("Format email tidak valid.");
      return;
    }

    // Validasi nomor telepon
    if (!/^\+?[\d\s()-]{8,20}$/.test(normalizedPhone)) {
      setRegisterError("Format nomor telepon tidak valid.");
      return;
    }

    // Validasi password
    if (password.length < 8) {
      setRegisterError("Password minimal 8 karakter.");
      return;
    }

    // Validasi duplikasi Satpam ID
    const duplicateID = users.some(
      (user) =>
        user.employeeNumber?.toLowerCase() ===
        normalizedEmployeeNumber.toLowerCase(),
    );

    if (duplicateID) {
      setRegisterError("Satpam ID sudah terdaftar.");
      return;
    }

    // Validasi duplikasi email
    const duplicateEmail = users.some(
      (user) => user.email?.toLowerCase() === normalizedEmail,
    );

    if (duplicateEmail) {
      setRegisterError("Email sudah terdaftar.");
      return;
    }

    // Cari role yang dipilih
    const selectedRoleData = roles.find((role) => role.id === roleId);
    if (!selectedRoleData) {
      setRegisterError("Role belum ditemukan. Periksa data role dari backend.");
      return;
    } // Normalisasi nama role
    const normalizedRoleName = String(selectedRoleData.name)
      .trim()
      .toUpperCase(); // Role yang wajib memiliki team
    const rolesRequiringTeam = ["SECURITY", "DANRU_SECURITY", "CHIEF_SECURITY"];
    const requiresTeam = rolesRequiringTeam.includes(normalizedRoleName);
    let selectedTeamId: string | undefined; // Validasi team khusus role keamanan
    if (requiresTeam) {
      if (!teamId) {
        setRegisterError(`Role ${normalizedRoleName} wajib memiliki tim.`);
        return;
      }
      const selectedTeam = teams?.find((team) => team.id === teamId);
      if (!selectedTeam) {
        setRegisterError("Tim tidak ditemukan. Silakan pilih tim yang valid.");
        return;
      }
      selectedTeamId = selectedTeam.id;
    }

    // Susun payload
    const payload: CreateUserRequest = {
      employeeNumber: normalizedEmployeeNumber,
      fullName: normalizedFullName,
      username: normalizedUsername,
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
      roleId: selectedRoleData.id,
      siteId,
      ...(selectedTeamId ? { teamId: selectedTeamId } : {}),
    };

    console.log("ROLE DIPILIH:", selectedRoleData);
    console.log("ROLE NAME:", normalizedRoleName);
    console.log("TEAM ID:", selectedTeamId);
    console.log("TEAM ID:", selectedTeamId);

    console.log("PAYLOAD REGISTER USER", payload);

    try {
      await register(payload);

      setRegisterSuccess("Pengguna berhasil didaftarkan.");

      resetRegisterForm();
      closeRegisterModal();
    } catch (error) {
      console.error("Gagal memperbarui user:", error);

      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as {
            response?: {
              status?: number;
              data?: {
                message?: string | string[];
              };
            };
          }
        ).response;

        if (response?.status === 409) {
          const message = response.data?.message;

          setRegisterError(
            Array.isArray(message)
              ? message.join(", ")
              : message ||
                  "Data bertentangan dengan data yang sudah ada. Periksa Satpam ID, username, dan email.",
          );
          return;
        }

        if (response?.status === 400) {
          const message = response.data?.message;

          setRegisterError(
            Array.isArray(message)
              ? message.join(", ")
              : message || "Data yang dikirim tidak valid.",
          );
          return;
        }
      }

      setRegisterError("Gagal memperbarui user. Silakan periksa kembali data.");
    }
  };

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setRegisterError("");
    setRegisterSuccess("");

    if (!selectedUserId) {
      setRegisterError("User yang akan diperbarui belum dipilih.");
      return;
    }

    const normalizedEmployeeNumber = employeeNumber.trim();
    const normalizedFullName = fullName.trim();
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // const normalizedTeamName = teamName.trim();
    // const normalizedTeamCode = teamCode.trim().toUpperCase();
    // const normalizedTeamDescription = teamDescription.trim();

    if (
      !normalizedEmployeeNumber ||
      !normalizedFullName ||
      !normalizedUsername ||
      !normalizedEmail ||
      !normalizedPhone ||
      !roleId
    ) {
      setRegisterError("Lengkapi semua field yang wajib diisi.");
      return;
    }

    if (!normalizedEmployeeNumber) {
      setRegisterError("Satpam ID harus diisi.");
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

    const duplicateID = users.some(
      (user) =>
        user.id !== selectedUserId &&
        user.employeeNumber?.toLowerCase() ===
          normalizedEmployeeNumber.toLowerCase(),
    );

    if (duplicateID) {
      setRegisterError("Satpam ID sudah digunakan oleh user lain.");
      return;
    }

    const duplicateEmail = users.some(
      (user) =>
        user.id !== selectedUserId &&
        user.email?.toLowerCase() === normalizedEmail,
    );

    if (duplicateEmail) {
      setRegisterError("Email sudah digunakan oleh user lain.");
      return;
    }

    const selectedRoleData = roles.find((role) => role.id === roleId);
    const selectedTeamId = team.find((team) => team.id === teamId);

    if (!selectedRoleData) {
      setRegisterError("Silakan pilih role yang valid.");
      return;
    }

    if (!selectedTeamId) {
      setRegisterError("Silakan pilih team yang valid.");
      return;
    }

    const payload: UpdateUserRequest = {
      employeeNumber: normalizedEmployeeNumber,
      fullName: normalizedFullName,
      username: normalizedUsername,
      email: normalizedEmail,
      phone: normalizedPhone,
      roleId: selectedRoleData.id,
      teamId: selectedTeamId?.id,
      siteId,
      // team: {
      //   name: normalizedTeamName,
      //   code: normalizedTeamCode,
      //   ...(normalizedTeamDescription && {
      //     description: normalizedTeamDescription,
      //   }),
      // },
    };

    try {
      await updateUser({
        id: selectedUserId,
        payload,
      });

      setRegisterSuccess("Data user berhasil diperbarui.");

      resetRegisterForm();
      setSelectedUserId("");
      setIsEditMode(false);

      closeRegisterModal();
    } catch (error) {
      console.error("Gagal memperbarui user:", error);

      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as {
            response?: {
              status?: number;
              data?: {
                message?: string | string[];
              };
            };
          }
        ).response;

        if (response?.status === 409) {
          const message = response.data?.message;

          setRegisterError(
            Array.isArray(message)
              ? message.join(", ")
              : message ||
                  "Data bertentangan dengan data yang sudah ada. Periksa Satpam ID, username, dan email.",
          );
          return;
        }

        if (response?.status === 400) {
          const message = response.data?.message;

          setRegisterError(
            Array.isArray(message)
              ? message.join(", ")
              : message || "Data yang dikirim tidak valid.",
          );
          return;
        }
      }

      setRegisterError("Gagal memperbarui user. Silakan periksa kembali data.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus user ini?",
    );

    if (!confirmed) return;
    try {
      await removeUser(userId);

      setRegisterSuccess("User berhasil dihapus.");
    } catch (error) {
      console.log(error);
      setRegisterError("Gagal menghapus user. Silakan coba kembali.");
    }
  };

  const deactivatedUser = async (userId: string) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menonaktifkan user ini?",
    );

    if (!confirmed) return;

    try {
      await deactivated(userId);

      setRegisterSuccess("User berhasil dinonaktifkan.");
      setRegisterError("");
    } catch (error) {
      console.error("Gagal menonaktifkan user:", error);
      setRegisterError("Gagal menonaktifkan user. Silakan coba kembali.");
      setRegisterSuccess("");
    }
  };

  const activatedUser = async (userId: string) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin mengaktifkan user ini?",
    );

    if (!confirmed) return;

    try {
      await activated(userId);

      setRegisterSuccess("User berhasil diaktifkan.");
      setRegisterError("");
    } catch (error) {
      console.error("Gagal mengaktifkan user:", error);
      setRegisterError("Gagal mengaktifkan user. Silakan coba kembali.");
      setRegisterSuccess("");
    }
  };

  const handleCreateTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!siteId) {
      console.log("Site ID harus diisi");
    }

    const payload: CreateTeamPayload = {
      siteId: siteId ?? null,
      name: teamName,
      code: teamCode,
      description: teamDescription,
    };

    console.log("PAYLOAD", JSON.stringify(payload, null, 2));

    try {
      await createTeam(payload);
      console.log("Berhasil create team");

      closeModal("add_team");
    } catch (error) {
      console.log("Gagal saat create team", error);
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
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 mt-2 rounded-lg">
          <label className="input bg-gray-100 w-[27%]">
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

          <div className="bg-gray-100 rounded-lg py-1 flex gap-3">
            {filterRole.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelectedRole(item.role)}
                className={`flex items-center justify-center gap-1 px-1 py-3 rounded-lg transition-color ${selectedRole === item.role ? "bg-[#003B73] shadow-sm" : "hover:bg-white/50"}`}
              >
                <p
                  className={`text-xs ${selectedRole === item.role ? "text-white" : "text-gray-700"}`}
                >
                  {item.name}
                </p>
                <div className="bg-blue-100 rounded-full px-1">
                  <p className="text-gray-800 text-xs">{item.value}</p>
                </div>
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

          <div>
            <button
              onClick={() => openModal("add_team")}
              className="bg-white shadow-sm rounded-lg px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="bg-cyan-100 p-1 rounded-lg">
                  <People size={17} color="blue" />
                </div>
                <div className="ml-2">
                  <p className="text-gray-600 text-sm">Tambah Regu</p>
                </div>
              </div>
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={openRegisterModal}
              className="bg-[#FED400] shadow-sm rounded-lg px-4 py-2 border border-yellow-100 hover:bg-yellow-400 cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <div className="bg-[#FED400] p-1 rounded-lg">
                  <UserAdd size={17} color="#6F5C00" />
                </div>
                <div className="ml-1">
                  <p className="text-gray-900 text-sm font-semibold">
                    {isEditMode ? "Edit Data Satpam" : "Register New Satpam"}
                  </p>
                </div>
              </div>
            </button>
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
                      Info & Kontak
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
                            <div className="flex items-center gap-3 min-w-[200px]">
                              {/* Foto Profil */}
                              <div className="relative shrink-0">
                                <img
                                  src={
                                    item.photoUrl ||
                                    "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=120&h=120&fit=crop&crop=faces&auto=format&q=80"
                                  }
                                  alt={`Foto ${item.fullName}`}
                                  className={`h-11 w-11 rounded-full object-cover bg-gray-100 ring-2 ring-offset-1 transition-all ${
                                    item.status === "ACTIVE"
                                      ? "ring-emerald-500/30"
                                      : "ring-gray-200"
                                  }`}
                                />
                              </div>

                              {/* Informasi Satpam */}
                              <div className="min-w-0 flex-1">
                                <div
                                  className="truncate text-sm font-semibold text-gray-800"
                                  title={item.fullName}
                                >
                                  {item.fullName || "Nama tidak tersedia"}
                                </div>

                                <div className="mt-1 flex items-center gap-1.5">
                                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                                    {item.employeeNumber || "-"}
                                  </span>
                                </div>
                              </div>
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
                                  {item.team?.name ?? "Tidak ada regu"}
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
                            {(() => {
                              const roleConfig = {
                                ADMIN: {
                                  label: "Administrator",
                                  badge:
                                    "bg-purple-50 text-purple-700 ring-purple-600/20",
                                },
                                SECURITY: {
                                  label: "Security",
                                  badge:
                                    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
                                },
                                DANRU_SECURITY: {
                                  label: "Danru Security",
                                  badge:
                                    "bg-amber-50 text-amber-700 ring-amber-600/20",
                                },
                                CHIEF_SECURITY: {
                                  label: "Chief Security",
                                  badge:
                                    "bg-rose-50 text-rose-700 ring-rose-600/20",
                                },
                              } as const;

                              const roleName = item.role?.name;
                              const role = roleName
                                ? roleConfig[
                                    roleName as keyof typeof roleConfig
                                  ]
                                : undefined;

                              return (
                                <div className="flex flex-col items-start gap-2">
                                  {/* Role Badge */}
                                  <div
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                      role?.badge ??
                                      "bg-gray-100 text-gray-600 ring-gray-500/20"
                                    }`}
                                  >
                                    <p className="uppercase">
                                      {role?.label ??
                                        roleName ??
                                        "Tidak diketahui"}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Call size={17} color="gray" />
                              <p className="ml-1.5 text-sm text-black font-semibold">
                                {item.phone}
                              </p>
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {/* Toggle Switch */}
                              <button
                                type="button"
                                role="switch"
                                aria-checked={item.status === "ACTIVE"}
                                aria-label={`${
                                  item.status === "ACTIVE"
                                    ? "Nonaktifkan"
                                    : "Aktifkan"
                                } ${item.fullName}`}
                                onClick={() => {
                                  if (item.status === "ACTIVE") {
                                    deactivatedUser(item.id);
                                  } else {
                                    activatedUser(item.id);
                                  }
                                }}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  item.status === "ACTIVE"
                                    ? "bg-emerald-500 focus:ring-emerald-500"
                                    : "bg-gray-300 focus:ring-gray-400"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                    item.status === "ACTIVE"
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>

                              {/* Status Label */}
                              <div className="flex flex-col">
                                <span
                                  className={`text-xs font-semibold ${
                                    item.status === "ACTIVE"
                                      ? "text-emerald-700"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {item.status === "ACTIVE"
                                    ? "Aktif"
                                    : "Nonaktif"}
                                </span>

                                <span className="mt-0.5 text-[10px] text-gray-400">
                                  {item.status === "ACTIVE"
                                    ? "Akses diaktifkan"
                                    : "Akses dinonaktifkan"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* <td className="px-4 py-3">
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
                          </td> */}
                          {/* ACTION */}
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                title="Edit user"
                                className="cursor-pointer rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                              >
                                <Edit size={17} color="gray" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(item.id)}
                                disabled={isDeletingUser}
                                title="Hapus user"
                                className="cursor-pointer rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-red-200"
                              >
                                <Trash size={17} color="red" />
                              </button>
                              {/* <button
                                type="button"
                                title="Lihat detail"
                                className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                              >
                                <Eye size={17} color="gray" />
                              </button> */}
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
                  {isEditMode ? "Update Satpam" : "Register New Satpam"}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {isEditMode
                    ? "Edit a satpam data "
                    : "Add a new security personnel to the system"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  // setRegisterForm(initialRegisterForm);
                  setRegisterError("");
                  setIsEditMode(false);
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
              // onSubmit={handleRegisterUser}
              onSubmit={isEditMode ? handleUpdateUser : handleRegisterUser}
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
                {!isEditMode && (
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
                      required={!isEditMode}
                    />
                  </div>
                )}
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

                {/* Pilih Team saat Edit User */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Regu / Team
                  </label>

                  <select
                    className="select select-bordered w-full mt-1 bg-white border-gray-300 text-sm"
                    name="teamId"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Pilih Regu / Team
                    </option>

                    {team.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Team Fields - hanya saat membuat user */}
                {/* {isEditMode && (
                  <div className="border-t border-gray-200 pt-5 mt-5">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Informasi Tim
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Buat tim baru untuk satpam yang didaftarkan.
                      </p>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Nama Tim
                      </label>
                      <input
                        type="text"
                        name="teamName"
                        placeholder="Contoh: Regu Alpha"
                        className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required={!isEditMode}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Kode Tim
                      </label>
                      <input
                        type="text"
                        name="teamCode"
                        placeholder="Contoh: REGU-ALPHA"
                        className="input input-bordered w-full mt-1 bg-white border-gray-300 text-sm uppercase focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={teamCode}
                        onChange={(e) =>
                          setTeamCode(e.target.value.toUpperCase())
                        }
                        required={!isEditMode}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Deskripsi Tim
                        <span className="font-normal text-gray-400 ml-1">
                          (Opsional)
                        </span>
                      </label>
                      <textarea
                        name="teamDescription"
                        placeholder="Masukkan deskripsi tim..."
                        rows={3}
                        maxLength={255}
                        className="textarea textarea-bordered w-full mt-1 bg-white border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        required={!isEditMode}
                      />
                    </div>
                  </div>
                )} */}

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
                      resetRegisterForm();
                      setSelectedUserId("");
                      setIsEditMode(false);
                      closeRegisterModal();
                    }}
                    disabled={isRegistering || isUpdatingUser}
                    className="btn flex-1 bg-gray-100 border-none text-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isRegistering || isUpdatingUser}
                    className="btn flex-1 bg-[#FED400] border-none text-gray-900 hover:bg-[#e8c200]"
                  >
                    {isRegistering || isUpdatingUser
                      ? "Menyimpan..."
                      : isEditMode
                        ? "Simpan Perubahan"
                        : "Register Satpam"}
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
                setIsEditMode(false);
                closeRegisterModal();
              }}
            >
              close
            </button>
          </form>
        </dialog>
        {/* Form & Modal */}

        {/* Modal Create Team */}
        <dialog id="add_team" className="modal">
          <div className="modal-box flex max-h-[92vh] w-11/12 max-w-2xl flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <People size={21} color="#003B73" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Buat Regu / Team Patroli
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Konfigurasikan dengan security.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeModal("add_team");
                }}
                aria-label="Tutup modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <CloseCircle size={21} color="gray" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="px-5 py-4">
              <div>
                <label
                  htmlFor=""
                  className="block text-sm text-gray-500 font-semibold"
                >
                  Nama Regu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Regu A"
                  className="border border-gray-200 rounded-lg w-full px-4 py-3 mt-1"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div className="mt-5">
                <label
                  htmlFor=""
                  className="block text-sm text-gray-500 font-semibold"
                >
                  Code Regu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: REGU-ALPHA"
                  className="border border-gray-200 rounded-lg w-full px-4 py-3 mt-1"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                />
              </div>
              <div className="mt-5">
                <label
                  htmlFor=""
                  className="block text-sm text-gray-500 font-semibold"
                >
                  Description Regu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Opsional"
                  className="border border-gray-200 rounded-lg w-full px-4 py-3 mt-1"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-5">
                <button
                  onClick={() => closeModal("add_team")}
                  className="border border-gray-400 rounded-lg px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <p className="text-sm text-gray-500 font-semibold">Batal</p>
                </button>
                <button
                  disabled={isCreateTeam}
                  className="bg-[#FED400] rounded-lg px-4 py-2 hover:bg-yellow-300 cursor-pointer"
                >
                  <p className="text-sm font-semibold">
                    {isCreateTeam ? "Menyimpan..." : "Simpan"}
                  </p>
                </button>
              </div>
            </form>
          </div>
        </dialog>
        {/* Modal Create Team */}
      </div>
    </div>
  );
};

export default UserManage;

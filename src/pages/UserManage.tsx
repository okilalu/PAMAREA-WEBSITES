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

type User = {
  nama: string;
  Nip: string;
  section: string;
  unit: string | null;
  role: string;
  device: string;
  status: "Aktif" | "Nonaktif";
  phone?: string;
  email?: string;
};

type RegisterForm = {
  Nip: string;
  nama: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  unit: string;
};

const initialRegisterForm: RegisterForm = {
  Nip: "",
  nama: "",
  phone: "",
  email: "",
  password: "",
  role: "",
  unit: "",
};

const UserManage = () => {
  const listUnit = [
    "Area Trafo Daya 1",
    "Area Trafo Daya 2",
    "Gudang Material Utama",
    "Ruang Panel Utama",
    "Gerbang Utama",
    "Area Parkir Kendaraan",
  ];

  // const listStatus = ["Aktif", "Nonaktif"];
  const userTable: User[] = [
    {
      Nip: "520210210210120",
      nama: "Dimas",
      phone: "081234512341",
      email: "test@gmail.com",
      role: "Admin Planner",
      unit: null,
      section: "SEC-001",
      device: "Samsung",
      status: "Aktif",
    },
    {
      Nip: "520210210210121",
      nama: "Andi",
      phone: "081234512341",
      email: "test@gmail.com",
      role: "Anggota Security",
      unit: "Area Trafo Daya 1",
      section: "SEC-002",
      device: "Samsung",
      status: "Aktif",
    },
    {
      Nip: "520210210210122",
      nama: "Rizky",
      phone: "081234512341",
      email: "test@gmail.com",
      role: "Anggota Security",
      unit: "Area Trafo Daya 2",
      section: "SEC-003",
      device: "Xiaomi",
      status: "Aktif",
    },
  ];
  // const userTable: User[] = [
  //   {
  //     nama: "Dimas",
  //     Nip: "520210210210120",
  //     section: "SEC-001",
  //     unit: "Area Trafo Daya 1",
  //     role: "Admin",
  //     device: "Samsung",
  //     status: "Aktif",
  //   },
  //   {
  //     nama: "Andi",
  //     Nip: "520210210210121",
  //     section: "SEC-002",
  //     unit: null,
  //     role: "Security",
  //     device: "Samsung",
  //     status: "Aktif",
  //   },
  //   {
  //     nama: "Rizky",
  //     Nip: "520210210210122",
  //     section: "SEC-003",
  //     unit: "Area Trafo Daya 2",
  //     role: "Security",
  //     device: "Xiaomi",
  //     status: "Aktif",
  //   },
  //   {
  //     nama: "Fajar",
  //     Nip: "520210210210123",
  //     section: "SEC-004",
  //     unit: "Ruang Panel Utama",
  //     role: "Security",
  //     device: "Oppo",
  //     status: "Nonaktif",
  //   },
  //   {
  //     nama: "Bayu",
  //     Nip: "520210210210124",
  //     section: "SEC-005",
  //     unit: "Gudang Material Utama",
  //     role: "Security",
  //     device: "Samsung",
  //     status: "Aktif",
  //   },
  //   {
  //     nama: "Ardi",
  //     Nip: "520210210210125",
  //     section: "SEC-006",
  //     unit: "Gerbang Utama",
  //     role: "Security",
  //     device: "Vivo",
  //     status: "Aktif",
  //   },
  //   {
  //     nama: "Rian",
  //     Nip: "520210210210126",
  //     section: "SEC-007",
  //     unit: null,
  //     role: "Security",
  //     device: "Samsung",
  //     status: "Aktif",
  //   },
  //   {
  //     nama: "Ilham",
  //     Nip: "520210210210127",
  //     section: "SEC-008",
  //     unit: "Area Parkir Kendaraan",
  //     role: "Security",
  //     device: "Xiaomi",
  //     status: "Aktif",
  //   },
  //   {
  //     nama: "Agus",
  //     Nip: "520210210210128",
  //     section: "SEC-009",
  //     unit: null,
  //     role: "Security",
  //     device: "Oppo",
  //     status: "Aktif",
  //   },
  //   {
  //     nama: "Rendi",
  //     Nip: "520210210210129",
  //     section: "SEC-010",
  //     unit: "Ruang Panel Utama",
  //     role: "Security",
  //     device: "Samsung",
  //     status: "Aktif",
  //   },
  // ];

  const [users, setUsers] = useState<User[]>(userTable);
  const [registerForm, setRegisterForm] =
    useState<RegisterForm>(initialRegisterForm);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

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
      name: "Chief Security",
      value: users.filter((item) => item.role === "Chief Security").length,
      role: "Chief Security",
    },
    {
      name: "Admin Planner",
      value: users.filter((item) => item.role === "Admin Planner").length,
      role: "Admin Planner",
    },
    {
      name: "Danru Security",
      value: users.filter((item) => item.role === "Danru Security").length,
      role: "Danru Security",
    },
    {
      name: "Anggota Security",
      value: users.filter((item) => item.role === "Anggota Security").length,
      role: "Anggota Security",
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

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setRegisterError("");
    setRegisterSuccess("");
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const Nip = registerForm.Nip.trim();
    const nama = registerForm.nama.trim();
    const phone = registerForm.phone.trim();
    const email = registerForm.email.trim().toLowerCase();
    const password = registerForm.password;
    const role = registerForm.role;
    const unit = registerForm.unit;

    // Validasi input
    if (!Nip || !nama || !phone || !email || !password || !role) {
      setRegisterError("Semua field wajib diisi.");
      return;
    }

    if (!/^\d+$/.test(Nip)) {
      setRegisterError("Satpam ID hanya boleh berisi angka.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRegisterError("Format email tidak valid.");
      return;
    }

    if (!/^\+?[\d\s()-]{8,20}$/.test(phone)) {
      setRegisterError("Format nomor telepon tidak valid.");
      return;
    }

    if (password.length < 8) {
      setRegisterError("Password minimal 8 karakter.");
      return;
    }

    // Validasi duplikasi Satpam ID dan email
    const duplicateNip = users.some(
      (user) => user.Nip.toLowerCase() === Nip.toLowerCase(),
    );

    if (duplicateNip) {
      setRegisterError("Satpam ID sudah terdaftar.");
      return;
    }

    const duplicateEmail = users.some(
      (user) => user.email?.toLowerCase() === email,
    );

    if (duplicateEmail) {
      setRegisterError("Email sudah terdaftar.");
      return;
    }

    // Buat data pengguna baru
    const newUser: User = {
      nama,
      Nip,
      section: `SEC-${String(users.length + 1).padStart(3, "0")}`,
      unit: unit || null,
      role,
      device: "-", // Belum ada device terikat saat awal daftar
      status: "Aktif",
      phone,
      email,
    };

    // --- SIMULASI API POST / UPDATE JSON ---
    console.log("Menambahkan data baru...");
    console.log(
      "Payload yang akan dikirim ke DB:",
      JSON.stringify(newUser, null, 2),
    );

    // Tambahkan pengguna ke tabel (Simulasi respons sukses dari DB)
    setUsers((prevUsers) => {
      const updatedData = [newUser, ...prevUsers];
      console.log(
        "Full JSON State Baru:",
        JSON.stringify(updatedData, null, 2),
      );
      return updatedData;
    });
    // ---------------------------------------

    // Reset halaman dan filter agar pengguna baru terlihat di baris pertama
    setCurrentPage(1);
    setSearch("");
    setSelectedRole("");
    setSelectedUnit("");
    setSelectedStatus("");

    setRegisterSuccess(`${nama} berhasil didaftarkan ke sistem.`);
    setRegisterForm(initialRegisterForm);
    setRegisterError("");

    closeRegisterModal();
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
                    onClick={() => {
                      setRegisterForm(initialRegisterForm);
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
                  onSubmit={handleRegisterSubmit}
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
                        value={registerForm.Nip}
                        onChange={handleRegisterChange}
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
                        value={registerForm.nama}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>

                    {/* Station */}
                    {/* <div>
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
                    </div> */}

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
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
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
                        value={registerForm.email}
                        onChange={handleRegisterChange}
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
                        value={registerForm.password}
                        onChange={handleRegisterChange}
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
                        value={registerForm.role}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="" disabled>
                          Select role
                        </option>
                        <option value="Chief Security">Chief Security</option>
                        <option value="Admin Planner">Admin Planner</option>
                        <option value="Danru Security">Danru Security</option>
                        <option value="Anggota Security">
                          Anggota Security
                        </option>
                      </select>
                    </div>

                    {/* Action */}
                    {registerError && (
                      <div className="alert alert-error mt-4 text-sm p-3 rounded-lg">
                        <span>{registerError}</span>
                      </div>
                    )}
                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterForm(initialRegisterForm);
                          setRegisterError("");
                          closeRegisterModal();
                        }}
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
                <button
                  onClick={() => {
                    setRegisterForm(initialRegisterForm);
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

          {/* <div className="dropdown dropdown-start bg-gray-100 rounded-lg">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-gray-100 flex items-center"
            >
              <span className="text-xs text-gray-700">
                {selectedStatus || "Semua"}
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
          </div> */}
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

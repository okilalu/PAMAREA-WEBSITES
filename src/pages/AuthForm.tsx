import { useState, type FormEvent } from "react";
import { useLogin } from "../hooks/auth";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { mutate: login, isPending } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    const payload = {
      username: username.trim(),
      password,
    };

    login(payload, {
      onSuccess: (response) => {
        console.log("Login berhasil:", response);

        // Ambil token dari respons backend
        const { accessToken, refreshToken } = response.data;

        // Simpan token ke localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        console.log(
          "Access token tersimpan:",
          Boolean(localStorage.getItem("accessToken")),
        );

        // Arahkan pengguna ke dashboard
        navigate("/", { replace: true });
      },

      onError: (err) => {
        console.error("Login gagal:", err);
        setError("Username atau password tidak valid.");
      },
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-600/10";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-2">
        {/* Left Panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-rose-700 p-10 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full border-[50px] border-white/10" />

          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold">
              A
            </div>

            <h1 className="mt-8 text-3xl font-bold tracking-tight">
              Selamat Datang
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-7 text-rose-100">
              Akses akun Anda dengan mudah dan nikmati pengalaman menggunakan
              aplikasi yang aman, nyaman, dan terintegrasi.
            </p>
          </div>

          <div className="relative z-10">
            <div className="mb-5 h-px w-full bg-white/20" />

            <p className="text-sm text-rose-100">
              Satu akun untuk memulai aktivitas Anda.
            </p>

            <p className="mt-2 text-xs text-rose-200">
              © {new Date().getFullYear()} Aplikasi Anda
            </p>
          </div>
        </section>

        {/* Right Panel */}
        <section className="flex items-center justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Brand */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-700 font-bold text-white">
                A
              </div>

              <div>
                <p className="font-bold text-slate-900">Aplikasi Anda</p>
                <p className="text-xs text-slate-500">Portal autentikasi</p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-rose-700">
                Selamat datang kembali
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Login ke akun
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Masukkan informasi akun Anda untuk melanjutkan.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-username" className={labelClass}>
                  Username atau Email
                </label>

                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Masukkan username atau email"
                  className={inputClass}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="login-password" className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    className={`${inputClass} pr-20`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-rose-700"
                  >
                    {showPassword ? "Sembunyikan" : "Lihat"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-error"
                  />
                  Ingat saya
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setError("Fitur lupa password belum diimplementasikan.")
                  }
                  className="font-semibold text-rose-700 hover:text-rose-800"
                >
                  Lupa password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-700/20 transition hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-700/20"
                disabled={isPending}
              >
                {isPending ? "Sedang Login..." : "Login"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

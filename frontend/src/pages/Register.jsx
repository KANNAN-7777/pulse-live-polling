import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#050505] px-6 py-16 text-white">

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[150px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#FFD21F 1px, transparent 1px), linear-gradient(90deg, #FFD21F 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-800 bg-[#090909]/95 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl lg:grid-cols-2">

        {/* LEFT */}

        <div className="relative hidden overflow-hidden border-r border-gray-800 bg-[#0c0c0c] p-12 lg:flex lg:flex-col lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 font-black text-black shadow-[0_0_30px_rgba(255,210,31,0.2)]">
                P
              </div>

              <div>
                <p className="font-bold tracking-[0.2em]">
                  PULSE
                </p>

                <p className="text-[9px] tracking-[0.2em] text-gray-600">
                  REAL-TIME POLLING
                </p>
              </div>

            </div>

            <div className="mt-20">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1.5 text-xs text-yellow-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
                JOIN PULSE
              </div>

              <h1 className="text-4xl font-black leading-tight">
                Start creating
                <span className="block text-yellow-400">
                  live polls.
                </span>
              </h1>

              <p className="mt-5 max-w-sm leading-7 text-gray-500">
                Build interactive polls, share them with your audience and
                see responses arrive in real time.
              </p>

            </div>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-xl border border-gray-800 bg-[#050505] p-4">
              <p className="text-xl font-bold text-yellow-400">LIVE</p>
              <p className="mt-1 text-xs text-gray-600">Updates</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#050505] p-4">
              <p className="text-xl font-bold">FAST</p>
              <p className="mt-1 text-xs text-gray-600">Responses</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#050505] p-4">
              <p className="text-xl font-bold">SAFE</p>
              <p className="mt-1 text-xs text-gray-600">Accounts</p>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="p-7 sm:p-10 lg:p-12">

          {/* MOBILE LOGO */}

          <div className="mb-8 flex items-center gap-3 lg:hidden">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 font-black text-black">
              P
            </div>

            <div>
              <p className="font-bold tracking-widest">
                PULSE
              </p>

              <p className="text-[9px] tracking-widest text-gray-600">
                REAL-TIME POLLING
              </p>
            </div>

          </div>

          <div className="mb-7">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Create account
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Join PULSE
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your account and start building live polls.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 text-sm text-yellow-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Full name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3.5 pr-16 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 transition hover:text-yellow-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Confirm password
              </label>

              <div className="relative">

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3.5 pr-16 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 transition hover:text-yellow-400"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* TERMS */}

            <label className="flex cursor-pointer items-start gap-3 pt-1 text-xs leading-5 text-gray-600">

              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 accent-yellow-400"
              />

              <span>
                I agree to use PULSE responsibly and keep my account
                information secure.
              </span>

            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 w-full rounded-xl bg-yellow-400 py-4 font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_0_35px_rgba(255,210,31,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <span className="flex items-center justify-center gap-2">

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}

              </span>

            </button>

          </form>

          {/* LOGIN */}

          <div className="mt-7 text-center">

            <p className="text-sm text-gray-600">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-yellow-400 transition hover:text-yellow-300"
              >
                Sign in
              </Link>

            </p>

          </div>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-700">
            <span>🔒</span>
            Secure account creation
          </div>

        </div>

      </div>

    </main>
  );
};

export default Register;
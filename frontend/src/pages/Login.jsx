import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const token =
        response.data.token ||
        response.data.access_token ||
        response.data.jwt;

      if (!token) {
        setError("Login successful, but token was not received.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 700);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#050505] px-6 py-16 text-white">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[140px]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#FFD21F 1px, transparent 1px), linear-gradient(90deg, #FFD21F 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* LOGIN CONTAINER */}

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-800 bg-[#090909]/95 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl lg:grid-cols-2">

        {/* LEFT SIDE */}

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
                LIVE PLATFORM
              </div>

              <h1 className="text-4xl font-black leading-tight">
                Welcome back to
                <span className="block text-yellow-400">
                  PULSE.
                </span>
              </h1>

              <p className="mt-5 max-w-sm leading-7 text-gray-500">
                Create polls, connect with your audience and watch responses
                happen in real time.
              </p>

            </div>

          </div>

          {/* MINI LIVE CARD */}

          <div className="mt-16 rounded-2xl border border-gray-800 bg-[#050505] p-5">

            <div className="flex items-center justify-between">

              <span className="text-xs text-gray-500">
                LIVE POLL
              </span>

              <span className="flex items-center gap-2 text-xs text-yellow-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                LIVE
              </span>

            </div>

            <p className="mt-4 font-semibold">
              Which technology do you prefer?
            </p>

            <div className="mt-5 space-y-3">

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>React</span>
                  <span className="text-yellow-400">42%</span>
                </div>

                <div className="h-1.5 rounded-full bg-gray-900">
                  <div className="h-full w-[42%] rounded-full bg-yellow-400" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Java</span>
                  <span className="text-gray-500">28%</span>
                </div>

                <div className="h-1.5 rounded-full bg-gray-900">
                  <div className="h-full w-[28%] rounded-full bg-gray-700" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Python</span>
                  <span className="text-gray-500">18%</span>
                </div>

                <div className="h-1.5 rounded-full bg-gray-900">
                  <div className="h-full w-[18%] rounded-full bg-gray-700" />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

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

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Account access
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to continue to PULSE.
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

          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email address
              </label>

              <div className="group relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-yellow-400">
                  @
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-800 bg-[#050505] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-yellow-400/50 focus:bg-[#080808] focus:ring-2 focus:ring-yellow-400/10"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-gray-600 transition hover:text-yellow-400"
                >
                  Forgot password?
                </button>

              </div>

              <div className="group relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-yellow-400">
                  •
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-800 bg-[#050505] py-3.5 pl-11 pr-14 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-yellow-400/50 focus:bg-[#080808] focus:ring-2 focus:ring-yellow-400/10"
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

            {/* REMEMBER */}

            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-500">

              <input
                type="checkbox"
                className="h-4 w-4 accent-yellow-400"
              />

              Remember me

            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-yellow-400 py-4 font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_0_35px_rgba(255,210,31,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <span className="relative z-10 flex items-center justify-center gap-2">

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}

              </span>

            </button>

          </form>

          {/* REGISTER */}

          <div className="mt-8 text-center">

            <p className="text-sm text-gray-600">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-yellow-400 transition hover:text-yellow-300"
              >
                Create one
              </Link>

            </p>

          </div>

          {/* SECURITY */}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-700">

            <span>🔒</span>
            Your account is protected

          </div>

        </div>

      </div>

    </main>
  );
};

export default Login;
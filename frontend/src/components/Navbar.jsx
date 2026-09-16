
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("authChanged", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("authChanged", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `relative transition-colors duration-300 ${
      isActive
        ? "text-yellow-400"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 font-black text-black shadow-[0_0_25px_rgba(250,204,21,0.2)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(250,204,21,0.4)]">
            P
          </div>

          <div>
            <div className="text-lg font-bold tracking-widest text-white">
              PULSE
            </div>

            <div className="text-[9px] tracking-[0.2em] text-gray-500">
              REAL-TIME POLLING
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {isLoggedIn && (
            <NavLink to="/dashboard" className={navLinkClass}>
              My Polls
            </NavLink>
          )}

          <a
            href="/#demo"
            className="text-gray-400 transition-colors duration-300 hover:text-white"
          >
            Demo
          </a>

          <a
            href="/#features"
            className="text-gray-400 transition-colors duration-300 hover:text-white"
          >
            Features
          </a>

          <a
            href="/#how-it-works"
            className="text-gray-400 transition-colors duration-300 hover:text-white"
          >
            How it works
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition-all duration-300 hover:bg-white/5 hover:text-white"
              >
                Log out
              </button>

              <Link
                to="/create"
                className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_0_25px_rgba(250,204,21,0.3)]"
              >
                Create Poll
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-yellow-400/40 hover:bg-yellow-400/5"
              >
                Sign up
              </Link>

              <Link
                to="/create"
                className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_0_25px_rgba(250,204,21,0.3)]"
              >
                Create Poll
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 text-gray-300 transition hover:border-yellow-400/40 hover:text-yellow-400 md:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-white/5 bg-[#080808] transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 px-6 py-5">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-yellow-400/10 text-yellow-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-yellow-400/10 text-yellow-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              My Polls
            </NavLink>
          )}

          <a
            href="/#demo"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-4 py-3 text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            Demo
          </a>

          <a
            href="/#features"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-4 py-3 text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            Features
          </a>

          <a
            href="/#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-4 py-3 text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            How it works
          </a>

          <div className="my-3 h-px bg-gray-800" />

          {isLoggedIn ? (
            <>
              <Link
                to="/create"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl bg-yellow-400 px-4 py-3 text-center font-bold text-black"
              >
                Create Poll
              </Link>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-gray-300 hover:bg-white/5"
              >
                Log in
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl border border-gray-800 px-4 py-3 text-center text-white"
              >
                Sign up
              </Link>

              <Link
                to="/create"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl bg-yellow-400 px-4 py-3 text-center font-bold text-black"
              >
                Create Poll
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;


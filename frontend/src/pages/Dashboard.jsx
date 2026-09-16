
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/polls/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPolls(response.data.polls || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your poll history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [navigate]);

  const filteredPolls = useMemo(() => {
    return polls.filter((poll) =>
      poll.question
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [polls, search]);

  const getTotalVotes = (poll) => {
    return (
      poll.options?.reduce(
        (total, option) => total + Number(option.votes || 0),
        0
      ) || 0
    );
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#292929] border-t-[#FFD21F] rounded-full animate-spin mx-auto mb-5" />
          <p className="text-gray-400">
            Loading your poll history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFD21F]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(#FFD21F_1px,transparent_1px),linear-gradient(90deg,#FFD21F_1px,transparent_1px)] bg-[size:70px_70px]" />

      <main className="relative max-w-7xl mx-auto px-5 py-10 sm:py-14">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <button
              onClick={() => navigate("/")}
              className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-[#FFD21F] transition"
            >
              ← Back to Home
            </button>

            <p className="text-[#FFD21F] text-xs font-bold tracking-[0.3em] uppercase mb-3">
              PULSE
            </p>

            <h1 className="text-4xl sm:text-5xl font-black">
              My Polls
            </h1>

            <p className="text-gray-500 mt-3">
              View and manage all your polls and poll history.
            </p>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#FFD21F] text-black font-black hover:bg-[#FFE66D] transition"
          >
            + Create New Poll
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-[#292929] bg-[#111111] p-5">
            <p className="text-xs text-gray-600 uppercase tracking-wider">
              Total Polls
            </p>

            <p className="text-3xl font-black mt-2">
              {polls.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#292929] bg-[#111111] p-5">
            <p className="text-xs text-gray-600 uppercase tracking-wider">
              Total Votes
            </p>

            <p className="text-3xl font-black mt-2 text-[#FFD21F]">
              {polls.reduce(
                (total, poll) => total + getTotalVotes(poll),
                0
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-[#292929] bg-[#111111] p-5 col-span-2 lg:col-span-1">
            <p className="text-xs text-gray-600 uppercase tracking-wider">
              Poll Activity
            </p>

            <p className="text-3xl font-black mt-2">
              Live
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your polls..."
              className="w-full bg-[#111111] border border-[#292929] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 outline-none focus:border-[#FFD21F]/60 transition"
            />

            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
              ⌕
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-red-400">
            {error}
          </div>
        )}

        {polls.length === 0 ? (
          <div className="rounded-[32px] border border-[#292929] bg-[#111111] p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#FFD21F]/10 border border-[#FFD21F]/20 flex items-center justify-center text-3xl text-[#FFD21F]">
              +
            </div>

            <h2 className="text-2xl font-bold mb-3">
              No polls yet
            </h2>

            <p className="text-gray-500 mb-8">
              Create your first poll to see it here.
            </p>

            <Link
              to="/create"
              className="inline-flex px-7 py-3 rounded-2xl bg-[#FFD21F] text-black font-black hover:bg-[#FFE66D] transition"
            >
              Create Your First Poll →
            </Link>
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="rounded-[32px] border border-[#292929] bg-[#111111] p-10 text-center">
            <h2 className="text-xl font-bold mb-2">
              No matching polls
            </h2>

            <p className="text-gray-500">
              Try a different search.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold">
                  Poll History
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  {filteredPolls.length}{" "}
                  {filteredPolls.length === 1
                    ? "poll"
                    : "polls"} found
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {filteredPolls.map((poll, index) => {
                const totalVotes = getTotalVotes(poll);

                return (
                  <div
                    key={poll.id || index}
                    className="rounded-[28px] border border-[#292929] bg-[#111111] p-6 sm:p-7 hover:border-[#FFD21F]/40 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD21F]/20 bg-[#FFD21F]/5 text-[#FFD21F] text-[10px] font-bold tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21F] animate-pulse" />
                            Live
                          </span>

                          <span className="text-xs text-gray-600">
                            Poll #{polls.length - index}
                          </span>

                          <span className="text-xs text-gray-700">
                            •
                          </span>

                          <span className="text-xs text-gray-600">
                            {formatDate(poll.created_at)}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-5">
                          {poll.question}
                        </h3>

                        <div className="flex flex-wrap gap-3">
                          <div className="rounded-xl bg-[#090909] border border-[#202020] px-4 py-3">
                            <span className="text-xs text-gray-600">
                              Options
                            </span>

                            <p className="font-bold mt-1">
                              {poll.options?.length || 0}
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#090909] border border-[#202020] px-4 py-3">
                            <span className="text-xs text-gray-600">
                              Votes
                            </span>

                            <p className="font-bold text-[#FFD21F] mt-1">
                              {totalVotes}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:w-44">
                        <Link
                          to={`/results/${poll.id}`}
                          className="flex items-center justify-center py-3 rounded-xl bg-[#FFD21F] text-black font-bold hover:bg-[#FFE66D] transition"
                        >
                          Results
                        </Link>

                        <Link
                          to={`/share/${poll.id}`}
                          className="flex items-center justify-center py-3 rounded-xl border border-[#292929] text-gray-300 font-semibold hover:border-[#FFD21F]/50 hover:text-[#FFD21F] transition"
                        >
                          Share
                        </Link>

                        <Link
                          to={`/vote/${poll.id}`}
                          className="flex items-center justify-center py-3 rounded-xl border border-[#292929] text-gray-500 font-semibold hover:border-[#FFD21F]/50 hover:text-[#FFD21F] transition"
                        >
                          Open Poll
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="text-center mt-12">
          <span className="text-xs text-gray-700">
            Powered by{" "}
            <span className="text-[#FFD21F] font-bold">
              PULSE
            </span>
            {" "}• Live Polling
          </span>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Vote() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await api.get(`/polls/${id}`);
        setPoll(response.data.poll || response.data);
      } catch (err) {
        setError("Unable to load this poll.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = async () => {
    if (!selected) {
      setError("Please select an option.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await api.post("/polls/vote", {
        poll_id: id,
        option_id: selected,
      });

      setMessage("Your vote has been submitted successfully.");
      setSelected("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit your vote."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#292929] border-t-[#FFD21F] rounded-full animate-spin mx-auto mb-5" />
          <p className="text-gray-400">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center bg-[#111111] border border-[#292929] rounded-3xl p-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center text-2xl">
            !
          </div>

          <h1 className="text-2xl font-bold mb-3">
            Poll unavailable
          </h1>

          <p className="text-gray-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FFD21F]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(#FFD21F_1px,transparent_1px),linear-gradient(90deg,#FFD21F_1px,transparent_1px)] bg-[size:70px_70px]" />

      <main className="relative min-h-screen flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-2xl">

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFD21F]/30 bg-[#FFD21F]/5 text-[#FFD21F] text-xs font-semibold tracking-widest">
              <span className="w-2 h-2 bg-[#FFD21F] rounded-full animate-pulse" />
              LIVE POLL
            </div>
          </div>

          <div className="bg-[#111111] border border-[#292929] rounded-[32px] p-6 sm:p-10 shadow-2xl">

            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-2">
                  PULSE
                </p>

                <p className="text-sm text-gray-500">
                  Cast your vote
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#FFD21F]">
                <span className="w-2 h-2 rounded-full bg-[#FFD21F] animate-pulse" />
                LIVE
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-10">
              {poll?.question}
            </h1>

            <div className="space-y-4">
              {poll?.options?.map((option, index) => {
                const isSelected = selected === option.id;

                return (
                  <button
                    key={option.id || index}
                    onClick={() => {
                      setSelected(option.id);
                      setError("");
                      setMessage("");
                    }}
                    className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 group ${
                      isSelected
                        ? "border-[#FFD21F] bg-[#FFD21F]/10 shadow-[0_0_30px_rgba(255,210,31,0.08)]"
                        : "border-[#292929] bg-[#090909] hover:border-[#FFD21F]/50 hover:bg-[#FFD21F]/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">

                      <div
                        className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-bold transition ${
                          isSelected
                            ? "bg-[#FFD21F] text-black"
                            : "bg-[#161616] text-gray-500 group-hover:text-[#FFD21F]"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>

                      <span
                        className={`flex-1 text-lg font-medium ${
                          isSelected
                            ? "text-white"
                            : "text-gray-300"
                        }`}
                      >
                        {option.text}
                      </span>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          isSelected
                            ? "border-[#FFD21F]"
                            : "border-[#3a3a3a] group-hover:border-[#FFD21F]/50"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#FFD21F]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-xl border border-[#FFD21F]/20 bg-[#FFD21F]/5 px-4 py-3 text-sm text-[#FFD21F]">
                ✓ {message}
              </div>
            )}

            <button
              onClick={handleVote}
              disabled={submitting}
              className="w-full mt-8 py-4 rounded-2xl bg-[#FFD21F] text-black font-black text-lg hover:bg-[#FFE66D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Vote →"}
            </button>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-600">
              <span>⚡</span>
              Votes update instantly in real time
            </div>
          </div>

          <div className="text-center mt-8">
            <span className="text-xs text-gray-700">
              Powered by{" "}
              <span className="text-[#FFD21F] font-bold">
                PULSE
              </span>
              {" "}• Live Polling
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Vote;
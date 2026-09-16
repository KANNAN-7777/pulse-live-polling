import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function Results() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState({});
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await api.get(`/polls/${id}`);
        const data = response.data.poll || response.data;

        setPoll(data);

        const initialVotes = {};

        data.options?.forEach((option) => {
          initialVotes[option.id] = option.votes || 0;
        });

        setVotes(initialVotes);
      } catch (err) {
        setError("Unable to load poll results.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();

    const protocol =
      window.location.protocol === "https:" ? "wss" : "ws";

    const socket = new WebSocket(
      `${protocol}://${window.location.hostname}:8080/api/polls/${id}/ws`
    );

    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);

        setVotes((current) => ({
          ...current,
          [update.option_id]: update.votes,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    socket.onerror = () => {
      setConnected(false);
    };

    socket.onclose = () => {
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [id]);

  const totalVotes = useMemo(() => {
    return Object.values(votes).reduce(
      (total, value) => total + value,
      0
    );
  }, [votes]);

  const leader = useMemo(() => {
    if (!poll?.options?.length) return null;

    return poll.options.reduce((best, option) => {
      const currentVotes = votes[option.id] || 0;
      const bestVotes = votes[best.id] || 0;

      return currentVotes > bestVotes ? option : best;
    }, poll.options[0]);
  }, [poll, votes]);

  const getPercentage = (optionId) => {
    if (!totalVotes) return 0;

    return Math.round(
      ((votes[optionId] || 0) / totalVotes) * 100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#292929] border-t-[#FFD21F] rounded-full animate-spin mx-auto mb-5" />
          <p className="text-gray-400">
            Loading live results...
          </p>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-5">
        <div className="bg-[#111111] border border-[#292929] rounded-3xl p-10 text-center max-w-md">
          <div className="text-red-400 text-4xl mb-5">!</div>

          <h1 className="text-2xl font-bold mb-3">
            Results unavailable
          </h1>

          <p className="text-gray-500">
            {error || "This poll could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">

      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#FFD21F]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(#FFD21F_1px,transparent_1px),linear-gradient(90deg,#FFD21F_1px,transparent_1px)] bg-[size:70px_70px]" />

      <main className="relative max-w-6xl mx-auto px-5 py-12">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">

          <div>
            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 rounded-xl bg-[#FFD21F] text-black flex items-center justify-center font-black">
                P
              </div>

              <span className="font-black tracking-[0.2em]">
                PULSE
              </span>

            </div>

            <div className="flex items-center gap-3">

              <h1 className="text-3xl md:text-4xl font-black">
                Live Results
              </h1>

              <span className="px-3 py-1 rounded-full bg-[#FFD21F]/10 border border-[#FFD21F]/20 text-[#FFD21F] text-xs font-bold">
                LIVE
              </span>

            </div>

            <p className="text-gray-500 mt-2">
              Watch the audience response update instantly.
            </p>
          </div>

          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
              connected
                ? "border-[#FFD21F]/20 bg-[#FFD21F]/5"
                : "border-red-500/20 bg-red-500/5"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connected
                  ? "bg-[#FFD21F] animate-pulse"
                  : "bg-red-400"
              }`}
            />

            <span
              className={`text-sm font-medium ${
                connected
                  ? "text-[#FFD21F]"
                  : "text-red-400"
              }`}
            >
              {connected
                ? "Real-time connected"
                : "Connection lost"}
            </span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#292929] rounded-3xl p-6 md:p-8 mb-6">

          <p className="text-xs text-gray-600 uppercase tracking-[0.25em] mb-3">
            Poll Question
          </p>

          <h2 className="text-2xl md:text-3xl font-bold leading-tight max-w-4xl">
            {poll.question}
          </h2>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

          <div className="bg-[#111111] border border-[#292929] rounded-2xl p-6">
            <p className="text-gray-500 text-sm mb-2">
              Total Votes
            </p>

            <p className="text-4xl font-black text-[#FFD21F]">
              {totalVotes}
            </p>

            <p className="text-xs text-gray-600 mt-2">
              Responses received
            </p>
          </div>

          <div className="bg-[#111111] border border-[#292929] rounded-2xl p-6">
            <p className="text-gray-500 text-sm mb-2">
              Options
            </p>

            <p className="text-4xl font-black">
              {poll.options?.length || 0}
            </p>

            <p className="text-xs text-gray-600 mt-2">
              Available choices
            </p>
          </div>

          <div className="bg-[#111111] border border-[#292929] rounded-2xl p-6 sm:col-span-2 lg:col-span-1">
            <p className="text-gray-500 text-sm mb-2">
              Leading Option
            </p>

            <p className="text-xl font-black truncate">
              {leader?.text || "-"}
            </p>

            <p className="text-xs text-[#FFD21F] mt-2">
              {leader ? `${getPercentage(leader.id)}% of votes` : ""}
            </p>
          </div>

        </div>

        <div className="bg-[#111111] border border-[#292929] rounded-3xl p-6 md:p-8">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-xl font-bold">
                Audience Breakdown
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                Results update automatically
              </p>
            </div>

            <div className="text-[#FFD21F] text-sm font-bold">
              {totalVotes} votes
            </div>

          </div>

          <div className="space-y-7">

            {poll.options?.map((option, index) => {
              const optionVotes = votes[option.id] || 0;
              const percentage = getPercentage(option.id);

              return (
                <div key={option.id}>

                  <div className="flex items-center justify-between mb-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <span className="w-9 h-9 shrink-0 rounded-lg bg-[#090909] border border-[#292929] flex items-center justify-center text-sm font-bold text-[#FFD21F]">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="font-semibold truncate">
                        {option.text}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 shrink-0">

                      <span className="text-gray-500 text-sm">
                        {optionVotes}{" "}
                        {optionVotes === 1 ? "vote" : "votes"}
                      </span>

                      <span className="text-[#FFD21F] font-black w-12 text-right">
                        {percentage}%
                      </span>

                    </div>

                  </div>

                  <div className="h-4 bg-[#090909] rounded-full overflow-hidden border border-[#1f1f1f]">

                    <div
                      className="h-full bg-[#FFD21F] rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <Link
            to={`/share/${id}`}
            className="flex-1 text-center py-4 rounded-2xl border border-[#292929] bg-[#111111] hover:border-[#FFD21F]/50 transition font-bold"
          >
            ← Share Poll
          </Link>

          <Link
            to="/create"
            className="flex-1 text-center py-4 rounded-2xl bg-[#FFD21F] text-black hover:bg-[#FFE66D] transition font-black"
          >
            Create Another Poll →
          </Link>

        </div>

        <div className="text-center mt-10">
          <p className="text-xs text-gray-700">
            PULSE • Real-time polling powered by Redis + WebSocket
          </p>
        </div>

      </main>
    </div>
  );
}

export default Results;
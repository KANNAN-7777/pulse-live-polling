import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import api from "../services/api";

function SharePoll() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const voteUrl = `${window.location.origin}/vote/${id}`;

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await api.get(`/polls/${id}`);
        setPoll(response.data.poll || response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(voteUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-[#FFD21F] text-lg animate-pulse">
          Loading poll...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD21F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFD21F]/30 bg-[#FFD21F]/5 text-[#FFD21F] text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFD21F] animate-pulse" />
            POLL CREATED SUCCESSFULLY
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Your poll is{" "}
            <span className="text-[#FFD21F]">live.</span>
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Share the link and start collecting responses in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-[#111111] border border-[#292929] rounded-3xl p-7 md:p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <span className="text-gray-500 text-sm uppercase tracking-widest">
                Your Question
              </span>

              <span className="flex items-center gap-2 text-xs text-[#FFD21F]">
                <span className="w-2 h-2 rounded-full bg-[#FFD21F] animate-pulse" />
                LIVE
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-8">
              {poll?.question || "Your poll question"}
            </h2>

            <div className="space-y-3">
              {poll?.options?.map((option, index) => (
                <div
                  key={option.id || index}
                  className="border border-[#292929] bg-[#090909] rounded-2xl px-5 py-4 flex items-center gap-4"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#FFD21F]/10 text-[#FFD21F] flex items-center justify-center font-bold">
                    {index + 1}
                  </span>

                  <span className="text-gray-200">
                    {option.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#292929] rounded-3xl p-7 md:p-10 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">
              Share your poll
            </h2>

            <p className="text-gray-500 text-sm mb-8 text-center">
              Scan the QR code or copy the link below.
            </p>

            <div className="bg-white p-5 rounded-2xl shadow-[0_0_50px_rgba(255,210,31,0.12)]">
              <QRCodeCanvas
                value={voteUrl}
                size={210}
                bgColor="#ffffff"
                fgColor="#050505"
                level="H"
              />
            </div>

            <div className="w-full mt-8">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Voting Link
              </label>

              <div className="mt-2 flex items-center bg-[#090909] border border-[#292929] rounded-xl overflow-hidden">
                <input
                  value={voteUrl}
                  readOnly
                  className="flex-1 min-w-0 bg-transparent px-4 py-4 text-gray-300 text-sm outline-none"
                />

                <button
                  onClick={copyLink}
                  className="px-5 py-4 bg-[#FFD21F] text-black font-bold hover:bg-[#FFE66D] transition"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <button
            onClick={() => navigate(`/vote/${id}`)}
            className="group bg-[#111111] border border-[#292929] hover:border-[#FFD21F]/50 rounded-2xl p-5 text-left transition"
          >
            <div className="text-[#FFD21F] text-2xl mb-3">↗</div>
            <h3 className="font-bold mb-1 group-hover:text-[#FFD21F] transition">
              Open Voting Page
            </h3>
            <p className="text-gray-500 text-sm">
              See what your audience will see.
            </p>
          </button>

          <button
            onClick={() => navigate(`/results/${id}`)}
            className="group bg-[#111111] border border-[#292929] hover:border-[#FFD21F]/50 rounded-2xl p-5 text-left transition"
          >
            <div className="text-[#FFD21F] text-2xl mb-3">◉</div>
            <h3 className="font-bold mb-1 group-hover:text-[#FFD21F] transition">
              View Live Results
            </h3>
            <p className="text-gray-500 text-sm">
              Watch votes update in real time.
            </p>
          </button>

          <Link
            to="/create"
            className="group bg-[#FFD21F] text-black rounded-2xl p-5 hover:bg-[#FFE66D] transition"
          >
            <div className="text-2xl mb-3">+</div>
            <h3 className="font-bold mb-1">
              Create Another Poll
            </h3>
            <p className="text-black/60 text-sm">
              Start a new live poll.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SharePoll;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;

    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const cleanQuestion = question.trim();
    const cleanOptions = options
      .map((option) => option.trim())
      .filter((option) => option !== "");

    if (!cleanQuestion) {
      setError("Please enter a poll question.");
      return;
    }

    if (cleanOptions.length < 2) {
      setError("Please add at least 2 options.");
      return;
    }

    if (new Set(cleanOptions.map((item) => item.toLowerCase())).size !== cleanOptions.length) {
      setError("Each option must be different.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/polls/",
        {
          question: cleanQuestion,
          options: cleanOptions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const poll = response.data.poll || response.data;

      const pollId = poll.id || poll._id;

      if (!pollId) {
        setError("Poll was created, but no poll ID was returned.");
        return;
      }

     navigate(`/share/${pollId}`);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create poll. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#050505] px-6 py-14 text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-400/8 blur-[140px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#FFD21F 1px, transparent 1px), linear-gradient(90deg, #FFD21F 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-12 text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-yellow-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
            Poll creator
          </div>

          <h1 className="text-4xl font-black sm:text-5xl">
            Create a live poll.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Ask a question, add your options and start collecting responses
            in real time.
          </p>

        </div>

        {/* CONTENT */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* FORM */}

          <div className="rounded-3xl border border-gray-800 bg-[#090909] p-7 shadow-2xl sm:p-10">

            <form onSubmit={handleSubmit}>

              {/* QUESTION */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-sm font-semibold text-gray-300">
                    Your question
                  </label>

                  <span className="text-xs text-gray-600">
                    {question.length}/150
                  </span>

                </div>

                <textarea
                  value={question}
                  onChange={(e) => {
                    if (e.target.value.length <= 150) {
                      setQuestion(e.target.value);
                    }
                    setError("");
                  }}
                  placeholder="What would you like to ask?"
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-gray-800 bg-[#050505] px-5 py-4 text-lg text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
                />

              </div>

              {/* OPTIONS */}

              <div className="mt-9">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <label className="text-sm font-semibold text-gray-300">
                      Answer options
                    </label>

                    <p className="mt-1 text-xs text-gray-600">
                      Add between 2 and 6 options.
                    </p>

                  </div>

                  <span className="rounded-full bg-gray-900 px-3 py-1 text-xs text-gray-500">
                    {options.length}/6
                  </span>

                </div>

                <div className="space-y-3">

                  {options.map((option, index) => (

                    <div
                      key={index}
                      className="group flex items-center gap-3"
                    >

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-800 bg-[#050505] text-sm font-bold text-yellow-400">
                        {String.fromCharCode(65 + index)}
                      </div>

                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updateOption(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className="min-w-0 flex-1 rounded-xl border border-gray-800 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
                      />

                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          ×
                        </button>
                      )}

                    </div>

                  ))}

                </div>

                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-4 rounded-xl border border-dashed border-gray-800 px-5 py-3 text-sm font-medium text-gray-500 transition-all duration-300 hover:border-yellow-400/40 hover:bg-yellow-400/5 hover:text-yellow-400"
                  >
                    + Add another option
                  </button>
                )}

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="group mt-8 w-full rounded-xl bg-yellow-400 py-4 font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_0_35px_rgba(255,210,31,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <span className="flex items-center justify-center gap-2">

                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Creating poll...
                    </>
                  ) : (
                    <>
                      Create Live Poll
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}

                </span>

              </button>

            </form>

          </div>

          {/* PREVIEW */}

          <div className="lg:sticky lg:top-28 lg:self-start">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold">
                  Live preview
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  This is how your poll will look.
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs text-yellow-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                LIVE
              </div>

            </div>

            <div className="rounded-3xl border border-yellow-400/10 bg-[#090909] p-6 shadow-2xl">

              {/* PREVIEW HEADER */}

              <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 font-black text-black">
                    P
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      PULSE
                    </p>

                    <p className="text-[9px] tracking-[0.2em] text-gray-600">
                      LIVE POLL
                    </p>
                  </div>

                </div>

              </div>

              {/* PREVIEW QUESTION */}

              <h2 className="text-xl font-bold leading-7">
                {question.trim() || "Your poll question will appear here"}
              </h2>

              {/* PREVIEW OPTIONS */}

              <div className="mt-6 space-y-3">

                {options.map((option, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-gray-800 bg-[#050505] p-4 transition-all duration-300 hover:border-yellow-400/30"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/10 text-xs font-bold text-yellow-400">
                        {String.fromCharCode(65 + index)}
                      </div>

                      <span className="truncate text-sm text-gray-300">
                        {option.trim() || `Option ${index + 1}`}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

              <div className="mt-6 border-t border-gray-800 pt-5">

                <div className="flex items-center justify-between text-xs text-gray-600">

                  <span>0 votes</span>

                  <span>Results update live</span>

                </div>

              </div>

            </div>

            {/* INFO CARDS */}

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-gray-900 bg-[#090909] p-4">

                <p className="text-lg">⚡</p>

                <p className="mt-2 text-sm font-semibold">
                  Real-time
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Instant results
                </p>

              </div>

              <div className="rounded-2xl border border-gray-900 bg-[#090909] p-4">

                <p className="text-lg">🔗</p>

                <p className="mt-2 text-sm font-semibold">
                  Shareable
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Easy sharing
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
};

export default CreatePoll;
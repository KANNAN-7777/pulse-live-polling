import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [selected, setSelected] = useState(0);
  const [voted, setVoted] = useState(false);
  const [liveUsers, setLiveUsers] = useState(1248);

  const options = [
    { name: "React", votes: 42 },
    { name: "Java", votes: 28 },
    { name: "Python", votes: 18 },
    { name: "Go", votes: 12 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers((value) => value + Math.floor(Math.random() * 3));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleVote = () => {
    setVoted(true);

    setTimeout(() => {
      setVoted(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* BACKGROUND EFFECTS */}

      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-yellow-400/5 blur-[140px]" />

        <div className="absolute right-[-200px] top-[500px] h-[500px] w-[500px] rounded-full bg-yellow-300/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#FFD21F 1px, transparent 1px), linear-gradient(90deg, #FFD21F 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      {/* HERO */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-20 lg:pt-28">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 text-sm text-yellow-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
              Real-time polling platform
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">

              Real-time polling.

              <span className="mt-2 block text-yellow-400">
                Made for everyone.
              </span>

            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
              Create polls, collect responses instantly, and watch your
              results change in real time. Simple, fast and interactive.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                to="/create"
                className="group flex items-center gap-3 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-[0_0_40px_rgba(255,210,31,0.25)]"
              >
                Create Poll

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#demo"
                className="rounded-xl border border-gray-800 bg-white/[0.02] px-7 py-4 font-semibold text-white transition-all duration-300 hover:border-yellow-400/40 hover:bg-yellow-400/5"
              >
                Try Live Demo
              </a>

            </div>

            {/* TRUST STATS */}

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6">

              <div>
                <p className="text-2xl font-bold text-white">Real-time</p>
                <p className="mt-1 text-sm text-gray-500">
                  Instant updates
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">Simple</p>
                <p className="mt-1 text-sm text-gray-500">
                  Easy to use
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">Secure</p>
                <p className="mt-1 text-sm text-gray-500">
                  Protected polls
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT POLL VISUAL */}

          <div className="relative mx-auto w-full max-w-xl">

            {/* Glow */}

            <div className="absolute inset-10 rounded-full bg-yellow-400/10 blur-[100px]" />

            {/* Main dashboard */}

            <div className="relative rounded-3xl border border-yellow-400/15 bg-[#0b0b0b]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl">

              {/* top bar */}

              <div className="mb-5 flex items-center justify-between border-b border-gray-800 pb-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 font-black text-black">
                    P
                  </div>

                  <div>
                    <p className="text-sm font-bold">PULSE</p>
                    <p className="text-[10px] tracking-widest text-gray-500">
                      LIVE POLL
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1.5 text-xs text-yellow-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                  LIVE
                </div>

              </div>

              {/* question */}

              <p className="mb-6 text-xl font-bold">
                Which technology do you prefer?
              </p>

              {/* options */}

              <div className="space-y-4">

                {options.map((option, index) => (

                  <button
                    key={option.name}
                    onClick={() => setSelected(index)}
                    className="group w-full text-left"
                  >

                    <div className="mb-2 flex justify-between text-sm">

                      <span
                        className={
                          selected === index
                            ? "font-semibold text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        {option.name}
                      </span>

                      <span className="text-gray-500">
                        {option.votes}%
                      </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-900">

                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          selected === index
                            ? "bg-yellow-400 shadow-[0_0_15px_rgba(255,210,31,0.5)]"
                            : "bg-gray-700 group-hover:bg-gray-600"
                        }`}
                        style={{
                          width: `${option.votes}%`,
                        }}
                      />

                    </div>

                  </button>

                ))}

              </div>

              {/* vote */}

              <button
                onClick={handleVote}
                className="mt-7 w-full rounded-xl bg-yellow-400 py-3.5 font-bold text-black transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_0_25px_rgba(255,210,31,0.25)]"
              >
                {voted ? "✓ Vote submitted!" : "Vote Now"}
              </button>

              {/* footer */}

              <div className="mt-5 flex items-center justify-between text-xs text-gray-500">

                <span>115 votes</span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
                  Updating live
                </span>

              </div>

            </div>

            {/* FLOATING CARD */}

            <div className="absolute -bottom-8 -left-8 hidden w-52 rounded-2xl border border-gray-800 bg-[#0b0b0b] p-4 shadow-2xl sm:block">

              <div className="flex items-center justify-between">

                <span className="text-xs text-gray-500">
                  LIVE USERS
                </span>

                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />

              </div>

              <p className="mt-2 text-2xl font-bold">
                {liveUsers.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-yellow-400">
                ↑ Active right now
              </p>

            </div>

            {/* FLOATING PULSE */}

            <div className="absolute -right-5 -top-8 hidden h-20 w-20 items-center justify-center rounded-2xl border border-yellow-400/20 bg-[#0b0b0b] shadow-[0_0_35px_rgba(255,210,31,0.1)] sm:flex">

              <div className="flex items-end gap-1">

                <span className="h-4 w-1 rounded-full bg-yellow-400" />
                <span className="h-7 w-1 rounded-full bg-yellow-400" />
                <span className="h-10 w-1 rounded-full bg-yellow-400" />
                <span className="h-6 w-1 rounded-full bg-yellow-400" />
                <span className="h-3 w-1 rounded-full bg-yellow-400" />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* DEMO */}

      <section
        id="demo"
        className="relative z-10 border-y border-gray-900 bg-[#080808] py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              Live experience
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              See every vote happen.
            </h2>

            <p className="mt-5 text-gray-500">
              PULSE keeps everyone synchronized with live results.
            </p>

          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-gray-800 bg-[#050505] p-6 shadow-2xl sm:p-10">

            <div className="mb-8 flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  LIVE POLL
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Which technology do you prefer?
                </h3>
              </div>

              <div className="rounded-full bg-yellow-400/10 px-4 py-2 text-xs font-semibold text-yellow-400">
                ● LIVE
              </div>

            </div>

            <div className="space-y-4">

              {options.map((option, index) => (

                <div
                  key={option.name}
                  className="rounded-2xl border border-gray-800 bg-[#0b0b0b] p-5 transition-all duration-300 hover:border-yellow-400/30"
                >

                  <div className="mb-3 flex justify-between">

                    <span className="font-medium">
                      {option.name}
                    </span>

                    <span className="font-bold text-yellow-400">
                      {option.votes}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-900">

                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all duration-1000"
                      style={{
                        width: `${option.votes}%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="relative z-10 px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              Powerful features
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Everything you need to run a live poll.
            </h2>

          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: "⚡",
                title: "Real-time updates",
                text: "Votes appear instantly without refreshing the page.",
              },
              {
                icon: "🔗",
                title: "Share instantly",
                text: "Share your poll with a simple link and let people join.",
              },
              {
                icon: "📊",
                title: "Live results",
                text: "Watch responses and vote percentages change in real time.",
              },
              {
                icon: "🔒",
                title: "Secure polling",
                text: "Authentication protects poll creation and management.",
              },
              {
                icon: "📱",
                title: "Responsive",
                text: "Create and participate in polls from any device.",
              },
              {
                icon: "🚀",
                title: "Fast & simple",
                text: "Designed to make live polling quick and effortless.",
              },
            ].map((feature) => (

              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-900 bg-[#090909] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/20 hover:bg-[#0d0d0d]"
              >

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-500">
                  {feature.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section
        id="how-it-works"
        className="border-y border-gray-900 bg-[#080808] px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              From idea to live results.
            </h2>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Create",
                text: "Write your question and add the options.",
              },
              {
                number: "02",
                title: "Share",
                text: "Send your unique poll link to your audience.",
              },
              {
                number: "03",
                title: "Watch",
                text: "See votes and results update live.",
              },
            ].map((step) => (

              <div
                key={step.number}
                className="relative rounded-2xl border border-gray-900 bg-[#050505] p-8"
              >

                <span className="text-5xl font-black text-yellow-400/20">
                  {step.number}
                </span>

                <h3 className="mt-5 text-2xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-500">
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="relative z-10 px-6 py-28">

        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-yellow-400/20 bg-[#0b0b0b] px-6 py-16 text-center shadow-[0_0_100px_rgba(255,210,31,0.05)] sm:px-12">

          <div className="absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[100px]" />

          <div className="relative">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black shadow-[0_0_30px_rgba(255,210,31,0.25)]">
              P
            </div>

            <h2 className="mt-7 text-4xl font-black sm:text-5xl">
              Ready to create your first poll?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-gray-500">
              Create a poll, share the link and watch your audience respond
              in real time.
            </p>

            <Link
              to="/create"
              className="mt-8 inline-flex rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-[0_0_35px_rgba(255,210,31,0.25)]"
            >
              Create Poll →
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-gray-900 bg-[#030303] px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 font-black text-black">
              P
            </div>

            <div>
              <p className="font-bold tracking-widest">
                PULSE
              </p>

              <p className="text-[9px] tracking-[0.2em] text-gray-600">
                REAL-TIME POLLING
              </p>
            </div>

          </div>

          <p className="text-sm text-gray-600">
            © 2026 PULSE. Live polling made simple.
          </p>

        </div>

      </footer>

    </main>
  );
};

export default Home;
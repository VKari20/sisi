import { useEffect, useState } from "react";
import { Link } from "react-router";
import MoneySummary from "../components/projects/MoneySummary";
import ProjectCard from "../components/projects/ProjectCard";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import StatusPill from "../components/shared/ui/StatusPill";
import { useFetch } from "../hooks/useFetch";
import { type Project, type Stats } from "../types";
import { PROJECT_STATUSES } from "../utils/constants";
import { formatNumber, formatShortKES } from "../utils/format";

const stories = [
  {
    tag: "WATER & SANITATION",
    title: "Closer water. More time for life.",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1200&q=85",
    alt: "Fresh water flowing into a basin",
  },
  {
    tag: "EDUCATION",
    title: "A better classroom opens doors.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85",
    alt: "Students learning in a classroom",
  },
  {
    tag: "ROADS & ACCESS",
    title: "Better connections. Bigger possibilities.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
    alt: "A landscape with a route through it",
  },
];

const gallery = [
  {
    title: "Places to learn",
    category: "EDUCATION",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    alt: "Students learning together",
  },
  {
    title: "Water within reach",
    category: "WATER",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=80",
    alt: "Clean water flowing",
  },
  {
    title: "Safer journeys",
    category: "ROADS",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    alt: "Open landscape",
  },
];

const Home = () => {
  const [activeStory, setActiveStory] = useState(0);

  const stats = useFetch<Stats>("/stats");
  const underway = useFetch<Project[]>("/projects?status=In%20Progress");

  const story = stories[activeStory];
  const byStatus = stats.data?.projects.byStatus;

  // Automatically rotate the hero story every 5.5 seconds.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStory((current) => (current + 1) % stories.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-8 md:gap-24">
      {/* 1. ROYAL BLUE HERO + OVERLAPPING PHOTO COLLAGE */}

      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#173f8a] text-white shadow-xl shadow-blue-950/15">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 size-72 rounded-full border-[34px] border-teal-300/15"
        />

        <div
          aria-hidden="true"
          className="absolute bottom-10 left-[38%] size-24 rotate-12 rounded-[2rem] bg-orange-400/20"
        />

        <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 md:py-14 lg:grid-cols-2 lg:px-14">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.18em] text-teal-100">
              <span className="size-2 rounded-full bg-orange-400" />
              Your community. Your future.
            </span>

            <h1 className="type-display mt-7 text-5xl leading-[.98] sm:text-6xl xl:text-7xl">
              Your neighbourhood.
              <br />
              <span className="text-teal-300">Your money.</span>
              <br />
              <span className="text-orange-300">Your say.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-50/90">
              Discover local ideas, follow projects and understand how public
              money is being used. Better communities begin when residents
              have a voice.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton
                to="/projects"
                title="Explore projects"
                variant="light"
              />

              <Link
                to="/participate"
                className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 font-bold transition hover:bg-white/10"
              >
                How participation works <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <p className="mt-6 text-sm text-blue-100/75">
              Ideas from the community · Projects you can follow · Spending
              made clearer
            </p>
          </div>

          {/* Three overlapping photographic prints */}

          <div
            className="relative mx-auto h-[340px] w-full max-w-[490px] sm:h-[410px] lg:h-[450px]"
            aria-label="Community project photo carousel"
          >
            <div className="absolute left-[5%] top-[12%] z-10 w-[48%] rotate-[-7deg] overflow-hidden rounded-[2rem_1rem_2rem_1rem] border-[5px] border-[#173f8a] bg-white shadow-2xl transition-transform duration-700">
              <img
                src={story.image}
                alt={story.alt}
                className="h-52 w-full object-cover sm:h-64"
              />

              <div className="bg-white p-3 text-slate-900 sm:p-4">
                <p className="text-[10px] font-black tracking-[.16em] text-teal-700">
                  {story.tag}
                </p>
                <p className="mt-1 font-extrabold leading-tight">
                  {story.title}
                </p>
              </div>
            </div>

            <div className="absolute right-[3%] top-[2%] z-20 w-[43%] rotate-[6deg] overflow-hidden rounded-[1rem_2rem_1rem_2rem] border-[5px] border-[#173f8a] shadow-2xl">
              <img
                src={gallery[1].image}
                alt={gallery[1].alt}
                className="h-36 w-full object-cover sm:h-44"
              />

              <div className="bg-teal-300 px-3 py-3 text-sm font-black text-[#102b54]">
                Ideas into impact
              </div>
            </div>

            <div className="absolute bottom-[2%] right-[7%] z-30 w-[49%] rotate-[-3deg] overflow-hidden rounded-[2rem_2rem_.75rem_2rem] border-[5px] border-[#173f8a] shadow-2xl">
              <img
                src={gallery[2].image}
                alt={gallery[2].alt}
                className="h-36 w-full object-cover sm:h-44"
              />

              <div className="bg-orange-300 px-3 py-3 text-sm font-black text-[#17294a]">
                Built around people
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-[8%] left-[2%] z-40 grid size-20 rotate-[-12deg] place-items-center rounded-[30%_70%_55%_45%] bg-teal-300 text-3xl text-[#12386f] shadow-lg"
            >
              ✳
            </div>

            {/* Manual carousel controls */}

            <div className="absolute bottom-0 left-[32%] z-40 flex gap-2 rounded-full bg-[#102e65]/90 px-3 py-2 backdrop-blur">
              {stories.map((item, index) => (
                <button
                  key={item.tag}
                  type="button"
                  aria-label={`Show story ${index + 1}: ${item.tag}`}
                  aria-pressed={activeStory === index}
                  onClick={() => setActiveStory(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeStory === index
                      ? "w-8 bg-orange-300"
                      : "w-2.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 bg-[#102f6a]/50 px-6 py-4 text-sm text-blue-100 sm:px-10 lg:px-14">
          <span>Small ideas can make a big difference.</span>

          <Link
            to="/projects/propose"
            className="font-bold text-white underline decoration-orange-300 decoration-2 underline-offset-4"
          >
            Share an idea →
          </Link>
        </div>
      </section>

      {/* 2. TEAL-BLUE PROJECT AND WARD DISCOVERY */}

      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#0d7778] p-6 text-white sm:p-9 lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 size-48 rounded-full border-[28px] border-white/10"
        />

        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-teal-100">
              From everyday needs to real progress
            </p>

            <h2 className="type-display mt-3 max-w-2xl text-4xl sm:text-5xl">
              Explore what’s happening around you.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Browse active projects and find your ward in one place. Every
              project has a place, a status and a story worth following.
            </p>
          </div>

          <Link
            to="/projects"
            className="rounded-full bg-white px-5 py-3 font-extrabold text-[#075c61] transition hover:-translate-y-0.5"
          >
            All projects ↗
          </Link>
        </div>

        {/* Visual category gallery */}

        <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
          {gallery.map((item, index) => (
            <Link
              to="/projects"
              key={item.category}
              className={`group relative isolate min-h-[220px] overflow-hidden bg-slate-900 ${
                index === 1
                  ? "rounded-[2.5rem_1rem_2.5rem_1rem] sm:translate-y-6"
                  : "rounded-[1rem_2.5rem_1rem_2.5rem]"
              }`}
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 -z-20 size-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

              <div className="flex min-h-[220px] flex-col justify-end p-5">
                <span className="text-xs font-black tracking-[.16em] text-teal-200">
                  {item.category}
                </span>

                <h3 className="type-display mt-2 text-2xl">
                  {item.title}
                </h3>

                <span className="mt-2 text-sm text-white/75">
                  Discover projects ↗
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Ward discovery + active projects in one section */}

        <div className="relative mt-10 grid gap-3 lg:grid-cols-[.75fr_1.25fr]">
          <div className="rounded-[1.5rem] bg-[#075d63] p-5">
            <p className="text-xs font-black uppercase tracking-[.16em] text-teal-200">
              Find your place
            </p>

            <h3 className="type-display mt-2 text-2xl">
              Your ward. Your priorities.
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/75">
              Explore local profiles, budgets and community needs.
            </p>

            <Link
              to="/wards"
              className="mt-4 inline-flex rounded-full border border-white/40 px-4 py-2 text-sm font-bold hover:bg-white/10"
            >
              Explore all wards ↗
            </Link>
          </div>

          <div className="rounded-[1.5rem] bg-white p-5 text-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-teal-700">
                  On the ground right now
                </p>

                <h3 className="type-display mt-2 text-2xl">
                  Projects in progress
                </h3>
              </div>

              <Link
                to="/projects?status=In%20Progress"
                className="text-sm font-bold text-blue-800 underline underline-offset-4"
              >
                See all →
              </Link>
            </div>

            {underway.error ? (
              <div className="mt-4">
                <ErrorMessage
                  message={underway.error}
                  onRetry={underway.refetch}
                />
              </div>
            ) : !underway.data ? (
              <div className="mt-4">
                <Loader label="Loading projects" />
              </div>
            ) : underway.data.length ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {underway.data.slice(0, 2).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                No projects are marked in progress yet. Explore proposals and
                completed work while updates come in.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. COMMUNITY STATISTICS */}

      <section
        aria-label="Sisi at a glance"
        className="relative overflow-hidden rounded-[2rem] bg-[#173f8a] p-6 text-white sm:p-9 lg:p-10"
      >
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 size-40 rotate-12 rounded-[35%_65%_62%_38%] border-2 border-orange-300/40"
        />

        <div className="relative mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-teal-200">
              The community pulse
            </p>

            <h2 className="type-display mt-2 text-3xl sm:text-4xl">
              Sisi at a glance.
            </h2>
          </div>

          <span className="text-sm text-blue-100/70">
            Numbers from the current platform data
          </span>
        </div>

        {stats.error ? (
          <ErrorMessage message={stats.error} onRetry={stats.refetch} />
        ) : !stats.data ? (
          <Loader label="Loading community activity" />
        ) : (
          <div className="relative grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Projects on the platform",
                value: formatNumber(stats.data.projects.total),
                note: "Ideas at different stages",
                symbol: "✳",
              },
              {
                label: "Budget tracked",
                value: formatShortKES(stats.data.budget.allocated),
                note: "Allocation and spending",
                symbol: "◉",
              },
              {
                label: "Community votes",
                value: formatNumber(stats.data.participation.votes),
                note: "Residents making views count",
                symbol: "↗",
              },
              {
                label: "Feedback shared",
                value: formatNumber(stats.data.participation.feedback),
                note: "Questions, observations and ideas",
                symbol: "✎",
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`border-white/20 py-5 sm:px-5 ${
                  index > 0 ? "sm:border-l" : ""
                } ${index > 1 ? "lg:border-l" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-blue-100">
                    {item.label}
                  </p>

                  <span className="text-2xl text-orange-300">
                    {item.symbol}
                  </span>
                </div>

                <p className="type-display mt-3 text-4xl sm:text-5xl">
                  {item.value}
                </p>

                <p className="mt-2 text-sm text-blue-100/70">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. PUBLIC MONEY EXPLAINER */}

      <section className="grid items-stretch gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#f6bd45] p-7 text-[#162e55] sm:p-9">
          <div
            aria-hidden="true"
            className="absolute -bottom-10 -right-8 size-36 rotate-12 rounded-[45%_55%_40%_60%] border-[18px] border-white/35"
          />

          <p className="relative text-xs font-black uppercase tracking-[.2em]">
            Follow the public money
          </p>

          <h2 className="type-display relative mt-3 text-4xl sm:text-5xl">
            Where does the money go?
          </h2>

          <p className="relative mt-4 leading-7">
            Budgets can feel complicated. Start with what was allocated, what
            has been spent and which projects are moving forward.
          </p>

          <div className="relative mt-6 rounded-2xl bg-white/60 p-4">
            <p className="font-extrabold">
              A simple way to read the numbers
            </p>

            <ol className="mt-3 space-y-2 text-sm">
              <li>
                <span className="mr-2 font-black">01</span>
                Check the allocated budget.
              </li>
              <li>
                <span className="mr-2 font-black">02</span>
                Compare it with reported spending.
              </li>
              <li>
                <span className="mr-2 font-black">03</span>
                Check project status and milestones.
              </li>
            </ol>
          </div>

          <Link
            to="/projects/monitoring"
            className="relative mt-6 inline-flex rounded-full bg-[#173f8a] px-5 py-3 font-bold text-white hover:bg-[#102f6a]"
          >
            Explore spending ↗
          </Link>
        </div>

        <div className="rounded-[2rem] border border-line bg-surface p-5 sm:p-7">
          {stats.data ? (
            <>
              <MoneySummary stats={stats.data} />

              <div className="mt-5 rounded-2xl bg-surface-raised p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-extrabold">
                    Projects at each stage
                  </h3>

                  <span className="text-xs text-muted">
                    Current platform data
                  </span>
                </div>

                <ul className="mt-3 divide-y divide-line">
                  {PROJECT_STATUSES.map((status) => (
                    <li
                      key={status}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <StatusPill status={status} />

                      <span className="font-bold tabular-nums">
                        {byStatus?.[status] ?? 0}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-xs leading-5 text-muted">
                These figures reflect the current Sisi demo data. Check
                official county records and public notices for real-world
                decisions.
              </p>
            </>
          ) : (
            <div className="py-10">
              <Loader label="Loading budget information" />
            </div>
          )}
        </div>
      </section>

      {/* 5. KENYA FACTS + CIVIC EDUCATION */}

      <section className="grid gap-7 lg:grid-cols-[.7fr_1.3fr]">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#073e3e] p-7 text-white sm:p-9">
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-8 size-32 rounded-full border-[20px] border-teal-300/20"
          />

          <p className="relative text-xs font-black uppercase tracking-[.2em] text-teal-200">
            Kenya facts · Civic know-how
          </p>

          <h2 className="type-display relative mt-3 text-4xl sm:text-5xl">
            Know your power.
          </h2>

          <p className="relative mt-4 leading-7 text-white/75">
            Public participation gives people a chance to shape decisions
            between elections, using local knowledge to raise priorities and
            ask questions.
          </p>

          <div className="relative mt-8 flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-[35%_65%_50%_50%] bg-orange-300 text-3xl text-slate-900">
              ✦
            </div>

            <div>
              <p className="font-extrabold">Did you know?</p>

              <p className="mt-1 text-sm leading-6 text-white/70">
                Article 201(a) says public finance should promote openness and
                accountability, including public participation in financial
                matters.
              </p>
            </div>
          </div>

          <p className="relative mt-4 text-xs font-bold uppercase tracking-wider text-teal-200">
            Constitution of Kenya · Article 201(a)
          </p>

          <Link
            to="/participate"
            className="relative mt-6 inline-flex font-bold text-white underline decoration-orange-300 decoration-2 underline-offset-4"
          >
            Learn how to participate →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="relative overflow-hidden rounded-[2rem] bg-[#e6f6f2] p-6 text-[#173f50] sm:p-7">
            <span className="inline-grid size-12 rotate-[-8deg] place-items-center rounded-[35%_65%_40%_60%] bg-teal-300 text-2xl">
              ↗
            </span>

            <h3 className="type-display mt-5 text-2xl">
              Explain it simply
            </h3>

            <p className="mt-3 leading-7">
              A ward is a local electoral area. Explore ward profiles to see
              the needs, project information and budget figures available for
              that community.
            </p>

            <Link
              to="/wards"
              className="mt-4 inline-flex font-bold text-teal-800 underline underline-offset-4"
            >
              Explore wards →
            </Link>
          </article>

          <article className="relative overflow-hidden rounded-[2rem] bg-[#fce7c2] p-6 text-[#563b20] sm:p-7">
            <span className="inline-grid size-12 rotate-[8deg] place-items-center rounded-full bg-orange-400 text-2xl">
              ◎
            </span>

            <h3 className="type-display mt-5 text-2xl">
              Follow a project
            </h3>

            <p className="mt-3 leading-7">
              Ideas can move through stages: proposal, review, approval,
              implementation and completion. Check updates and milestones as
              they become available.
            </p>

            <Link
              to="/projects/monitoring"
              className="mt-4 inline-flex font-bold underline decoration-orange-600 underline-offset-4"
            >
              Track progress →
            </Link>
          </article>

          <article className="rounded-[2rem] bg-surface-raised p-6 sm:col-span-2 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-teal">
                Make your voice useful
              </p>

              <h3 className="type-display mt-2 text-2xl">
                Be specific. Be constructive. Be heard.
              </h3>

              <p className="mt-2 max-w-xl leading-7 text-muted">
                Mention the location, what you noticed and how it affects
                people. Clear feedback gives the community and decision-makers
                something concrete to discuss.
              </p>
            </div>

            <Link
              to="/participate"
              className="mt-4 inline-flex shrink-0 rounded-full bg-[#173f8a] px-5 py-3 font-bold text-white sm:mt-0"
            >
              Join the conversation ↗
            </Link>
          </article>
        </div>
      </section>

      {/* 6. PEOPLE-POWERED CLOSING SECTION */}

      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#173f8a] p-7 text-white sm:p-10 lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 size-64 rotate-12 rounded-[42%_58%_60%_40%] border-[28px] border-teal-300/15"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-orange-300">
              People-powered progress
            </p>

            <h2 className="type-display mt-3 max-w-2xl text-4xl sm:text-5xl">
              Small ideas. Shared action. Stronger communities.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-blue-100/80">
              You know your neighbourhood best. Bring what you know into the
              conversation, support ideas that matter and follow the work as
              it happens.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton
                to="/projects/propose"
                title="Share a project idea"
                variant="light"
              />

              <Link
                to="/participate"
                className="inline-flex items-center rounded-full border border-white/35 px-5 py-3 font-bold hover:bg-white/10"
              >
                Get involved ↗
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="rotate-[-5deg] rounded-[2rem_1rem_2rem_1rem] bg-teal-300 p-5 text-[#123d56] shadow-xl">
              <p className="text-xs font-black uppercase tracking-[.2em]">
                Your community knows
              </p>

              <p className="type-display mt-3 text-3xl">
                What needs fixing. What could flourish.
              </p>
            </div>

            <div className="absolute -bottom-5 -right-2 rotate-[7deg] rounded-[1rem_2rem_1rem_2rem] bg-orange-300 px-5 py-4 font-black text-[#263452] shadow-xl">
              Let’s build it together ↗
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
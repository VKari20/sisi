
import { Link } from "react-router";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import { useFetch } from "../hooks/useFetch";
import { type County, type Ward } from "../types";
import { formatNumber } from "../utils/format";

const principles = [
  {
    number: "01",
    title: "People first.",
    text: "Residents know their communities. Their experiences should help shape local priorities.",
    accent: "bg-[#d9f4eb]",
    numberColor: "text-[#087e76]",
  },
  {
    number: "02",
    title: "Keep it open.",
    text: "Make project information easier to find, understand and follow.",
    accent: "bg-[#ffedc5]",
    numberColor: "text-[#a85a13]",
  },
  {
    number: "03",
    title: "Stay involved.",
    text: "Participation should continue from the first idea to project updates and feedback.",
    accent: "bg-[#e2eaff]",
    numberColor: "text-[#244a9a]",
  },
];

const wardImages = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
];

const AboutUs = () => {
  const { data: county, error, refetch } = useFetch<County>("/county");
  const {
    data: wards,
    error: wardsError,
    refetch: refetchWards,
  } = useFetch<Ward[]>("/wards");

  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!county) return <Loader label="Loading SISI information" />;

  const facts = [
    { label: "County headquarters", value: county.headquarters },
    { label: "Residents represented", value: formatNumber(county.population) },
    { label: "Land area", value: `${formatNumber(county.areaKm2)} km²` },
    { label: "Wards", value: wards ? String(wards.length) : "—" },
  ];

  return (
    <main className="flex flex-col gap-16 pb-10 md:gap-24">
      {/* EDITORIAL HERO */}
<section className="relative isolate overflow-hidden rounded-[2rem] bg-[#fff8e9] text-[#172d3d] shadow-sm dark:bg-[#172c37] dark:text-white">
  <div
    aria-hidden="true"
    className="absolute -right-16 -top-20 size-72 rounded-full border-[36px] border-[#f2b94b]/20"
  />

  <div className="relative grid items-center gap-8 px-7 py-12 sm:px-10 sm:py-16 lg:min-h-[420px] lg:grid-cols-[1.2fr_.8fr] lg:gap-12 lg:px-16 lg:py-20">
  {/* LEFT: Heading and introduction */}
  <div>
    <div className="flex items-center gap-3">
      <span className="h-1 w-10 rounded-full bg-[#e6a329]" />
      <p className="text-xs font-black uppercase tracking-[.22em] text-[#087e76] dark:text-teal-300">
        Meet SISI · Your voice matters
      </p>
    </div>

    <h1 className="type-display mt-7 max-w-xl text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
      Public decisions should start with{" "}
      <span className="relative inline-block text-[#087e76] dark:text-teal-300">
        the people.
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-2 w-[85%] -rotate-2 rounded-full bg-[#f2b94b]/70"
        />
      </span>
    </h1>

    <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
      SISI brings community ideas, county projects and public-spending
      information closer to the people they affect.
    </p>
  </div>

  {/* RIGHT: Actions — no panel or illustration */}
  <div className="flex flex-col items-start justify-center lg:pl-4">
    <p className="max-w-xs text-lg font-bold leading-7 text-[#172d3d] dark:text-white sm:text-xl">
      Your community. Your ideas. Your say in what happens next.
    </p>

    <div className="mt-6 flex flex-wrap gap-3">
      <LinkButton
        to="/projects"
        title="Explore projects"
        variant="light"
      />

      <Link
        to="/participate"
        className="inline-flex items-center rounded-full border border-[#173f8a]/25 px-5 py-3 font-bold text-[#173f8a] transition hover:bg-[#173f8a]/5 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
      >
        How participation works ↗
      </Link>
    </div>

    <p className="mt-8 text-xs font-black uppercase tracking-[.16em] text-slate-500 dark:text-slate-400">
      Informed people. Stronger communities.
    </p>
  </div>
</div>
</section>

      {/* KENYAN CIVIC FACT: LIGHTBULB EDITORIAL FEATURE */}
      <section className="grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-stretch">
        <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#087e76] p-7 text-white sm:p-9">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[.2em] text-teal-100">
              Did you know?
            </span>
            <span className="grid size-14 place-items-center rounded-full bg-[#f2b94b] text-3xl text-[#263452]">
              💡
            </span>
          </div>
          <div className="relative mt-8">
            <p className="type-display text-5xl sm:text-6xl">201(a)</p>
            <p className="mt-3 max-w-xs text-lg font-bold leading-7">
              Public participation is part of Kenya’s public-finance principles.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-14 -right-10 size-40 rounded-full border-[20px] border-white/10"
          />
        </div>

        <div className="flex flex-col justify-center rounded-[2rem] border border-line bg-surface p-7 sm:p-9 lg:p-11">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#087e76]">
            Know your rights
          </p>
          <h2 className="type-display mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
            The Constitution makes room for your voice.
          </h2>
          <blockquote className="mt-5 border-l-4 border-[#f2b94b] pl-5 text-lg leading-8 text-muted">
            Article 201(a) of the Constitution of Kenya sets out the principle
            of openness and accountability, including public participation in
            financial matters.
          </blockquote>
          <p className="mt-5 leading-7 text-muted">
            In everyday terms, decisions about public money should not feel
            distant or impossible to understand. People should have meaningful
            opportunities to engage with the choices that affect their lives.
          </p>
          <Link
            to="/participate"
            className="mt-6 inline-flex w-fit items-center gap-2 font-bold text-[#173f8a] underline decoration-[#f2b94b] decoration-2 underline-offset-4 dark:text-blue-300"
          >
            Learn how participation works ↗
          </Link>
        </div>
      </section>

      {/* OUR APPROACH COMES BEFORE WHY WE EXIST */}
      <section>
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#087e76]">
            Our approach
          </p>
          <h2 className="type-display mt-4 text-4xl leading-tight sm:text-5xl">
            Make participation practical.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
            We focus on three things that help turn community voices into
            informed, ongoing participation.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className={`rounded-[2rem] ${principle.accent} p-6 text-[#172d3d] transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-8`}
            >
              <span className={`type-display text-5xl ${principle.numberColor}`}>
                {principle.number}
              </span>
              <div className="mt-8 h-px w-full bg-black/10" />
              <h3 className="mt-5 text-2xl font-extrabold">
                {principle.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-700">
                {principle.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* WHY WE EXIST: SHORTER AND MORE DIRECT */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#173f8a] p-7 text-white sm:p-10 lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 size-64 rounded-full border-[32px] border-teal-300/10"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-orange-300">
              Why we exist
            </p>
            <h2 className="type-display mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">
              Because local knowledge should count.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/90">
              You know what your neighbourhood needs. SISI helps connect that
              knowledge to project ideas, public information and progress
              updates—so it is easier to follow what is happening and have
              your say.
            </p>
          </div>

          <div className="relative rounded-[2rem_1rem_2rem_1rem] bg-white/10 p-6 backdrop-blur-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.2em] text-teal-200">
              From everyday experience
            </p>
            <div className="mt-5 flex flex-col gap-4">
              {[
                "A road that needs attention.",
                "A clinic or market that needs better facilities.",
                "A project you want to understand.",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-300 font-black text-[#263452]">
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-6 text-white/90">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/20 pt-5 text-sm font-semibold text-teal-100">
              Your experience is a starting point.
            </div>
          </div>
        </div>
      </section>

      {/* COUNTY SNAPSHOT */}
      <section className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#087e76]">
            Your county at a glance
          </p>
          <h2 className="type-display mt-4 text-4xl leading-tight sm:text-5xl">
            Participation starts close to home.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-muted">
            Every county has its own communities, priorities and local context.
            Here is a snapshot of {county.name} on SISI.
          </p>
        </div>

        <aside className="rounded-[2rem] bg-[#e6f6f2] p-5 text-[#173f50] dark:bg-[#123b3b] dark:text-white sm:p-7">
          <p className="text-sm font-bold uppercase tracking-wider text-[#087e76] dark:text-teal-300">
            {county.name}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={`rounded-[1.25rem] p-4 sm:p-5 ${
                  index % 2 === 0
                    ? "bg-white/80 dark:bg-white/10"
                    : "bg-[#d1eee6] dark:bg-white/5"
                }`}
              >
                <dt className="text-sm text-slate-600 dark:text-slate-300">
                  {fact.label}
                </dt>
                <dd className="mt-2 break-words text-xl font-extrabold leading-tight sm:text-2xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs leading-5 text-slate-600 dark:text-slate-300">
            These figures come from the current SISI demo dataset. They are
            illustrative and should not be treated as official county
            statistics.
          </p>
        </aside>
      </section>

      {/* WARD DISCOVERY */}
      <section className="rounded-[2rem] bg-surface-raised p-5 sm:p-8 lg:p-10">
        <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#087e76]">
              Local by design
            </p>
            <h2 className="type-display mt-4 text-4xl leading-tight sm:text-5xl">
              Every ward has a story.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              Explore your ward to discover its local context and find projects
              that matter to the people who live there.
            </p>
            <div className="mt-6">
              <LinkButton to="/wards" title="Explore all wards" />
            </div>
          </div>

          <div>
            {wardsError ? (
              <ErrorMessage message={wardsError} onRetry={refetchWards} />
            ) : !wards ? (
              <Loader label="Loading wards" />
            ) : wards.length === 0 ? (
              <p className="rounded-2xl border border-line bg-surface p-6 text-muted">
                Ward information is not available yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {wards.map((ward, index) => (
                  <Link
                    key={ward.id}
                    to={`/wards/${ward.id}`}
                    className="group overflow-hidden rounded-[1.5rem] border border-line bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-36 overflow-hidden bg-surface-raised">
                      <img
                        src={wardImages[index % wardImages.length]}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#173f8a]">
                        WARD PROFILE
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold transition group-hover:text-[#087e76]">
                          {ward.name}
                        </h3>
                        <span
                          className="text-[#087e76]"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {ward.description}
                      </p>
                      <p className="mt-4 text-sm font-bold">
                        {formatNumber(ward.population)} residents
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#173f8a] p-7 text-white sm:p-10 lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-10 size-56 rounded-full border-[30px] border-teal-300/10"
        />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[.22em] text-orange-300">
              The conversation starts with you
            </p>
            <h2 className="type-display mt-4 text-4xl leading-tight sm:text-5xl">
              Have a say in what happens next.
            </h2>
            <p className="mt-4 leading-7 text-blue-100/85">
              Explore projects, share an idea or ask us a question. Your
              perspective belongs here.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <LinkButton
              to="/projects/propose"
              title="Propose a project"
              variant="light"
            />
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-white/35 px-5 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Contact SISI ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;

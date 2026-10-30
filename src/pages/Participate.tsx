
import { useState, type SubmitEvent } from "react";
import { Link, useSearchParams } from "react-router";
import MoneySummary from "../components/projects/MoneySummary";
import ProjectCard from "../components/projects/ProjectCard";
import WardSpending from "../components/projects/WardSpending";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import SelectField from "../components/shared/ui/SelectField";
import TextAreaField from "../components/shared/ui/TextAreaField";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { type Feedback, type Project, type Stats } from "../types";
import { api } from "../utils/api";
import { projectPath } from "../utils/paths";

const tabs = [
  { id: "vote", label: "Vote on proposals", number: "01" },
  { id: "money", label: "Follow the money", number: "02" },
  { id: "feedback", label: "Give feedback", number: "03" },
];

// ---------- Vote ----------
const VoteTab = () => {
  const {
    data: proposals,
    error,
    refetch,
  } = useFetch<Project[]>("/projects?status=Pending");

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  if (!proposals) {
    return <Loader label="Loading proposals" />;
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#e5f4f0] p-6 dark:bg-[#173b3b] sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-12 size-36 rounded-full border-[20px] border-[#087e76]/10"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#087e76] dark:text-teal-300">
              Your voice counts
            </p>

            <h2 className="type-display mt-3 text-3xl leading-tight text-[#173f3b] dark:text-white sm:text-4xl">
              What should your county build next?
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
              Explore proposals from your community. Support the ideas you
              believe in or reject those you don't.
            </p>
          </div>

          <Link
            to="/projects/propose"
            className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-[#087e76] px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#06685f] sm:self-auto"
          >
            Propose a project <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#087e76]/15 pt-4 text-sm font-semibold text-[#17675f] dark:text-teal-200">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#087e76]" />
            Community-led ideas
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#e6a329]" />
            Public participation
          </span>
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-line px-6 py-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e5f4f0] text-2xl text-[#087e76] dark:bg-[#173b3b] dark:text-teal-300">
            <span aria-hidden="true">✳</span>
          </div>

          <h3 className="mt-4 text-xl font-bold text-ink">
            No proposals to vote on just yet
          </h3>

          <p className="mx-auto mt-2 max-w-md leading-7 text-muted">
            Have an idea that could make a difference in your community?
            Start a proposal and get the conversation going.
          </p>

          <div className="mt-5 flex justify-center">
            <LinkButton to="/projects/propose" title="Propose a project" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#087e76] dark:text-teal-300">
                Open for your input
              </p>
              <h3 className="mt-1 text-2xl font-bold text-ink">
                Proposals from the community
              </h3>
            </div>

            <span className="rounded-full bg-[#173f8a]/8 px-4 py-2 text-sm font-bold text-[#173f8a] dark:bg-blue-300/10 dark:text-blue-200">
              {proposals.length}{" "}
              {proposals.length === 1 ? "proposal" : "proposals"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proposals.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ---------- Money ----------
const MoneyTab = () => {
  const { data: stats, error, refetch } = useFetch<Stats>("/stats");

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  if (!stats) {
    return <Loader label="Loading spending" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-[#fff0c9] p-6 text-[#263452] dark:bg-[#403721] dark:text-white sm:p-9">
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-10 size-40 rounded-full border-[24px] border-[#e6a329]/20"
        />

        <div className="relative max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#805512] dark:text-amber-300">
            Public money, public knowledge
          </p>

          <h2 className="type-display mt-3 text-3xl leading-tight sm:text-4xl">
            Follow every shilling.
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-slate-700 dark:text-slate-200">
            Understand how county funds are being used and explore spending
            across wards. Public budgets should be easier for everyone to
            understand.
          </p>
        </div>

        <div className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-[#624717] dark:bg-black/20 dark:text-amber-200">
          <span aria-hidden="true">↘</span>
          From budgets to projects
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0 rounded-[1.5rem] border border-line bg-surface p-5 sm:p-7">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#087e76] dark:text-teal-300">
              The big picture
            </p>
            <h3 className="mt-2 text-xl font-bold text-ink">
              County spending summary
            </h3>
          </div>

          <MoneySummary stats={stats} />
        </div>

        <div className="min-w-0 rounded-[1.5rem] border border-line bg-surface p-5 sm:p-7">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#173f8a] dark:text-blue-300">
              Closer to home
            </p>
            <h3 className="mt-2 text-xl font-bold text-ink">
              Spending by ward
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Explore how reported spending differs across communities.
            </p>
          </div>

          <WardSpending byWard={stats.byWard} />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#173f8a] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <h3 className="text-xl font-bold sm:text-2xl">
            Want to see where the money goes?
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Explore individual projects and their reported budgets, spending
            and progress.
          </p>
        </div>

        <Link
          to="/projects/monitoring"
          className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-white px-5 py-3 font-bold text-[#173f8a] transition hover:-translate-y-0.5 hover:bg-[#fff0c9]"
        >
          Explore project spending <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
};

// ---------- Feedback ----------
const FeedbackTab = () => {
  const { user, checking } = useAuth();
  const { data: projects } = useFetch<Project[]>("/projects");
  const { values, handleChange, setValues } = useForm({
    projectId: "",
    name: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [postedOn, setPostedOn] = useState<Project | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setPostedOn(null);

    try {
      await api<Feedback>(`/projects/${values.projectId}/feedback`, {
        method: "POST",
        body: {
          message: values.message,
          name: user ? user.name : values.name,
        },
      });

      setPostedOn(
        projects?.find(
          (project) => project.id === Number(values.projectId),
        ) ?? null,
      );

      setValues((prev) => ({ ...prev, message: "" }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-[#173f8a] p-6 text-white sm:p-9">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-14 size-44 rounded-full border-[28px] border-white/10"
        />

        <div className="relative max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[.2em] text-amber-300">
            Your experience matters
          </p>

          <h2 className="type-display mt-3 text-3xl leading-tight sm:text-4xl">
            Seen something? Say something.
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-blue-100">
            Share what is happening on the ground. Clear, specific feedback
            helps make project discussions more useful.
          </p>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2 text-sm font-semibold">
          <span className="rounded-full bg-white/10 px-4 py-2">
            Your community
          </span>
          <span className="rounded-full bg-white/10 px-4 py-2">
            Your experience
          </span>
          <span className="rounded-full bg-white/10 px-4 py-2">
            Your voice
          </span>
        </div>
      </section>

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
        <form
          onSubmit={handleSubmit}
          className="flex min-w-0 flex-col gap-5 rounded-[1.5rem] border border-line bg-surface p-5 sm:p-8"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#087e76] dark:text-teal-300">
              Tell us what you think
            </p>
            <h3 className="mt-2 text-2xl font-bold text-ink">
              Share your feedback
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Choose a project and describe what you have seen or experienced.
            </p>
          </div>

          <SelectField
            label="Project"
            name="projectId"
            value={values.projectId}
            onChange={handleChange}
            required
          >
            <option value="">Choose a project</option>
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title} ({project.ward.name})
              </option>
            ))}
          </SelectField>

          <TextAreaField
            label="Your feedback"
            name="message"
            value={values.message}
            onChange={handleChange}
            placeholder="What's working, what isn't, and what should change?"
            rows={5}
            required
          />

          {user ? (
            <p className="text-sm text-muted">
              Posting as{" "}
              <strong className="text-ink">{user.name}</strong>
            </p>
          ) : checking ? null : (
            <InputField
              label="Your name (optional)"
              name="name"
              value={values.name}
              onChange={handleChange}
              hint="Leave this blank to post anonymously."
            />
          )}

          {error && <ErrorMessage message={error} />}

          {postedOn && (
            <p
              role="status"
              className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-950 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-100"
            >
              <strong>Feedback submitted!</strong> Your feedback was posted
              on {postedOn.title}.{" "}
              <Link
                to={`${projectPath(postedOn)}#feedback`}
                className="font-bold underline underline-offset-4"
              >
                View project feedback ↗
              </Link>
            </p>
          )}

          <PrimaryButton
            type="submit"
            title={sending ? "Posting..." : "Submit feedback ↗"}
            disabled={sending}
            className="self-start"
          />
        </form>

        <aside className="flex flex-col gap-5">
          <div className="rounded-[1.5rem] bg-[#e5f4f0] p-6 dark:bg-[#173b3b]">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#087e76] text-xl text-white">
              <span aria-hidden="true">✳</span>
            </span>

            <h3 className="mt-4 text-lg font-bold text-[#173f3b] dark:text-white">
              Make your feedback count
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Useful feedback gives people enough detail to understand the
              issue and where it happened.
            </p>

            <ul className="mt-4 flex flex-col gap-3 text-sm leading-6 text-[#245b55] dark:text-teal-100">
              <li className="flex gap-2">
                <span className="font-black">01</span>
                Be specific about the location.
              </li>
              <li className="flex gap-2">
                <span className="font-black">02</span>
                Describe what happened and when.
              </li>
              <li className="flex gap-2">
                <span className="font-black">03</span>
                Suggest what could be improved.
              </li>
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-line p-6">
            <h3 className="font-bold text-ink">
              Everyone should have a voice.
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              You can share feedback without an account. If you are signed in,
              your name is used automatically.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

// ---------- Participate page ----------
const Participate = () => {
  // Preserve direct links such as /participate?tab=money.
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab =
    tabs.find((tab) => tab.id === searchParams.get("tab"))?.id ?? "vote";

  return (
    <main className="flex flex-col gap-8 pb-8 sm:gap-10">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#173f8a] px-6 py-10 text-white shadow-sm sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 size-64 rounded-full border-[38px] border-white/10 sm:size-80"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 right-[28%] size-36 rounded-full bg-teal-300/10"
        />

        <div className="relative grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-1 w-10 rounded-full bg-[#f2b94b]" />
              <p className="text-xs font-black uppercase tracking-[.22em] text-teal-200">
                Public participation · SISI
              </p>
            </div>

            <h1 className="type-display mt-6 max-w-2xl text-4xl leading-[1.03] sm:text-5xl lg:text-7xl">
              Have your say.{" "}
              <span className="text-[#f2b94b]">Shape what comes next.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
              Vote on community proposals, follow county spending, and share
              what you see on the ground. Public decisions should include the
              people they affect.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end lg:pb-1">
            <p className="max-w-sm text-lg font-semibold leading-7 text-white sm:text-xl lg:text-right">
              Your community. Your ideas. Your voice in the conversation.
            </p>

            <a
              href="#participation-options"
              className="inline-flex items-center gap-3 rounded-full bg-[#f2b94b] px-5 py-3 font-bold text-[#263452] transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Find your way in <span aria-hidden="true">↓</span>
            </a>

            <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-200 lg:text-right">
              Informed people. Stronger communities.
            </p>
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <section id="participation-options" className="scroll-mt-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#087e76] dark:text-teal-300">
              Three ways to participate
            </p>
            <h2 className="type-display mt-2 text-2xl text-ink sm:text-3xl">
              Your voice, your choice.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted">
            Choose what you want to do today. You can switch between these
            options at any time.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Ways to take part"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="participate-panel"
                onClick={() =>
                  setSearchParams({ tab: tab.id }, { replace: true })
                }
                className={`group flex min-h-[88px] items-center justify-between gap-4 rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 sm:p-5 ${
                  selected
                    ? "border-[#087e76] bg-[#087e76] text-white shadow-lg shadow-teal-900/10"
                    : "border-line bg-surface text-ink hover:border-[#087e76]/50"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      selected
                        ? "bg-white/15 text-white"
                        : "bg-[#087e76]/10 text-[#087e76] dark:text-teal-300"
                    }`}
                  >
                    {tab.number}
                  </span>

                  <span className="font-bold leading-snug">{tab.label}</span>
                </span>

                <span
                  aria-hidden="true"
                  className={`shrink-0 text-xl transition-transform duration-200 group-hover:translate-x-1 ${
                    selected
                      ? "translate-x-1 text-[#f2b94b]"
                      : "text-[#087e76] dark:text-teal-300"
                  }`}
                >
                  ↗
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active tab content */}
      <section
        role="tabpanel"
        id="participate-panel"
        aria-labelledby={`tab-${activeTab}`}
        className="min-w-0"
      >
        {activeTab === "vote" && <VoteTab />}
        {activeTab === "money" && <MoneyTab />}
        {activeTab === "feedback" && <FeedbackTab />}
      </section>

      {/* Civic participation reminder */}
      <section className="relative overflow-hidden rounded-[1.5rem] border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#087e76] dark:text-teal-300">
              Participation doesn't stop here
            </p>
            <h2 className="type-display mt-2 text-2xl text-ink sm:text-3xl">
              Stay curious. Stay involved.
            </h2>
            <p className="mt-3 leading-7 text-muted">
              Learn about projects in your area and keep asking how public
              decisions are made.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full border border-[#173f8a]/25 px-5 py-3 font-bold text-[#173f8a] transition hover:bg-[#173f8a]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 sm:self-center"
          >
            Explore projects <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Participate;

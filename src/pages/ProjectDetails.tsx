
import { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router";
import FeedbackSection from "../components/projects/FeedbackSection";
import MilestoneList from "../components/projects/MilestoneList";
import ProjectCover from "../components/projects/ProjectCover";
import VoteButtons from "../components/projects/VoteButtons";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import ProgressBar from "../components/shared/ui/ProgressBar";
import StatusPill from "../components/shared/ui/StatusPill";
import { useFetch } from "../hooks/useFetch";
import { type Project } from "../types";
import { formatDate, formatKES, isFunded } from "../utils/format";
import { projectPath } from "../utils/paths";

const ProjectDetails = () => {
  const { id, slug } = useParams();
  const location = useLocation();

  const {
    data: project,
    loading,
    error,
    refetch,
  } = useFetch<Project>(`/projects/${id}`);

  const justProposed = (
    location.state as { justProposed?: boolean } | null
  )?.justProposed;

  useEffect(() => {
    if (project && location.hash === "#feedback") {
      document.getElementById("feedback")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [project, location.hash]);

  if (loading) return <Loader label="Loading project" />;

  if (error || !project) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 py-12">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-tea">
          Project details
        </span>

        <h1 className="type-display text-4xl md:text-5xl">
          This project couldn't be loaded.
        </h1>

        <p className="max-w-lg leading-relaxed text-muted">
          Something went wrong while retrieving this project. Try again or
          return to the project directory.
        </p>

        <ErrorMessage message={error} onRetry={refetch} />

        <LinkButton
          to="/projects"
          title="See all projects"
          variant="outline"
        />
      </div>
    );
  }

  if (slug !== project.slug) {
    return (
      <Navigate
        to={projectPath(project) + location.hash}
        replace
      />
    );
  }

  const funded = isFunded(project.status);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 pb-16">
      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm font-bold text-tea transition-colors hover:text-tea-dark"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          All projects
        </Link>

        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Community project
        </span>
      </div>

      {/* Proposal confirmation */}
      {justProposed && (
        <div
          role="status"
          className="rounded-2xl border border-tea/20 bg-tea-light p-5 md:p-6"
        >
          <p className="font-bold text-tea-dark">
            Your proposal is in!
          </p>
          <p className="mt-1 text-sm leading-relaxed text-tea-dark/80">
            It stays Pending until the county reviews it. Residents can vote
            on it now.
          </p>
        </div>
      )}

      {/* Project heading */}
      <header className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={project.status} />

          <span className="text-sm text-muted">
            {project.category}
          </span>

          <span className="text-muted">·</span>

          <Link
            to={`/wards/${project.ward.id}`}
            className="text-sm font-semibold text-tea underline-offset-4 hover:underline"
          >
            {project.ward.name} ward
          </Link>
        </div>

        <h1 className="type-display mt-5 text-4xl leading-[1.05] md:text-6xl">
          {project.title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
          {project.summary}
        </p>
      </header>

      {/* Project artwork */}
      <div className="relative">
        <ProjectCover
          project={project}
          className="h-48 overflow-hidden rounded-[1.5rem] md:h-72 md:rounded-[2rem]"
        />

        <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/30 bg-ink/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
          {project.category}
        </div>
      </div>

      {/* Main content */}
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">

        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-12">

          {/* Overview */}
          <section className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
                The project
              </p>

              <h2 className="type-display mt-2 text-3xl md:text-4xl">
                What this is about
              </h2>
            </div>

            <p className="max-w-prose whitespace-pre-line text-base leading-[1.9] text-ink/80 md:text-lg">
              {project.description || project.summary}
            </p>

            <dl className="grid gap-6 border-y border-line py-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">
                  Ward
                </dt>
                <dd className="mt-2">
                  <Link
                    to={`/wards/${project.ward.id}`}
                    className="font-bold text-tea hover:underline"
                  >
                    {project.ward.name}
                  </Link>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">
                  Proposed by
                </dt>
                <dd className="mt-2 font-semibold">
                  {project.proposedBy}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">
                  Date proposed
                </dt>
                <dd className="mt-2 font-semibold">
                  {formatDate(project.createdAt)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Milestones */}
          {project.milestones.length > 0 && (
            <section className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
                  On the ground
                </p>

                <h2 className="type-display mt-2 text-3xl md:text-4xl">
                  Project milestones
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Follow the key stages of this project and see what has
                  been completed.
                </p>
              </div>

              <MilestoneList milestones={project.milestones} />
            </section>
          )}

          {/* Feedback */}
          <section
            id="feedback"
            className="scroll-mt-24 border-t border-line pt-10"
          >
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
                Have your say
              </p>

              <h2 className="type-display mt-2 text-3xl md:text-4xl">
                Community feedback
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Share your experience, raise a concern, or let the community
                know what you think about this project.
              </p>
            </div>

            <FeedbackSection projectId={project.id} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="order-first flex flex-col gap-5 self-start lg:sticky lg:top-24 lg:order-none">

          {/* Financial summary */}
          <section className="overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-sm">
            <div className="bg-tea px-6 py-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Project snapshot
              </p>

              <h2 className="type-display mt-2 text-2xl">
                Money & progress
              </h2>
            </div>

            <div className="flex flex-col gap-5 p-6">
              {funded ? (
                <>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs font-semibold text-muted">
                        Approved budget
                      </p>
                      <p className="mt-1 text-lg font-bold tabular-nums">
                        {formatKES(project.budget)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted">
                        Money spent
                      </p>
                      <p className="mt-1 text-lg font-bold tabular-nums">
                        {formatKES(project.spent)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-line pt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold">
                        Physical progress
                      </span>

                      <span className="text-lg font-bold text-tea tabular-nums">
                        {project.progress}%
                      </span>
                    </div>

                    <ProgressBar
                      value={project.progress}
                      size="lg"
                      label={`${project.progress}% built`}
                    />

                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      Progress reflects project implementation, not money
                      spent.
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-4 border-t border-line pt-5">
                    <div>
                      <dt className="text-xs font-semibold text-muted">
                        Start date
                      </dt>
                      <dd className="mt-1 text-sm font-semibold">
                        {formatDate(project.startDate)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-semibold text-muted">
                        Expected finish
                      </dt>
                      <dd className="mt-1 text-sm font-semibold">
                        {formatDate(project.endDate)}
                      </dd>
                    </div>
                  </dl>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-semibold text-muted">
                      {project.status === "Rejected"
                        ? "Budget requested"
                        : "Proposed budget"}
                    </p>

                    <p className="mt-2 type-display text-3xl tabular-nums">
                      {formatKES(project.budget)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-tea-light p-4">
                    <p className="text-sm leading-relaxed text-tea-dark">
                      {project.status === "Rejected"
                        ? "This proposal was not approved. The requested amount was not committed."
                        : "This is a proposed amount. No project funding is committed until the county approves it."}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Voting */}
          <section className="flex flex-col gap-4 rounded-[1.5rem] border border-line bg-surface p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
                Your voice matters
              </p>

              <h2 className="type-display mt-2 text-2xl">
                What do you think?
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted">
                Support or reject this project. Your vote helps show what
                residents think.
              </p>
            </div>

            <VoteButtons
              projectId={project.id}
              initialVotes={project.votes}
            />

            <p className="text-xs leading-relaxed text-muted">
              You need to be logged in to vote. You can change your vote later.
            </p>
          </section>

          {/* Related navigation */}
          <Link
            to="/projects"
            className="group flex items-center justify-between rounded-xl bg-[#F4EBDD] px-5 py-4 text-sm font-bold text-ink transition-colors hover:bg-[#EDE0CC]"
          >
            <span>Explore other projects</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default ProjectDetails;


import { Link, useParams } from "react-router";
import ProjectCard from "../components/projects/ProjectCard";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import LinkButton from "../components/shared/ui/LinkButton";
import Contours from "../components/shared/ui/Contours";
import Loader from "../components/shared/ui/Loader";
import { useFetch } from "../hooks/useFetch";
import { type WardDetail } from "../types";
import { formatKES, formatNumber } from "../utils/format";

const WardDetails = () => {
  const { id } = useParams();

  const {
    data: ward,
    loading,
    error,
    refetch,
  } = useFetch<WardDetail>(`/wards/${id}`);

  if (loading) return <Loader label="Loading ward" />;

  if (error || !ward) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
          Ward directory
        </p>

        <h1 className="type-display text-4xl md:text-5xl">
          This ward couldn't be loaded.
        </h1>

        <p className="max-w-lg leading-relaxed text-muted">
          We couldn't retrieve this ward's information. Try again
          or return to the ward directory.
        </p>

        <ErrorMessage message={error} onRetry={refetch} />

        <LinkButton
          to="/wards"
          title="See all wards"
          variant="outline"
        />
      </div>
    );
  }

  const facts = [
    {
      label: "Residents",
      value: formatNumber(ward.population),
    },
    {
      label: "Area",
      value: `${ward.areaKm2} km²`,
    },
    {
      label: "Projects",
      value: String(ward.projectCount),
    },
    {
      label: "Money committed",
      value: formatKES(ward.budget),
    },
    {
      label: "Money spent",
      value: formatKES(ward.spent),
    },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 pb-16">

      {/* Back navigation */}
      <Link
        to="/wards"
        className="group inline-flex self-start items-center gap-2 text-sm font-bold text-tea transition-colors hover:text-tea-dark"
      >
        <span className="transition-transform group-hover:-translate-x-1">
          ←
        </span>
        All wards
      </Link>

      {/* Ward identity */}
      <header className="relative isolate overflow-hidden rounded-[1.75rem] bg-tea-dark text-white">
        <Contours
          seed={ward.id + 10}
          className="absolute inset-0 size-full text-white/10"
        />

        <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">
              Sisi County · Ward profile
            </p>

            <h1 className="type-display mt-5 text-5xl leading-[1.05] md:text-7xl">
              {ward.name}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {ward.description}
            </p>

            <Link
              to="/projects"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-tea-dark transition-transform hover:-translate-y-0.5"
            >
              Explore county projects <span>↗</span>
            </Link>
          </div>

          <div className="relative hidden lg:block">
            <div className="flex size-36 items-center justify-center rounded-full border border-white/20 bg-white/10 text-center backdrop-blur-sm">
              <div>
                <p className="type-display text-5xl">
                  {ward.projectCount}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                  Projects
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ward statistics */}
        <dl className="relative grid grid-cols-2 border-t border-white/15 sm:grid-cols-3 lg:grid-cols-5">
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className={`px-5 py-5 md:px-7 ${
                index > 0 ? "border-l border-white/15" : ""
              }`}
            >
              <dt className="text-xs leading-relaxed text-white/65">
                {fact.label}
              </dt>

              <dd className="mt-2 break-words text-base font-bold tabular-nums md:text-lg">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Projects */}
      <section className="flex flex-col gap-7">
        <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
              What's happening here
            </p>

            <h2 className="type-display mt-2 text-3xl md:text-4xl">
              Projects in {ward.name}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              Follow local development and see how public projects
              are progressing.
            </p>
          </div>

          <LinkButton
            to="/projects/propose"
            title="Propose a project"
            variant="outline"
          />
        </div>

        {ward.projects.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-line bg-surface px-6 py-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
              Your community needs your voice
            </p>

            <h3 className="type-display mt-3 text-2xl md:text-3xl">
              No projects in {ward.name} yet.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Have an idea that could improve this ward? Be the
              first to put it forward.
            </p>

            <div className="mt-6">
              <LinkButton
                to="/projects/propose"
                title="Propose the first project"
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted">
              Showing{" "}
              <strong className="text-ink">
                {ward.projects.length}
              </strong>{" "}
              {ward.projects.length === 1 ? "project" : "projects"}
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ward.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Closing section */}
      <section className="rounded-[1.75rem] bg-[#F4EBDD] p-7 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
          Stay involved
        </p>

        <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="type-display text-3xl md:text-4xl">
              Your ward. Your say. Your future.
            </h2>

            <p className="mt-3 leading-relaxed text-muted">
              Public participation starts with people who care
              about what happens in their communities.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 md:self-auto"
          >
            Take part <span>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WardDetails;

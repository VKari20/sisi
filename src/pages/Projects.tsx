
import { useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import ProjectCard from "../components/projects/ProjectCard";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import LinkButton from "../components/shared/ui/LinkButton";
import Loader from "../components/shared/ui/Loader";
import SelectField from "../components/shared/ui/SelectField";
import { useFetch } from "../hooks/useFetch";
import { type Project, type Ward } from "../types";
import { CATEGORIES, PROJECT_STATUSES } from "../utils/constants";

type SortOption = "newest" | "most-supported" | "highest-budget" | "most-progress";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "most-supported", label: "Most supported" },
  { value: "highest-budget", label: "Highest budget" },
  { value: "most-progress", label: "Most progress" },
];

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: projects, loading, error, refetch } = useFetch<Project[]>(
    `/projects?${searchParams}`,
  );

  const { data: wards } = useFetch<Ward[]>("/wards");

  const status = searchParams.get("status") ?? "";
  const wardId = searchParams.get("wardId") ?? "";
  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";

  const sort = (searchParams.get("sort") as SortOption) || "newest";

  const hasFilters = Boolean(status || wardId || category || q);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    ["status", "wardId", "category", "q"].forEach((key) => {
      next.delete(key);
    });

    setSearchParams(next, { replace: true });
  };

  const sortedProjects = useMemo(() => {
    if (!projects) return [];

    return [...projects].sort((a, b) => {
      switch (sort) {
        case "most-supported":
          return b.votes.support - a.votes.support;

        case "highest-budget":
          return b.budget - a.budget;

        case "most-progress":
          return b.progress - a.progress;

        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });
  }, [projects, sort]);

  const selectedWard = wards?.find(
    (ward) => String(ward.id) === wardId,
  );

  const activeFilters = [
    q && {
      key: "q",
      label: `Search: ${q}`,
    },
    selectedWard && {
      key: "wardId",
      label: selectedWard.name,
    },
    category && {
      key: "category",
      label: category,
    },
    status && {
      key: "status",
      label: status,
    },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="flex flex-col gap-8">

      {/* Compact page introduction */}
      <section className="relative overflow-hidden rounded-[2rem] bg-tea px-6 py-9 text-white md:px-10 md:py-12">
        <div className="pointer-events-none absolute -right-12 -top-16 size-64 rounded-full border-[35px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 size-52 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Sisi / Community projects
            </p>

            <h1 className="type-display text-4xl leading-tight md:text-5xl">
              Your community. Your priorities. Your projects.
            </h1>

            <p className="mt-4 max-w-xl leading-relaxed text-white/80">
              Discover development projects, make your voice heard and
              follow how public funds are being used in your community.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <LinkButton
              to="/projects/propose"
              title="Propose a project ↗"
              variant="light"
            />

            <Link
              to="/projects/monitoring"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Follow the money ↗
            </Link>
          </div>
        </div>

        <div className="relative mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-5 text-sm text-white/70">
          <span>Discover. Participate. Hold leaders accountable.</span>
          <span className="font-bold tracking-widest">SISI.</span>
        </div>
      </section>

      {/* Search and filters */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-tea">
            Find what matters
          </p>
          <h2 className="type-display text-2xl md:text-3xl">
            Explore community projects
          </h2>
          <p className="text-sm text-muted">
            Search by project, location, category or development stage.
          </p>
        </div>

        <div className="grid gap-4 rounded-2xl border border-line bg-surface p-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <InputField
            label="Search projects"
            type="search"
            value={q}
            onChange={(e) => setFilter("q", e.target.value)}
            placeholder="Borehole, road, market..."
          />

          <SelectField
            label="Ward"
            value={wardId}
            onChange={(e) => setFilter("wardId", e.target.value)}
          >
            <option value="">All wards</option>
            {wards?.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Category"
            value={category}
            onChange={(e) => setFilter("category", e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </SelectField>
        </div>

        {/* Project status filters */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Explore by project stage
          </p>

          <div
            role="group"
            aria-label="Filter by project stage"
            className="flex flex-wrap gap-2"
          >
            {["", ...PROJECT_STATUSES].map((value) => (
              <button
                key={value || "all"}
                type="button"
                onClick={() => setFilter("status", value)}
                aria-pressed={status === value}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  status === value
                    ? "border-tea bg-tea text-white"
                    : "border-line bg-surface text-muted hover:border-tea hover:text-tea"
                }`}
              >
                {value || "All stages"}
              </button>
            ))}
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-muted">
              Applied filters:
            </span>

            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setFilter(filter.key, "")}
                aria-label={`Remove ${filter.label} filter`}
                className="inline-flex items-center gap-2 rounded-full bg-tea-light px-3 py-1.5 text-sm font-semibold text-tea-dark transition hover:bg-tea/15"
              >
                {filter.label}
                <span aria-hidden="true">×</span>
              </button>
            ))}

            <button
              type="button"
              onClick={clearFilters}
              className="px-2 py-1 text-sm font-semibold text-royal underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* Results */}
      {error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !projects ? (
        <Loader label="Loading projects" />
      ) : (
        <section
          aria-busy={loading}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-tea">
                Community development
              </p>

              <h2 className="type-display mt-1 text-2xl">
                {projects.length === 0
                  ? "No projects found"
                  : "Projects to explore"}
              </h2>

              <p className="mt-1 text-sm text-muted" role="status">
                {loading
                  ? "Updating projects..."
                  : `${projects.length} ${
                      projects.length === 1 ? "project" : "projects"
                    } found`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="project-sort"
                className="whitespace-nowrap text-sm font-semibold text-muted"
              >
                Sort by
              </label>

              <select
                id="project-sort"
                value={sort}
                onChange={(e) => setFilter("sort", e.target.value)}
                className="min-w-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold outline-none transition focus:border-tea"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-surface px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-tea-light text-2xl text-tea-dark">
                <span>⌕</span>
              </div>

              <h3 className="type-display text-2xl">
                Nothing here just yet.
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
                We couldn't find projects matching your search. Try
                adjusting your filters or share an idea of your own.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-lg border border-tea px-5 py-2.5 font-semibold text-tea transition hover:bg-tea-light"
                  >
                    Clear filters
                  </button>
                )}

                <LinkButton
                  to="/projects/propose"
                  title="Propose a project"
                />
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-6 transition-opacity md:grid-cols-2 lg:grid-cols-3 ${
                loading ? "opacity-60" : ""
              }`}
            >
              {sortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Closing participation prompt */}
      <section className="relative overflow-hidden rounded-2xl bg-[#F4EBDD] p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-tea">
            Your voice matters
          </p>

          <h2 className="type-display mt-2 text-2xl text-ink md:text-3xl">
            Have an idea that could make your ward better?
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            Good community projects start with people who understand
            their community's needs. Share your idea with Sisi.
          </p>
        </div>

        <div className="mt-5 shrink-0 md:mt-0">
          <LinkButton
            to="/projects/propose"
            title="Share your idea ↗"
          />
        </div>
      </section>
    </div>
  );
};

export default Projects;


import { Link } from "react-router";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import Loader from "../components/shared/ui/Loader";
import WardDisplayCard from "../components/wards/WardDisplayCard";
import { useFetch } from "../hooks/useFetch";
import { type Ward } from "../types";

const Wards = () => {
  const { data: wards, loading, error, refetch } =
    useFetch<Ward[]>("/wards");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 pb-16">

      {/* Page introduction */}
      <header className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-tea">
            Your community, your voice
          </p>

          <h1 className="type-display mt-3 text-4xl leading-tight md:text-6xl">
            Explore your <span className="text-tea">ward.</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Get to know the communities that make up Sisi County.
            Explore local projects, follow public spending, and see
            what's happening where you live.
          </p>
        </div>

        <Link
          to="/projects"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-line px-5 py-3 text-sm font-bold transition-colors hover:border-tea hover:text-tea md:self-auto"
        >
          Explore projects <span>↗</span>
        </Link>
      </header>

      {/* Ward directory */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              The county directory
            </p>
            <h2 className="type-display mt-2 text-2xl md:text-3xl">
              Find your ward
            </h2>
          </div>

          {wards && (
            <span className="rounded-full bg-tea-light px-4 py-2 text-sm font-bold text-tea-dark">
              {wards.length} wards
            </span>
          )}
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : loading || !wards ? (
          <Loader label="Loading wards" />
        ) : wards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <h3 className="type-display text-2xl">
              No wards to display yet
            </h3>
            <p className="mt-2 text-sm text-muted">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {wards.map((ward, index) => (
              <div
                key={ward.id}
                className={index % 2 === 1 ? "md:translate-y-6" : ""}
              >
                <WardDisplayCard ward={ward} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Closing invitation */}
      <section className="relative mt-4 overflow-hidden rounded-[1.75rem] bg-[#F4EBDD] p-7 md:p-10">
        <div className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full border-[24px] border-tea/10" />

        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea">
            Get involved
          </p>

          <h2 className="type-display mt-3 text-3xl md:text-4xl">
            Change starts close to home.
          </h2>

          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            Explore projects in your ward, share your views, and
            take part in decisions that shape your community.
          </p>

          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Discover community projects <span>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Wards;

import { useState, type SubmitEvent } from "react";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import Loader from "../components/shared/ui/Loader";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import TextAreaField from "../components/shared/ui/TextAreaField";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { type County } from "../types";
import { api } from "../utils/api";

const ContactUs = () => {
  const { user, checking } = useAuth();
  const {
    data: county,
    error: countyError,
    refetch,
  } = useFetch<County>("/county");
  const { values, handleChange, reset } = useForm({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState<{
    message: string;
    ticketId: number;
  } | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      // Logged-in users don't see the name and email fields, so use their account details.
      const body = user
        ? { ...values, name: user.name, email: user.email }
        : values;
      const result = await api<{ message: string; ticketId: number }>(
        "/contact",
        { method: "POST", body },
      );
      setReply(result);
      reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-8 md:gap-20">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#173f8a] p-7 text-white shadow-xl shadow-blue-950/10 sm:p-10 lg:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-20 size-64 rotate-12 rounded-[42%_58%_60%_40%] border-[28px] border-teal-300/15"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 left-[38%] size-32 rotate-12 rounded-[35%_65%_45%_55%] bg-orange-300/15"
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-[.8fr_1fr]">
          {/* LEFT: Graphic / Swahili message */}
          <div className="relative mx-auto w-full max-w-sm py-5">
            <div className="rotate-[-5deg] rounded-[2rem_1rem_2rem_1rem] bg-teal-300 p-5 text-[#123d56] shadow-xl sm:p-6">
              <p className="text-xs font-black uppercase tracking-[.2em]">
                Sauti ya wananchi
              </p>
              <p className="type-display mt-3 text-3xl sm:text-4xl">
                Nguvu ya mabadiliko huanza tunaposikilizana.
              </p>
            </div>
            <div className="absolute -bottom-1 -right-1 rotate-[6deg] rounded-[1rem_2rem_1rem_2rem] bg-orange-300 px-5 py-4 font-black text-[#263452] shadow-xl">
              Tujenge pamoja ↗
            </div>
          </div>

          {/* RIGHT: Contact heading and actions */}
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-orange-300">
              Tunasikiliza · Contact SISI
            </p>
            <h1 className="type-display mt-3 max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
              Let’s talk about your community.
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-blue-100/85 sm:text-lg sm:leading-8">
              Have a question about a project, spotted an issue, or need help
              using SISI? Send us a message and give us enough detail to help
              point you in the right direction.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#contact-form"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 font-extrabold text-[#173f8a] shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Send a message ↘
              </a>
              <a
                href="#contact-details"
                className="inline-flex items-center rounded-full border border-white/35 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Contact details ↓
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-blue-100/80">
              <span>✓ Project questions</span>
              <span>✓ Feedback and concerns</span>
              <span>✓ Help using SISI</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact-details"
        className="grid items-start gap-8 lg:grid-cols-[.78fr_1.22fr] lg:gap-12"
      >
        <aside className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-teal">
              Contact details
            </p>
            <h2 className="type-display mt-3 text-3xl md:text-4xl">
              Reach the county team.
            </h2>
            <p className="mt-3 leading-7 text-muted">
              Choose the channel that works for you. For a project-specific
              question, include the project name and ward if you can.
            </p>
          </div>
          {countyError ? (
            <ErrorMessage message={countyError} onRetry={refetch} />
          ) : !county ? (
            <Loader label="Loading contact details" />
          ) : (
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${county.contact.phone.replace(/\s/g, "")}`}
                className="group rounded-[1.5rem] border border-line bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-teal/50 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-light text-xl text-teal dark:bg-teal/20">
                    ☎
                  </span>
                  <div>
                    <p className="text-sm text-muted">Call us</p>
                    <p className="mt-1 font-bold group-hover:text-teal">
                      {county.contact.phone}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {county.contact.hours}
                    </p>
                  </div>
                </div>
              </a>
              <a
                href={`mailto:${county.contact.email}`}
                className="group rounded-[1.5rem] border border-line bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-teal/50 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-xl text-royal dark:bg-blue-900/40 dark:text-blue-200">
                    ✉
                  </span>
                  <div>
                    <p className="text-sm text-muted">Email</p>
                    <p className="mt-1 break-all font-bold group-hover:text-teal">
                      {county.contact.email}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Include a clear subject line.
                    </p>
                  </div>
                </div>
              </a>
              <div className="rounded-[1.5rem] border border-line bg-surface p-5">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-xl text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    ⌖
                  </span>
                  <div>
                    <p className="text-sm text-muted">Visit the office</p>
                    <p className="mt-1 font-bold">{county.contact.address}</p>
                    <p className="mt-1 text-sm text-muted">
                      {county.contact.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-[1.5rem] bg-surface-raised p-5">
            <h3 className="font-bold">Help us help you</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted">
              <li>• Name the project or ward, if relevant.</li>
              <li>• Describe what happened and where.</li>
              <li>• Share dates or details that help explain the issue.</li>
              <li>
                • Never include passwords or sensitive personal information.
              </li>
            </ul>
          </div>
        </aside>

        <div
          id="contact-form"
          className="scroll-mt-24 rounded-[2rem] border border-line bg-[#e6f6f2] p-6 shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10"
        >
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-teal">
              Send a message
            </p>
            <h2 className="type-display mt-3 text-3xl md:text-4xl">
              What would you like us to know?
            </h2>
            <p className="mt-3 leading-7 text-muted">
              Messages are routed through the SISI contact form. The demo
              service may not represent a live county support desk.
            </p>
          </div>
          {checking ? (
            <Loader label="Preparing your contact form" />
          ) : reply ? (
            <div
              role="status"
              className="rounded-[1.5rem] border border-teal/30 bg-teal-light p-6 text-teal-dark dark:bg-teal/15 dark:text-teal-100"
            >
              <span className="text-3xl" aria-hidden="true">
                ✓
              </span>
              <h3 className="mt-3 text-2xl font-bold">Message received</h3>
              <p className="mt-3 leading-7">{reply.message}</p>
              <p className="mt-3">
                Your reference number is <strong>#{reply.ticketId}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setReply(null)}
                className="mt-5 font-semibold underline underline-offset-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {user ? (
                <div className="rounded-xl bg-surface-raised p-4 text-sm text-muted">
                  Sending as <strong className="text-ink">{user.name}</strong> (
                  {user.email})
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Your name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Email address"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <InputField
                label="Subject"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                placeholder="e.g. Question about a ward project"
                required
              />
              <TextAreaField
                label="Your message"
                name="message"
                value={values.message}
                onChange={handleChange}
                rows={7}
                required
              />
              {error && <ErrorMessage message={error} />}
              <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-xs leading-5 text-muted">
                  Please don't share passwords, payment details or other
                  sensitive information in this form.
                </p>
                <PrimaryButton
                  type="submit"
                  title={sending ? "Sending message…" : "Send message ↗"}
                  disabled={sending}
                />
              </div>
            </form>
          )}
        </div>
      </section>

      {county && (
        <section className="grid gap-7 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-teal">
              Find the office
            </p>
            <h2 className="type-display mt-3 text-3xl md:text-4xl">
              A place for the conversation to continue.
            </h2>
            <p className="mt-4 leading-7 text-muted">
              {county.contact.address}. If you're planning a visit, check the
              listed office hours first.
            </p>
            <a
              href={county.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-royal underline decoration-teal decoration-2 underline-offset-4 dark:text-blue-300"
            >
              Get directions in Google Maps ↗
            </a>
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-surface p-2 shadow-lg">
            <iframe
              src={county.mapEmbedUrl}
              title={`Map showing ${county.contact.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-2xl sm:aspect-[16/8]"
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default ContactUs;

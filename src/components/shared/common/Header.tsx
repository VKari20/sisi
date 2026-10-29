import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { useInstallPrompt } from "../../../hooks/useInstallPrompt";
import LinkButton from "../ui/LinkButton";
import OfflineBanner from "./OfflineBanner";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/wards", label: "Counties & wards" },
  { to: "/participate", label: "Participate" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${isActive ? "bg-royal-light text-royal-dark dark:bg-slate-700 dark:text-blue-200" : "text-muted hover:bg-surface-raised hover:text-ink"}`;

const Header = () => {
  const { user, signOut } = useAuth();
  const { canInstall, install } = useInstallPrompt();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    try {
      return (
        localStorage.getItem("sisi-theme") === "dark" ||
        (!localStorage.getItem("sisi-theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("sisi-theme", dark ? "dark" : "light");
    } catch {
      /* storage may be unavailable */
    }
  }, [dark]);

  const closeMenu = () => setMenuOpen(false);
  const handleLogOut = () => {
    signOut();
    closeMenu();
    navigate("/");
  };
  const installButton = canInstall && (
    <button
      type="button"
      onClick={install}
      className="rounded-full border border-line px-3 py-2 text-sm font-semibold text-ink transition hover:bg-surface-raised"
    >
      Install app
    </button>
  );
  const themeButton = (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-10 place-items-center rounded-full border border-line bg-surface text-lg transition hover:bg-surface-raised"
    >
      {dark ? "☀" : "☾"}
    </button>
  );
  const authLinks = user ? (
    <>
      <span className="hidden text-sm text-muted xl:inline">
        Hi, <strong className="text-ink">{user.name}</strong>
      </span>
      <button
        type="button"
        onClick={handleLogOut}
        className="rounded-full px-3 py-2 text-sm font-semibold text-royal hover:bg-royal-light dark:hover:bg-slate-700"
      >
        Log out
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        onClick={closeMenu}
        className="rounded-full px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-raised"
      >
        Log in
      </Link>
      <LinkButton to="/register" title="Join Sisi" onClick={closeMenu} />
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[var(--sisi-header)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="grid size-10 place-items-center rounded-2xl bg-royal text-sm font-black tracking-tight text-white shadow-sm">
            SI
          </span>
          <span className="flex flex-col leading-tight">
            <span className="type-display text-xl text-ink">
              SISI<span className="text-royal">.</span>
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Your voice. Your ward.
            </span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {themeButton}
          {installButton}
          {authLinks}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          {themeButton}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-surface px-4 pb-5 lg:hidden"
        >
          <nav aria-label="Mobile main" className="flex flex-col gap-1 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={navClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
            {installButton}
            {authLinks}
          </div>
        </div>
      )}
      <OfflineBanner />
    </header>
  );
};
export default Header;

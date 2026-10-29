import { Link } from "react-router";

type LinkButtonProps = {
  to: string;
  title: string;
  variant?: "solid" | "outline" | "light";
  onClick?: () => void;
};

const variants = {
  solid: "bg-royal text-white shadow-sm shadow-blue-900/15 hover:bg-royal-dark",
  outline: "border border-royal/30 text-royal hover:bg-royal-light dark:text-blue-300 dark:hover:bg-slate-700",
  light: "bg-white text-royal-dark hover:bg-blue-50",
};

// Looks like a button, but navigates like a link
const LinkButton = ({ to, title, variant = "solid", onClick }: LinkButtonProps) => {
  return (
    <Link to={to} onClick={onClick} className={`inline-block rounded-lg px-5 py-2.5 font-semibold transition ${variants[variant]}`}>
      {title}
    </Link>
  );
};

export default LinkButton;

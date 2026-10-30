
import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import AuthLayout from "../components/auth/AuthLayout";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import { type CurrUserType } from "../types";
import { api } from "../utils/api";

const Login = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: string } | null)?.from ?? "/";

  const { values, handleChange } = useForm({
    email: "",
    password: "",
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const loggedInUser = await api<CurrUserType>("/auth/login", {
        method: "POST",
        body: values,
      });

      signIn(loggedInUser);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setSending(false);
    }
  };

  if (user && !sending) {
    return <Navigate to={from} replace />;
  }

  return (
    <AuthLayout
      title="Welcome back"
      intro="Your community. Your voice. Pick up where you left off and stay involved in the decisions shaping your county."
      footer={
        <>
          <p>
            New to Sisi?{" "}
            <Link
              to="/register"
              state={location.state}
              className="font-bold text-tea underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>

          <div className="mt-3 rounded-xl bg-paper p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Practice account
            </p>
            <p className="mt-2 text-sm font-semibold">
              demo@example.com
            </p>
            <p className="text-sm text-muted">
              password123
            </p>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-tea">
            Your account
          </p>
          <p className="mt-1 text-sm text-muted">
            Enter your details to continue.
          </p>
        </div>

        <InputField
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <Link
          to="/forgot-password"
          className="-mt-2 self-end text-sm font-bold text-tea hover:underline"
        >
          Forgot your password?
        </Link>

        {error && <ErrorMessage message={error} />}

        <PrimaryButton
          type="submit"
          title={sending ? "Logging in..." : "Log in to Sisi"}
          disabled={sending}
        />

        <p className="text-center text-xs leading-relaxed text-muted">
          Your voice matters. Stay informed and take part.
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;

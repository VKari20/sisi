
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthLayout from "../components/auth/AuthLayout";
import ErrorMessage from "../components/shared/ui/ErrorMessage";
import InputField from "../components/shared/ui/InputField";
import PrimaryButton from "../components/shared/ui/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { type CurrUserType } from "../types";
import { api } from "../utils/api";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const emptyForm: RegisterForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const Register = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: string } | null)?.from ?? "/";

  const [form, setForm] = useState<RegisterForm>(emptyForm);
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [step, setStep] = useState<"details" | "code">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api<{
        message: string;
        phone: string;
        devCode: string;
      }>("/auth/register", {
        method: "POST",
        body: form,
      });

      setDevCode(res.devCode);
      setStep("code");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loggedInUser = await api<CurrUserType>("/auth/verify", {
        method: "POST",
        body: { phone: form.phone, code },
      });

      signIn(loggedInUser);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  if (step === "code") {
    return (
      <AuthLayout
        title="Verify your number"
        intro={`We sent a 4-digit confirmation code to ${form.phone}. Enter it below to finish creating your account.`}
      >
        <div className="mb-6 rounded-2xl bg-tea-light p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-tea-dark">
            One last step
          </p>
          <p className="mt-2 text-sm leading-relaxed text-tea-dark">
            Confirming your number helps keep community participation
            accountable.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <InputField
            label="SMS verification code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            hint={`Practice API code: ${devCode}`}
            required
          />

          {error && <ErrorMessage message={error} />}

          <PrimaryButton
            type="submit"
            title={loading ? "Verifying..." : "Verify my number"}
            disabled={loading || code.length !== 4}
          />

          <button
            type="button"
            onClick={() => {
              setStep("details");
              setError("");
            }}
            className="text-sm font-bold text-tea hover:underline"
          >
            ← Change my details
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Join the conversation"
      intro="Create your Sisi account and take part in decisions that shape your community. Propose projects, vote, and make your voice count."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="font-bold text-tea underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-tea">
            Your details
          </p>
          <p className="mt-1 text-sm text-muted">
            All fields are required to create your account.
          </p>
        </div>

        <InputField
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        <InputField
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <InputField
          label="Phone number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="0712345678"
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        {error && <ErrorMessage message={error} />}

        <PrimaryButton
          type="submit"
          title={loading ? "Creating account..." : "Create my account"}
          disabled={loading}
        />

        <p className="text-center text-xs leading-relaxed text-muted">
          By registering, you can participate in project discussions
          and community decisions.
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;

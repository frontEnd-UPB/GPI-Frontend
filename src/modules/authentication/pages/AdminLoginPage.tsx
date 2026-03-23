import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/Container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";
import { ROUTE_PATHS } from "../../../routes/routes";
import { useSignIn } from "../hooks/useSignIn";
import { useAuth } from "../../../context/AuthContext";
import { LoginCard } from "../components/LoginCard";
import { PasswordInputWithEye } from "../components/PasswordInputWithEye";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { signIn: hookSignIn, signInLoading: loading } = useSignIn();

  const hideLoginCard = ["true", "1", "yes"].includes(
    String(import.meta.env.VITE_HIDE_LOGIN_CARD ?? "")
      .trim()
      .toLowerCase()
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    if (user.role === "admin") {
      navigate(ROUTE_PATHS.ADMIN_DASHBOARD, { replace: true });
      return;
    }

    if (user.role === "doctor") {
      navigate(ROUTE_PATHS.DOCTOR_DASHBOARD, { replace: true });
      return;
    }

    navigate(ROUTE_PATHS.UNAUTHORIZED, { replace: true });
  }, [authLoading, user, navigate]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { user } = await hookSignIn(email, password);

      if (user?.role === "admin") {
        navigate(ROUTE_PATHS.ADMIN_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTE_PATHS.DOCTOR_DASHBOARD, { replace: true });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate("/forgot-password?from=doctor");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopInfoBar />

      <BlurredBackground>

        <ThemedContainer
          leftOverlay={
            <LoginCard
              disabled={loading}
              hidden={hideLoginCard}
              onSelectUser={(selectedEmail, selectedPassword) => {
                setEmail(selectedEmail);
                setPassword(selectedPassword);
                setError(null);
              }}
            />
          }
        >
          <form
            className="login-form text-primary-foreground w-[300px]"
            onSubmit={handleSubmit}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold leading-tight mb-2">
                Hi,<br />Welcome Back!
              </h1>
            </div>

            <p className="text-xs font-semibold text-primary-foreground mb-1">
              Email
            </p>

            <Input
              id="email"
              type="email"
              placeholder="meddicalhospital@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <p className="text-xs font-semibold text-primary-foreground mt-5 mb-1">
              Password
            </p>

            <PasswordInputWithEye
              id="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <ErrorMessage message={error} className="mt-4" />}

            <div className="flex justify-end mt-3">
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-xs text-secondary underline"
              >
                Forgot Password?
              </a>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                className="w-[220px] rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Log in"}
              </Button>
            </div>
          </form>
        </ThemedContainer>
      </BlurredBackground>

      <Footer />
    </div>
  );
};

export default AdminLoginPage;
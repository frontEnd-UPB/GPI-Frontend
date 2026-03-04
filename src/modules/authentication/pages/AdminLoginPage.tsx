import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";
import { ROUTE_PATHS } from "../../../routes/routes"; 
import { useSignIn } from "../hooks/useSignIn";
import { useAuth } from "../../../context/AuthContext";
import { LoginCard } from "../components/LoginCard";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { signIn: hookSignIn, signInLoading: loading } = useSignIn();
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
        <ThemedContainer>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="mb-15">
              <h4 className="text-2xl text-primary-foreground font-bold mb-1">
                Welcome Back!
              </h4>
              <p className="text-xs text-info">
                Sign in to access your account
              </p>
            </div>

            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
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

            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
              Password
            </p>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <br />

            {error && <ErrorMessage message={error} />}

            <div className="flex justify-between items-center mt-4 mb-6">
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-sm text-info hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <div className="mt-6 flex justify-center">
              <Button type="submit" className="z-10 bg-chart-3" disabled={loading}>
                {loading ? "Verifying..." : "Log in"}
              </Button>
            </div>
          </form>
        </ThemedContainer>
        <div className="flex justify-center z-10 mt-4">
        <br />
        <LoginCard />
        </div>
      </BlurredBackground>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
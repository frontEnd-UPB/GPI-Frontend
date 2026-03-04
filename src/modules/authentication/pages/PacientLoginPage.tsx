import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";
import { useAuth } from "../../../context/AuthContext";
import { ROUTE_PATHS } from "../../../routes/routes"; 

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const authenticatedUser = await signIn({ email, password });

      if (authenticatedUser.role === "admin") {
        navigate(ROUTE_PATHS.VACATIONS_ADMIN, { replace: true });
      } else {
        navigate(ROUTE_PATHS.VACATIONS_DOCTOR, { replace: true });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate("/forgot-password?from=patient");
  };

  const handleSignUp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate("/sign-up");
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

            <div className="mt-6 text-center">
              <p className="text-sm text-primary-foreground">
                Don't have account?{" "}
                <a
                  href="#"
                  onClick={handleSignUp}
                  className="text-info hover:underline font-semibold"
                >
                  Sign Up here!
                </a>
              </p>
            </div>
          </form>
        </ThemedContainer>
      </BlurredBackground>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
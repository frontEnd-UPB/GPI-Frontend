import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/Container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";
import { PasswordInputWithEye } from "../components/PasswordInputWithEye";
import { ROUTE_PATHS } from "../../../routes/routes";

const PacientLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    // Solo demo/UI: no autentica contra ningún servicio todavía.
    setTimeout(() => {
      console.log("[PATIENT LOGIN DEMO]", { email, password });
      setLoading(false);
    }, 600);
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(`${ROUTE_PATHS.FORGOT_PASSWORD}?from=patient`);
  };

  const handleSignUp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(ROUTE_PATHS.SIGN_UP);
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
              placeholder="patientmail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
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

export default PacientLoginPage;
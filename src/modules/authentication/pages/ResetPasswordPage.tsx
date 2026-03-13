import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/Container";
import { Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";
import { ROUTE_PATHS } from "../../../routes/routes";
import { AUTH_DEBUG } from "../../../core/constants";
import { useResetPassword } from "../hooks/useResetPassword";
import { PasswordInputWithEye } from "../components/PasswordInputWithEye";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const {
    checkingToken,
    loading,
    isTokenValid,
    error,
    successMessage,
    from,
    validateToken,
    submitNewPassword,
  } = useResetPassword();

  const urlToken = searchParams.get("token");
  const token = urlToken ?? "";
  const sourceParam = searchParams.get("from");
  const initialSource = sourceParam === "patient" ? "patient" : "doctor";
  const resolvedSource = from ?? initialSource;
  const returnLoginPath =
    resolvedSource === "patient" ? ROUTE_PATHS.PATIENT_LOGIN : ROUTE_PATHS.LOGIN;
  const flowKey = "meddical:reset-flow-active";

  useEffect(() => {
    const isFlowActive = sessionStorage.getItem(flowKey) === "1";

    if (AUTH_DEBUG) {
      console.log("[RESET PASSWORD] validating token", {
        urlToken,
        token,
        isFlowActive,
      });
    }

    if (!token || !isFlowActive) {
      if (AUTH_DEBUG) {
        console.log("[RESET PASSWORD] missing token or flow inactive, redirecting to login");
      }
      sessionStorage.removeItem(flowKey);
      navigate(returnLoginPath, { replace: true });
      return;
    }

    void validateToken(token);

    return () => {
      sessionStorage.removeItem(flowKey);
    };
  }, [token, urlToken, navigate, returnLoginPath, validateToken]);

  useEffect(() => {
    if (!successMessage) return;

    const redirectTimer = setTimeout(() => {
      navigate(returnLoginPath, { replace: true });
    }, 1400);

    return () => clearTimeout(redirectTimer);
  }, [successMessage, navigate, returnLoginPath]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!isTokenValid) {
      return;
    }

    if (!newPassword.trim()) {
      setValidationError("New password is required");
      return;
    }

    if (!confirmPassword.trim()) {
      setValidationError("Please confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (newPassword.length < 12) {
      setValidationError("Password must be at least 12 characters");
      return;
    }

    setValidationError("");
    const updated = await submitNewPassword(token, newPassword);
    if (updated) {
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopInfoBar />

      <BlurredBackground>
        <ThemedContainer>
          <form
            className="login-form mx-auto flex w-full max-w-md flex-col text-primary-foreground"
            onSubmit={handleSubmit}
          >
            <div className="mb-8 sm:mb-10">
              <h4 className="mb-1 text-2xl font-bold sm:text-3xl">
                Set New Password
              </h4>
              <p className="text-xs text-secondary">Enter your new password.</p>
            </div>

            <p className="mb-2 mt-1 text-sm font-semibold">
              New Password
            </p>
            <PasswordInputWithEye
              id="newPassword"
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!isTokenValid || loading || checkingToken}
              className="w-full"
              required
            />

            <p className="mb-2 mt-4 text-sm font-semibold">
              Confirm Password
            </p>
            <PasswordInputWithEye
              id="confirmPassword"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isTokenValid || loading || checkingToken}
              className="w-full"
              required
            />

            {(validationError || error) && (
              <>
                <br />
                <ErrorMessage message={validationError || error || ""} />
              </>
            )}

            {/* Se elimina el mensaje "Validating reset link..." para simplificar el flujo */}

            {successMessage && (
              <div className="mt-4 text-center">
                <p className="text-sm text-primary-foreground">{successMessage}</p>
                <p className="text-xs text-secondary mt-1">Redirecting to Log In...</p>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                disabled={!isTokenValid || loading || checkingToken}
                className="z-10 w-full bg-secondary font-semibold text-secondary-foreground hover:bg-secondary/90 sm:w-3/4"
              >
                {loading ? "Saving..." : "Save New Password"}
              </Button>
            </div>
          </form>
        </ThemedContainer>
      </BlurredBackground>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
/**
 * FE-215: Reset Password UI
 * 
 * Page: Set New Password
 * 
 * Acceptance Criteria Met:
 * ✓ Layout structure: TopInfoBar, Footer, BlurredBackground, ThemedContainer
 * ✓ Form container: ThemedContainer with image on left, form on right
 * ✓ Titles: "Set New Password" with subtitle "Enter your new password..."
 * ✓ Fields: "New Password" and "Confirm Password" with password input components
 * ✓ Visual styles: PasswordInputWithEye components matching core Input styles
 * ✓ Consistency: Same spacing/structure as LoginPage, cohesive module styling
 * 
 * Implementation Notes:
 * - Uses PasswordInputWithEye component (FE-164) for password visibility toggle
 * - Validates token before showing form (validates via useResetPassword hook)
 * - Enforces password requirements: 12+ characters, match confirmation
 * - Error display via ErrorMessage component (shared feedback component)
 * - Success redirects to login page after 1.4s delay
 * 
 * Previous: Used generic form structure
 * Current: Integrated with full password reset flow (ForgotPassword → OTP → Reset)
 * Future: Will connect to real backend API for token validation and password update
 */
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
    loading,
    error,
    successMessage,
    submitNewPassword,
  } = useResetPassword();

  const emailParam = (searchParams.get("email") ?? "").trim().toLowerCase();
  const sourceParam = searchParams.get("from");
  const initialSource = sourceParam === "patient" ? "patient" : "doctor";
  const resolvedSource = initialSource;
  const returnLoginPath =
    resolvedSource === "patient" ? ROUTE_PATHS.PATIENT_LOGIN : ROUTE_PATHS.LOGIN;
  const flowKey = "meddical:reset-flow-active";

  useEffect(() => {
    const isFlowActive = sessionStorage.getItem(flowKey) === "1";

    if (AUTH_DEBUG) {
      console.log("[RESET PASSWORD] validating token", {
        emailParam,
        isFlowActive,
      });
    }

    if (!emailParam || !isFlowActive) {
      if (AUTH_DEBUG) {
        console.log("[RESET PASSWORD] missing email or flow inactive, redirecting to login");
      }
      sessionStorage.removeItem(flowKey);
      navigate(returnLoginPath, { replace: true });
      return;
    }

    return () => {
      sessionStorage.removeItem(flowKey);
    };
  }, [emailParam, navigate, returnLoginPath]);

  useEffect(() => {
    if (!successMessage) return;

    const redirectTimer = setTimeout(() => {
      navigate(returnLoginPath, { replace: true });
    }, 1400);

    return () => clearTimeout(redirectTimer);
  }, [successMessage, navigate, returnLoginPath]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

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
    const updated = await submitNewPassword(
      emailParam,
      newPassword,
      confirmPassword,
      resolvedSource
    );
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
              disabled={loading}
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
              disabled={loading}
              className="w-full"
              required
            />

            {(validationError || error) && (
              <ErrorMessage message={validationError || error || ""} className="mt-4" />
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
                disabled={loading}
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
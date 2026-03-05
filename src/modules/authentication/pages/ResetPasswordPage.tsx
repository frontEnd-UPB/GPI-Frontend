import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";
import { ROUTE_PATHS } from "../../../routes/routes";
import { useResetPassword } from "../hooks/useResetPassword";

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

  const token = searchParams.get("token") ?? "";
  const sourceParam = searchParams.get("from");
  const resolvedSource = from ?? (sourceParam === "patient" ? "patient" : "doctor");
  const returnLoginPath =
    resolvedSource === "patient" ? "/patient-login" : ROUTE_PATHS.LOGIN;

  useEffect(() => {
    validateToken(token);
  }, [token]);

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
    
    // Validación básica
    if (!newPassword.trim()) {
      setValidationError("New password is required");
      return;
    }
    
    if (!confirmPassword.trim()) {
      setValidationError("Please confirm your password");
      return;
    }
    
    // Validación simple de que coincidan
    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    
    // Validación mínima de seguridad (al menos 12 caracteres)
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
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="mb-15">
              <h4 className="text-2xl text-primary-foreground font-bold mb-1">
                Set New Password
              </h4>
              <p className="text-xs text-info">
                Enter your new password to complete the reset process.
              </p>
            </div>
            
            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
              New Password
            </p>
            <Input 
              id="newPassword" 
              type="password" 
              placeholder="Enter your new password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!isTokenValid || loading || checkingToken}
              required 
            />
            
            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
              Confirm Password
            </p>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="Confirm your new password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isTokenValid || loading || checkingToken}
              required 
            />

            {(validationError || error) && (
              <>
                <br />
                <ErrorMessage message={validationError || error || ""} />
              </>
            )}

            {checkingToken && (
              <div className="mt-4 text-center">
                <p className="text-sm text-primary-foreground">Validating reset link...</p>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 text-center">
                <p className="text-sm text-primary-foreground">{successMessage}</p>
                <p className="text-xs text-info mt-1">Redirecting to Log In...</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                disabled={!isTokenValid || loading || checkingToken}
                className="z-10 bg-chart-3"
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
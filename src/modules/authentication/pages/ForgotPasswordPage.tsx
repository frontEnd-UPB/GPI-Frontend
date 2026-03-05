import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage"; // Ajusta la ruta
import BlurredBackground from "../components/BlurredBackground";
import { ROUTE_PATHS } from "../../../routes/routes";
import { useForgotPassword } from "../hooks/useForgotPassword";
import type { ForgotPasswordSource } from "../services/forgotPasswordService";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const { loading, error, successMessage, token, requestReset, clearFeedback } =
    useForgotPassword();

  const from = searchParams.get("from");
  const requestSource: ForgotPasswordSource = from === "patient" ? "patient" : "doctor";
  const returnLoginPath = from === "patient" ? "/patient-login" : ROUTE_PATHS.LOGIN;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    }
    
    // Validación simple de formato de email
    if (!email.includes('@') || !email.includes('.')) {
      setValidationError("Please enter a valid email address");
      return;
    }
    
    setValidationError("");
    await requestReset(email, requestSource);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (validationError) {
      setValidationError("");
    }
    if (error || successMessage || token) {
      clearFeedback();
    }
  };

  const handleGoToReset = () => {
    if (!token) return;
    navigate(`/reset-password?token=${encodeURIComponent(token)}&from=${requestSource}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopInfoBar />
      <BlurredBackground>
        <ThemedContainer>
          <form className="forgot-password-form mt-[-200px]" onSubmit={handleSubmit}>
            {/* Header */}
            <div className="mb-5">
              <h4 className="text-2xl text-primary-foreground font-bold mb-1">
                Forgot Password?
              </h4>
              <p className="text-xs text-info">
                Enter your email to reset your password.
              </p>
            </div>
            
            {/* Email */}
            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
              Email
            </p>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
              className="w-75"
            />
            
            {/* Error Message */}
            {(validationError || error) && (
              <>
                <br />
                <ErrorMessage message={validationError || error || ""} />
              </>
            )}

            {successMessage && (
              <div className="mt-4 text-center">
                <p className="text-sm text-primary-foreground">{successMessage}</p>
              </div>
            )}
            
            {/* Submit */}
            <div className="mt-6 flex justify-center">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-3/4 mx-auto z-10 bg-chart-3 hover:bg-chart-3 hover:opacity-80"
              >
                {loading ? "Sending..." : "Submit"}
              </Button>
            </div>

            {token && (
              <div className="mt-4 flex justify-center">
                {/* Test button for demonstration purposes, can erase later*/}
                <div className="w-3/4 mx-auto group text-center">
                  <Button
                    type="button"
                    onClick={handleGoToReset}
                    className="w-full z-10 bg-chart-3 hover:bg-chart-3 hover:opacity-90 font-semibold"
                  >
                    Go Set New Password
                  </Button>
                  <p className="mt-2 text-[11px] text-primary-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    This is a test button, real implementation uses link via gmail.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <p className="text-xs text-primary-foreground">
                <button
                  type="button"
                  className="underline cursor-pointer bg-transparent text-xs font-regular text-primary-foreground"
                  onClick={() => navigate(returnLoginPath)}
                >
                  Return
                </button>{" "}
                and Log In
              </p>
            </div>
          </form>
        </ThemedContainer>
        
      </BlurredBackground>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
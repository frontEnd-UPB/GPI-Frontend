import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/Container";
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
  const returnLoginPath = from === "patient" ? ROUTE_PATHS.PATIENT_LOGIN : ROUTE_PATHS.LOGIN;

  const flowKey = "meddical:reset-flow-active";
  const programmaticNavRef = useRef(false);

  useEffect(() => {
    return () => {
      if (!programmaticNavRef.current) {
        sessionStorage.removeItem(flowKey);
      }
    };
  }, []);

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
    const resetToken = await requestReset(email, requestSource);

    // Solo si el backend mock acepta el email (y genera token) pasamos a OTP
    if (resetToken) {
      sessionStorage.setItem(flowKey, "1");
      programmaticNavRef.current = true;
      navigate(
        `${ROUTE_PATHS.OTP_VERIFICATION}?token=${encodeURIComponent(
          resetToken
        )}&from=${requestSource}`,
        { replace: true }
      );
    }
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
          <form
            className="forgot-password-form mx-auto flex w-full max-w-md flex-col text-primary-foreground"
            onSubmit={handleSubmit}
          >
            {/* Header */}
            <div className="mb-5">
              <h4 className="mb-1 text-2xl font-bold sm:text-3xl">
                Forgot Password?
              </h4>
              <p className="text-xs text-secondary">
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
              placeholder="meddical@mail.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
              className="w-full"
            />
            
            {/* Error Message */}
            {(validationError || error) && (
              <>
                <br />
                <ErrorMessage message={validationError || error || ""} />
              </>
            )}

            {successMessage && !validationError && !error && (
              <div className="mt-3 text-center">
                <p className="text-xs text-primary-foreground">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="mt-6 flex justify-center">
              <Button 
                type="submit" 
                disabled={loading}
                className="mx-auto z-10 w-full bg-secondary font-semibold hover:secondary-foreground hover:bg-secondary/90 sm:w-3/4"
              >
                {loading ? "Sending..." : "Submit"}
              </Button>
            </div>

            <div className="mt-4 flex justify-center">
              <p className="text-xs text-primary-foreground">
                <button
                  type="button"
                  className="underline cursor-pointer bg-transparent text-xs font-regular text-primary-foreground"
                  onClick={() => navigate(returnLoginPath)}
                >
                  Return to Log In
                </button>{" "}
                
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
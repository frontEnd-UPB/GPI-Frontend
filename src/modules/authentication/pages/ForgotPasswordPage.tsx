import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage"; // Ajusta la ruta
import BlurredBackground from "../components/BlurredBackground";
import { ROUTE_PATHS } from "../../../routes/routes";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const from = searchParams.get("from");
  const returnLoginPath = from === "patient" ? "/patient-login" : ROUTE_PATHS.LOGIN;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    // Validación simple de formato de email
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError(""); // Limpiar error
    console.log("Email válido:", email);
    // lógica de forgot password (send reset email)
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
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-75"
            />
            
            <br />
            {/* Error Message */}
            {error && <ErrorMessage message={error} />}
            
            {/* Submit */}
            <div className="mt-6 flex justify-center">
              <Button 
                type="submit" 
                className="w-3/4 mx-auto z-10 bg-chart-3 hover:bg-chart-3 hover:opacity-80"
              >
                Submit
              </Button>
            </div>

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
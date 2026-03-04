import React, { useState } from "react";
import { MainLayout } from "../../../core/components/layout/MainLayout";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage"; // Ajusta la ruta
import BlurredBackground from "../components/BlurredBackground";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
    <MainLayout>
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
          </form>
        </ThemedContainer>
      </BlurredBackground>
      <Footer />
    </MainLayout>
  );
};

export default ForgotPasswordPage;
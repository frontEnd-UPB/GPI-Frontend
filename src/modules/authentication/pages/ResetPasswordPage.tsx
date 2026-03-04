import React, { useState } from "react";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { Input, Button } from "../../../core/components";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }
    
    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      return;
    }
    
    // Validación simple de que coincidan
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validación mínima de seguridad (al menos 12 caracteres)
    if (newPassword.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }
    
    setError("");
    console.log("Passwords válidas");
    // lógica de reset password
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // logica de forgot password
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
              required 
            />
            
             {/* add space */}
              <br />
           
            {error && <ErrorMessage message={error} />}
            
            <div className="mt-6 flex justify-center">
              <Button type="submit" className="z-10 bg-chart-3">
                Save New Password
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
import React from "react";
import bgImage from "../assets/auth_bg_image.png";
import {MainLayout } from "../../../core/components/layout/MainLayout";
import {TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import {Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { Input, Button } from "../../../core/components";

const ResetPasswordPage: React.FC = () => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    //logica de login 
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // logica de login 
  };

  return (
    <MainLayout>
      <TopInfoBar />
      <div
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(255, 255, 255, 0.3)" }} />
        <ThemedContainer>
            <form className="login-form" onSubmit={handleSubmit}>

            <div className="mb-15">
            <h4 className="text-2xl text-primary-foreground font-bold mb-1">
            Set New Password</h4>
            <p className="text-xs text-info ">
            Enter your new password to complete the reset process.</p>
            </div>
            
            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
            New Password</p>
            <Input id="email" type="email" placeholder="Enter your email" required />
            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
            Confirm Password</p>
            <Input id="password" type="password" placeholder="************" required />
            
            <div className="mt-6 flex justify-center">
              <Button type="button" className="login-button z-10 bg-chart-3" >
               Save New Password
              </Button>
            </div>

            </form>
        </ThemedContainer>
      </div>
      <Footer />
    </MainLayout>
  );
};

export default ResetPasswordPage;

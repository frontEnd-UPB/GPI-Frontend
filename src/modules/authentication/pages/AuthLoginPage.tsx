import React from "react";
import bgImage from "../assets/auth_bg_image.png";
import {MainLayout } from "../../../core/components/layout/MainLayout";
import {TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import {Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";

const AuthLoginPage: React.FC = () => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // TODO: Add login logic
    console.log("Login submitted");
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // TODO: Add forgot password logic
    console.log("Forgot password clicked");
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

                <br />

        </ThemedContainer>
      </div>
      <Footer />
    </MainLayout>
  );
};

export default AuthLoginPage;

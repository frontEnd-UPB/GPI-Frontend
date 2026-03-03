import React from "react";
import bgImage from "../assets/auth_bg_image.png";
import { MainLayout } from "../../../core/components/layout/MainLayout";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import BlurredBackground from "../components/BlurredBackground";

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
      <BlurredBackground >
        <ThemedContainer>
          <br />
        </ThemedContainer>
      </BlurredBackground>
      <Footer />
    </MainLayout>
  );
};

export default AuthLoginPage;

import React from "react";
import bgImage from "../assets/auth_bg_image.png";
import { MainLayout } from "../../../core/components/layout/MainLayout";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import BlurredBackground from "../components/BlurredBackground";
import { useAuth } from "../../../context/AuthContext";

const AuthLoginPage: React.FC = () => {

  return (
    <MainLayout>
      <TopInfoBar />
      <BlurredBackground>
        <ThemedContainer>
          <h1 className="text-2xl font-bold mb-4">EmptyPageForTests</h1>
        </ThemedContainer>
      </BlurredBackground>
      <Footer />
    </MainLayout>
  );
};

export default AuthLoginPage;

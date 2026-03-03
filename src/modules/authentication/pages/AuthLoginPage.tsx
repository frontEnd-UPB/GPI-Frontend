import React from "react";
import bgImage from "../assets/auth_bg_image.png";
import { MainLayout } from "../../../core/components/layout/MainLayout";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import BlurredBackground from "../components/BlurredBackground";
import { useAuth } from "../../../context/AuthContext";

const AuthLoginPage: React.FC = () => {
  // Manual auth test UI using AuthContext

  const { user, isLoading, login, logout } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email: "esthera@example.com", password: "admin123" });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <MainLayout>
      <TopInfoBar />
      <BlurredBackground>
        <ThemedContainer>
          {isLoading ? (
            <div>Loading...</div>
          ) : user ? (
            <>
              <p>Welcome {user.name}</p>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <form onSubmit={handleLogin}>
              <button type="submit">Login as Esthera</button>
            </form>
          )}
        </ThemedContainer>
      </BlurredBackground>
      <Footer />
    </MainLayout>
  );
};

export default AuthLoginPage;

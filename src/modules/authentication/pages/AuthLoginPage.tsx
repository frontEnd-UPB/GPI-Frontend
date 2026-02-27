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
            <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">
                Hi,
                <br />
                We are here to help
            </h2>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                id="password"
                type="password"
                placeholder="************"
                required
                />
            </div>

            <div className="form-options">
                <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                Forgot Password?
                </a>
            </div>

            <button type="submit" className="login-button">
                Log in
            </button>

            <p className="signup-prompt">
                Don&apos;t have an account?{" "}
                <button
                type="button"
                className="link-button"
                onClick={() => console.log("Sign up")}
                >
                Sign up
                </button>
            </p>
            </form>
        </ThemedContainer>
      </div>
      <Footer />
    </MainLayout>
  );
};

export default AuthLoginPage;

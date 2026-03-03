import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/auth_bg_image.png";
import sideImage from "../assets/auth_side_image.png";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";

import { Button } from "../../../ui/core/Button";
import { Input } from "../../../ui/core/Input";
import { useLogin } from "../hooks/useLogin"; 
import { theme } from "../../../core/theme"; 

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result.user.role === "ADMIN") {
        navigate("/admin/vacations");
      } else {
        navigate("/doctor/vacations");
      }
    } catch (err) {
      // Error manejado por el hook
    }
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate("/reset-password");
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      
      <TopInfoBar />

      <main
        className="flex-grow flex items-center justify-center p-4 relative w-full"
        style={{ 
          backgroundImage: `url(${bgImage})`, 
          backgroundSize: "cover", 
          backgroundPosition: "center" 
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(245, 247, 250, 0.6)" }} />
        
        <div 
          className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl shadow-2xl overflow-hidden"
          style={{ borderRadius: theme.radius.xl }}
        >
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src={sideImage} 
              alt="Medical Professional" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <form 
            className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center space-y-6" 
            onSubmit={handleSubmit}
            style={{ backgroundColor: theme.colors.primaryDark }}
          >
            <div className="mb-2">
              <h2 
                style={{ 
                  color: theme.colors.textOnPrimary, 
                  fontSize: theme.typography.fontSize.display,
                  fontFamily: theme.typography.fontFamily.bold,
                  lineHeight: 1.2
                }}
              >
                Hi,
                <br />
                Welcome Back!
              </h2>
            </div>

            <div className="form-group space-y-1">
              <label 
                htmlFor="email" 
                className="block"
                style={{ 
                  color: theme.colors.textOnPrimary,
                  fontSize: theme.typography.fontSize.sm,
                  fontFamily: theme.typography.fontFamily.medium
                }}
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="meddicalhospital@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-none h-12"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderRadius: theme.radius.md
                }}
              />
            </div>

            <div className="form-group space-y-1">
              <label 
                htmlFor="password" 
                className="block"
                style={{ 
                  color: theme.colors.textOnPrimary,
                  fontSize: theme.typography.fontSize.sm,
                  fontFamily: theme.typography.fontFamily.medium
                }}
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-none h-12"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderRadius: theme.radius.md
                }}
              />
            </div>

            {error && (
              <p 
                className="p-3 border"
                style={{ 
                  color: theme.colors.surface, 
                  backgroundColor: theme.colors.error,
                  borderColor: theme.colors.error,
                  borderRadius: theme.radius.sm,
                  fontSize: theme.typography.fontSize.sm
                }}
              >
                {error}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <a 
                href="#" 
                onClick={handleForgotPassword}
                className="hover:underline transition-all"
                style={{ 
                  color: theme.colors.primaryLight,
                  fontSize: theme.typography.fontSize.sm,
                  fontFamily: theme.typography.fontFamily.regular
                }}
              >
                Forgot Password?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full transition-opacity hover:opacity-90 mt-4" 
              disabled={isLoading}
              style={{
                height: "50px",
                backgroundColor: theme.colors.info,
                color: theme.colors.textOnPrimary,
                borderRadius: theme.radius.md,
                fontSize: theme.typography.fontSize.md,
                fontFamily: theme.typography.fontFamily.bold
              }}
            >
              {isLoading ? "Verifying..." : "Log in"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
      
    </div>
  );
};

export default AdminLoginPage;
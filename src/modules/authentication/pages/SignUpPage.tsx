import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import BlurredBackground from "../components/BlurredBackground";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";

// Usando las importaciones que prefieres de ui/core
import { Button } from "../../../ui/core/Button";
import { Input } from "../../../ui/core/Input";
import { Eye, EyeOff } from "lucide-react";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }

    setIsLoading(true);
    
    // Simulación
    setTimeout(() => {
      console.log("Datos de registro:", { fullName, email, password });
      setIsLoading(false);
      navigate("/admin-login"); 
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopInfoBar />
      <BlurredBackground>
        <ThemedContainer>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="mb-10">
              <h4 className="text-2xl text-primary-foreground font-bold mb-1">
                Get started
              </h4>
              <p className="text-xs text-info">
                Let's create your account to access the system.
              </p>
            </div>

            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
              Full Name
            </p>
            <Input
              id="fullName"
              placeholder="Abigail Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
              Email
            </p>
            <Input
              id="email"
              type="email"
              placeholder="patientmail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
              Password
            </p>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="text-sm text-primary-foreground font-semibold mt-4 mb-2">
              Confirm Password
            </p>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <br />
            
            {error && <ErrorMessage message={error} />}

            <div className="mt-4 flex flex-col items-center w-full">
              <Button 
                type="submit" 
                className="z-10 bg-chart-3 w-full font-bold"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>

              <p className="text-center text-sm font-medium mt-6 text-primary-foreground">
                Already have an account?{" "}
                <button 
                  type="button" 
                  className="hover:underline font-bold text-info" 
                  onClick={() => navigate("/admin-login")}
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </ThemedContainer>
      </BlurredBackground>
      <Footer />
    </div>
  );
};

export default SignUpPage;
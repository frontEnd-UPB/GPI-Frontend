import React from "react";
import { MainLayout } from "../../../core/components/layout/MainLayout";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../ui/input-otp";
import { Button } from "../../../core";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage"; // Ajusta la ruta
import BlurredBackground from "../components/BlurredBackground";

const OtpVerificationPage: React.FC = () => {
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [showTimer, setShowTimer] = React.useState(false);
  const [seconds, setSeconds] = React.useState(60);

  // Validar que solo sean números
  const handleOtpChange = (value: string) => {
    // Solo permite dígitos
    if (/^\d*$/.test(value)) {
      setOtp(value);
      setError(""); // Limpiar error cuando el usuario escribe
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!otp.trim()) {
      setError("OTP code is required");
      return;
    }
    
    if (otp.length < 6) {
      setError("OTP code must be 6 digits");
      return;
    }
    
    setError("");
    console.log("OTP válido:", otp);
    // Use otp value here, e.g., send to API
  };

  // Persist timer state in localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("otp-timer");
    if (saved) {
      const { expiresAt } = JSON.parse(saved);
      const now = Date.now();
      if (expiresAt > now) {
        setShowTimer(true);
        setSeconds(Math.ceil((expiresAt - now) / 1000));
      }
    }
  }, []);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTimer && seconds > 0) {
      timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    }
    if (showTimer && seconds > 0) {
      localStorage.setItem(
        "otp-timer",
        JSON.stringify({ expiresAt: Date.now() + seconds * 1000 })
      );
    }
    if (seconds === 0) {
      setShowTimer(false);
      localStorage.removeItem("otp-timer");
    }
    return () => clearInterval(timer);
  }, [showTimer, seconds]);

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTimer(true);
    setSeconds(60);
    localStorage.setItem(
      "otp-timer",
      JSON.stringify({ expiresAt: Date.now() + 60000 })
    );
  };

  return (
    <MainLayout>
      <TopInfoBar />
      <BlurredBackground>
        <ThemedContainer>
          <form className="otp-form mt-[-200px]" onSubmit={handleSubmit}>
            <div className="mb-10">
              <h4 className="text-2xl text-primary-foreground font-bold mb-1">
                OTP Verification
              </h4>
              <p className="text-xs text-info">
                Check your email to see the verification code.
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
              >
                <InputOTPGroup className="gap-3">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="bg-white w-10 h-10 rounded-full border border-input text-2xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <br />
            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                className="z-10 bg-chart-3 hover:bg-chart-3 hover:opacity-80"
              >
                Submit
              </Button>
            </div>

            <div className="mt-2 flex justify-center">
              {showTimer ? (
                <p className="text-xs text-primary-foreground">
                  <button
                    type="button"
                    className="underline cursor-pointer bg-transparent text-xs font-regular"
                    onClick={handleResend}
                    disabled={seconds > 0}
                  >
                    Resend
                  </button>{' '}code in <span className="text-info">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</span>
                </p>
              ) : (
                <p className="text-xs text-primary-foreground">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="underline cursor-pointer bg-transparent text-xs font-regular"
                  >
                    Resend
                  </button>{' '}code
                </p>
              )}
            </div>
          </form>
        </ThemedContainer>
      </BlurredBackground>
      <Footer />
    </MainLayout>
  );
};

export default OtpVerificationPage;
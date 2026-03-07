import React from "react";
import { useNavigate } from "react-router-dom";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/themed-container";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../ui/input-otp";
import { Button } from "../../../core";
import { AUTH_DEBUG } from "../../../core/constants";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";
import { ROUTE_PATHS } from "../../../routes/routes";
import { mockOtpCode } from "../../../core/mocks/data";

const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [showTimer, setShowTimer] = React.useState(false);
  const [seconds, setSeconds] = React.useState(60);
  const [expiresAt, setExpiresAt] = React.useState<number | null>(null);

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
    
    if (otp !== mockOtpCode) {
      setError("Invalid OTP code");
      return;
    }

    setError("");
    if (AUTH_DEBUG) console.log("[OTP VERIFIED]", otp);
    // Una vez verificado, llevamos al login de pacientes
    navigate(ROUTE_PATHS.PATIENT_LOGIN, { replace: true });
  };

  // Persist timer state in localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("otp-timer");
    if (saved) {
      const { expiresAt: savedExpiresAt } = JSON.parse(saved);
      const now = Date.now();
      if (savedExpiresAt > now) {
        setShowTimer(true);
        setExpiresAt(savedExpiresAt);
        setSeconds(Math.ceil((savedExpiresAt - now) / 1000));
      }
    }
  }, []);

  React.useEffect(() => {
    if (!showTimer || !expiresAt) return;

    const syncCountdown = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSeconds(remaining);

      if (remaining === 0) {
        setShowTimer(false);
        setExpiresAt(null);
        localStorage.removeItem("otp-timer");
      }
    };

    syncCountdown();
    const timer = setInterval(syncCountdown, 1000);
    return () => clearInterval(timer);
  }, [showTimer, expiresAt]);

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextExpiresAt = Date.now() + 60000;
    setShowTimer(true);
    setSeconds(60);
    setExpiresAt(nextExpiresAt);
    localStorage.setItem(
      "otp-timer",
      JSON.stringify({ expiresAt: nextExpiresAt })
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
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
    </div>
  );
};

export default OtpVerificationPage;
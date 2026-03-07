import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { TopInfoBar } from "../../../core/components/layout/TopInfoBar";
import { Footer } from "../../../core/components/layout/Footer";
import { ThemedContainer } from "../components/Container";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../ui/input-otp";
import { Button } from "../../../core";
import { AUTH_DEBUG } from "../../../core/constants";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import BlurredBackground from "../components/BlurredBackground";
import { ROUTE_PATHS } from "../../../routes/routes";
import { mockOtpCode } from "../../../core/mocks/data";
const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [showTimer, setShowTimer] = React.useState(false);
  const [seconds, setSeconds] = React.useState(60);
  const [expiresAt, setExpiresAt] = React.useState<number | null>(null);
  const resetToken = searchParams.get("token") ?? "";
  const fromParam = searchParams.get("from");
  const resetSource = fromParam === "patient" ? "patient" : "doctor";
  const returnLoginPath =
    resetSource === "patient" ? ROUTE_PATHS.PATIENT_LOGIN : ROUTE_PATHS.LOGIN;
  const flowKey = "meddical:reset-flow-active";
  const programmaticNavRef = useRef(false);
  const [isVerified, setIsVerified] = React.useState(false);

  useEffect(() => {
    const isFlowActive = sessionStorage.getItem(flowKey) === "1";
    if (!isFlowActive) {
      navigate(returnLoginPath, { replace: true });
    }

    return () => {
      if (!programmaticNavRef.current) {
        sessionStorage.removeItem(flowKey);
      }
    };
  }, [navigate, returnLoginPath]);

  const handleOtpChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("OTP code is required");
      return;
    }

    if (otp.length < 4) {
      setError("OTP code must be 4 digits");
      return;
    }

    if (otp !== mockOtpCode) {
      setError("Invalid OTP code");
      return;
    }

    setError("");
    setIsVerified(true);

    if (AUTH_DEBUG) console.log("[OTP VERIFIED]", otp);
    setTimeout(() => {
      programmaticNavRef.current = true;
      navigate(
        `${ROUTE_PATHS.RESET_PASSWORD}?token=${encodeURIComponent(
          resetToken
        )}&from=${resetSource}`,
        { replace: true }
      );
    }, 1200);
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("otp-timer");
    const now = Date.now();

    if (saved) {
      const { expiresAt: savedExpiresAt } = JSON.parse(saved);

      if (savedExpiresAt > now) {
        setShowTimer(true);
        setExpiresAt(savedExpiresAt);
        setSeconds(Math.ceil((savedExpiresAt - now) / 1000));
        return;
      }
    }

    const nextExpiresAt = now + 60000;
    setShowTimer(true);
    setExpiresAt(nextExpiresAt);
    setSeconds(60);

    localStorage.setItem("otp-timer", JSON.stringify({ expiresAt: nextExpiresAt }));
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

    localStorage.setItem("otp-timer", JSON.stringify({ expiresAt: nextExpiresAt }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopInfoBar />

      <BlurredBackground>
        <ThemedContainer>
          <form
            className="otp-form text-primary-foreground mt-[-150px] flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="mb-8 w-full text-left">
              <h1 className="text-3xl font-bold mb-0.5">
                OTP Verification
              </h1>

              <p className="text-xs text-secondary">
                Check your email to see the verification code
              </p>
            </div>

            <div className="flex justify-center mb-8 w-full">
              <InputOTP value={otp} onChange={handleOtpChange} maxLength={4}>
                <InputOTPGroup className="gap-4">
                  {[...Array(4)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="
                        w-10 h-10
                        rounded-full
                        bg-white
                        border border-input
                        text-lg
                        font-semibold
                        text-primary
                      "
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="mt-2 mb-6 w-full flex justify-center">
              <Button
                type="submit"
                disabled={isVerified}
                className={`w-[220px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                ${
                  isVerified
                    ? "bg-success text-white"
                    : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                }`}
              >
                {isVerified ? (
                  <>
                    <Check className="size-5" />
                    Verified
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </div>

            <div className="text-xs text-primary-foreground text-center w-full">
              {showTimer ? (
                <p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={seconds > 0}
                    className="underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Resend
                  </button>{" "}
                  code in{" "}
                  <span className="text-secondary font-medium">
                    {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                    {String(seconds % 60).padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <p>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="underline text-secondary hover:text-secondary-foreground font-medium"
                  >
                    Resend code
                  </button>
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
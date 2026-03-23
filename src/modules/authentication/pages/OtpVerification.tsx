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
import { forgotPasswordService } from "../services/forgotPasswordService";
import { useResetPassword } from "../hooks/useResetPassword";
const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [showTimer, setShowTimer] = React.useState(false);
  const [seconds, setSeconds] = React.useState(60);
  const [expiresAt, setExpiresAt] = React.useState<number | null>(null);
  const resetEmail = (searchParams.get("email") ?? "").trim().toLowerCase();
  const fromParam = searchParams.get("from");
  const resetSource = fromParam === "patient" ? "patient" : "doctor";
  const returnLoginPath =
    resetSource === "patient" ? ROUTE_PATHS.PATIENT_LOGIN : ROUTE_PATHS.LOGIN;
  const flowKey = "meddical:reset-flow-active";
  const programmaticNavRef = useRef(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const { verifyingCode, error: verifyError, verifyCode } = useResetPassword();

  useEffect(() => {
    const isFlowActive = sessionStorage.getItem(flowKey) === "1";
    if (!isFlowActive || !resetEmail) {
      navigate(returnLoginPath, { replace: true });
    }

    return () => {
      if (!programmaticNavRef.current) {
        sessionStorage.removeItem(flowKey);
      }
    };
  }, [navigate, returnLoginPath, resetEmail]);

  const handleOtpChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("OTP code is required");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP code must be 6 digits");
      return;
    }

    const verified = await verifyCode(resetEmail, otp, resetSource);
    if (!verified) {
      setError("Invalid or expired verification code");
      return;
    }

    setError("");
    setIsVerified(true);

    if (AUTH_DEBUG) console.log("[OTP VERIFIED]", { otp, email: resetEmail });
    setTimeout(() => {
      programmaticNavRef.current = true;
      navigate(
        `${ROUTE_PATHS.RESET_PASSWORD}?email=${encodeURIComponent(
          resetEmail
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

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault();

    setIsResending(true);

    const result = await forgotPasswordService.requestPasswordReset(
      resetEmail,
      resetSource
    );

    if (!result.success) {
      setError(result.message);
      setIsResending(false);
      return;
    }

    const nextExpiresAt = Date.now() + 60000;

    setShowTimer(true);
    setSeconds(60);
    setExpiresAt(nextExpiresAt);
    setError("");
    setIsResending(false);

    localStorage.setItem("otp-timer", JSON.stringify({ expiresAt: nextExpiresAt }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopInfoBar />

      <BlurredBackground>
        <ThemedContainer>
          <form
            className="otp-form mx-auto flex w-full max-w-md flex-col items-center text-primary-foreground"
            onSubmit={handleSubmit}
          >
            <div className="mb-8 w-full text-left">
              <h1 className="mb-0.5 text-2xl font-bold sm:text-3xl">
                OTP Verification
              </h1>

              <p className="text-xs text-secondary">
                Check your email to see the verification code
              </p>
              <p className="text-[11px] text-secondary mt-2">
                If an account exists for that email, a verification code was sent.
              </p>
            </div>

            <div className="mb-8 flex w-full justify-center">
              <InputOTP value={otp} onChange={handleOtpChange} maxLength={6}>
                <InputOTPGroup className="gap-1.5 sm:gap-2.5">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="
                        h-9 w-9 sm:h-10 sm:w-10
                        rounded-full
                        bg-white
                        border border-input
                        text-sm sm:text-base
                        font-semibold
                        text-primary
                      "
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="mt-4">
              {(error || verifyError) && <ErrorMessage message={error || verifyError || ""} />}
            </div>

            <div className="mt-2 mb-6 w-full flex justify-center">
              <Button
                type="submit"
                disabled={isVerified || verifyingCode}
                className={`w-full max-w-[220px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
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
                  verifyingCode ? "Verifying..." : "Verify Code"
                )}
              </Button>
            </div>

            <div className="text-xs text-primary-foreground text-center w-full">
              {showTimer ? (
                <p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={seconds > 0 || isResending}
                    className="underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isResending ? "Resending..." : "Resend"}
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
                    disabled={isResending}
                    className="underline text-secondary hover:text-secondary-foreground font-medium"
                  >
                    {isResending ? "Resending..." : "Resend code"}
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
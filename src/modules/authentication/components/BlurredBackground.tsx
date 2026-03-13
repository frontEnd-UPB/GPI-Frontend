import React from "react";
import bgImage from "../assets/auth_bg_image.png";

interface BlurredBackgroundProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ children, className = "", style }) => (
  <div
    className={`relative flex w-full flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12 ${className}`}
    style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      ...style,
    }}
  >
    {/* Blur overlay */}
    <div
      className="absolute inset-0 backdrop-blur-sm"
      style={{ background: "rgba(255, 255, 255, 0.3)" }}
    />
    {children}
  </div>
);

export default BlurredBackground;

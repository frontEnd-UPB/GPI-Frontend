import React from "react";
import bgImage from "../assets/auth_bg_image.png";

interface BlurredBackgroundProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const BlurredBackground: React.FC<BlurredBackgroundProps> = ({ children, className = "", style }) => (
  <div
    className={`min-h-screen flex items-center justify-center p-4 relative ${className}`}
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

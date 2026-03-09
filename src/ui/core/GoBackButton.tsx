import React from "react";
import { useNavigate } from "react-router-dom";

export interface GoBackButtonProps {
  label?: string;
  className?: string;
}

function ArrowLeftIcon() {
  return (
    <svg
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.61538 10L0 5M0 5L4.61538 0M0 5H10.8333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({
  label = "Go Back",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-muted px-4 py-2 text-primary hover:bg-muted/80 transition-colors"
      >
        <span className="inline-flex text-primary">
          <ArrowLeftIcon />
        </span>
        <span className="text-base font-medium leading-none text-primary">
          {label}
        </span>
      </button>
    </div>
  );
};

export default GoBackButton;

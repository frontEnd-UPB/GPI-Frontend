import React from "react";

interface TitleProps {
  title?: string;
  onViewHistoryClick?: () => void;
}

const Title: React.FC<TitleProps> = ({ title = "Vacation Management", onViewHistoryClick }) => {
  const showHistoryButton = Boolean(onViewHistoryClick);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-secondary">
        {title}
      </h2>
      {showHistoryButton && (
        <button
          type="button"
          className="text-sm font-medium text-secondary hover:underline hover:text-secondary/80"
          onClick={onViewHistoryClick}
        >
          View vacations History
        </button>
      )}
    </div>
  );
};

export default Title;

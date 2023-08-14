import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  desc?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "text-blue-500",
  desc,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-5 w-5";
      case "large":
        return "h-10 w-10";
      default:
        return "h-7 w-7";
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <p>{desc}</p>
      <div className={`animate-spin ${getSizeClasses()} ${color}`}>
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12a10 10 0 0010 10 1 1 0 001-1 1 1 0 00-1-1 8 8 0 11-4.58-7.14" />
        </svg>
      </div>
    </div>
  );
};

export default LoadingSpinner;

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
      <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin text-c4"></div>
    </div>
  );
};

export default LoadingSpinner;

import React, { useEffect } from "react";

export const CloseConfirmation: React.FC = () => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // Chrome requires a non-empty string to show the confirmation message
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <div>{/* Your component content goes here */}</div>;
};

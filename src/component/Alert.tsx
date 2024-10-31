import React, { useEffect } from "react";

interface AlertProps {
  message: string;
  type?: "success" | "warning" | "error" | "info";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = "success", onClose }) => {
  const typeClasses = {
    success: "bg-green-100 text-green-800 border-green-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    error: "bg-red-100 text-red-800 border-red-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 border-l-4 p-4 rounded-md mb-4 flex items-center gap-2 ${
        typeClasses[type]
      }`}
    >
      <p>{message}</p>
    </div>
  );
};

export default Alert;

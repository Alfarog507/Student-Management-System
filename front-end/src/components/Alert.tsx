import React from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-700";
      case "error":
        return "bg-red-100 border-red-400 text-red-700";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-700";
      default:
        return "bg-gray-100 border-gray-400 text-gray-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${getAlertStyles()}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2">{getIcon()}</span>
          <p>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

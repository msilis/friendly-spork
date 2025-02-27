import { useContext } from "react";
import { AlertContext } from "~/contexts/alertContext";

export const useToast = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useToast must be used within AlertProvider");

  return context;
};

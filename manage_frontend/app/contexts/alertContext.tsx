import { createContext, ReactNode, useEffect, useReducer } from "react";
import { toastReducer } from "~/components/componentUtils";
import ToastContainer from "~/components/ToastContainer";

const initialToastState = {
  toasts: [],
};

type ToastType = "success" | "warning" | "error";
interface AlertContextType {
  addToast?: (toastType: ToastType, message: string) => void;
  success?: (message: string) => void;
  warning?: (message: string) => void;
  error?: (message: string) => void;
  removeToast?: (id: string | number) => void;
}
export const AlertContext = createContext<AlertContextType | undefined>(
  undefined
);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(toastReducer, initialToastState);
  const addToast = (toastType: ToastType, message: string): void => {
    const id = Math.floor(Math.random() * 1000000);
    dispatch({ type: "ADD_TOAST", payload: { id, message, toastType } });
  };

  const success = (message: string) => {
    addToast("success", message);
  };

  const warning = (message: string) => {
    addToast("warning", message);
  };
  const error = (message: string) => {
    addToast("error", message);
  };

  const removeToast = (id: number | string) => {
    dispatch({ type: "DELETE_TOAST", payload: id });
  };

  useEffect(() => {
    if (state.toasts.length > 0) {
      const toastToRemove = state.toasts[0].id;
      const timer = setTimeout(() => removeToast(toastToRemove), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.toasts]);

  const contextValue = { success, warning, error, removeToast };

  return (
    <AlertContext.Provider value={contextValue}>
      <ToastContainer toasts={state.toasts} />
      {children}
    </AlertContext.Provider>
  );
};

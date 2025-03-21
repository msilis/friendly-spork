import Toast from "./Toasts";

export type Toast = {
  toastType: "success" | "warning" | "error" | "";
  message?: string;
  id: string | number;
};

export interface ToastType {
  toasts: Toast[];
}

const ToastContainer = ({ toasts }: ToastType) => {
  return (
    <div className="toast">
      {toasts.map((toast, index) => (
        <Toast
          key={String(index)}
          toastType={toast.toastType}
          text={toast.message}
          id={toast.id}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

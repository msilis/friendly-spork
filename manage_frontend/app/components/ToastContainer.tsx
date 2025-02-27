import Toast from "./Toasts";

type Toast = {
  toastType: "success" | "warning" | "error" | "";
  message?: string;
  id?: string;
};

interface ToastType {
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
        />
      ))}
    </div>
  );
};

export default ToastContainer;

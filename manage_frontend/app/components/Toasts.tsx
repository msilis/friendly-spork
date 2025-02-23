type ToastType = {
  toastType: "success" | "warning" | "error" | "";
  text?: string;
  id?: string | number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Toast = ({ toastType, text, id }: ToastType) => {
  return (
    <div role="alert" className={`alert alert-${toastType}`}>
      {text ? text : ""}
    </div>
  );
};

export default Toast;

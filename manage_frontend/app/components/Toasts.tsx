export type SingleToastType = {
  toastType: "success" | "warning" | "error" | "";
  text?: string;
  id?: string | number | undefined;
};

const Toast = ({ toastType, text, id }: SingleToastType) => {
  return (
    <div role="alert" id={String(id)} className={`alert alert-${toastType}`}>
      {text ? text : ""}
    </div>
  );
};

export default Toast;

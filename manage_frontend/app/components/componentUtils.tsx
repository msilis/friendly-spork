import { SingleToastType } from "./Toasts";

type ToastState = {
  toasts: SingleToastType[];
};

interface CountAction {
  type: "ADD_TOAST" | "DELETE_TOAST";
  payload: {
    id: string | number;
    message?: string;
    toastType: "success" | "warning" | "error" | "";
  };
}
export const toastReducer = (state: ToastState, action: CountAction) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case "DELETE_TOAST": {
      const updatedToasts = state.toasts.filter(
        (toast: SingleToastType) => toast.id !== action.payload.id
      );
      return {
        ...state,
        toasts: updatedToasts,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// ToastContext.jsx
import { createContext, useContext } from "react";
import { toast } from "react-toastify";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  // Notify function for reuse
  const notify = (message, type = "default") => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      pauseOnHover: true,
      draggable: true,
    };

    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "info":
        toast.info(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;

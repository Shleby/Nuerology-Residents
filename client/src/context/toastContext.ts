import { createContext, useContext } from "react";

export type ToastContextType = {
  registerSuccess: boolean;
  toggleRegisterSuccess: (value: boolean) => void;
  logoutSuccess: boolean;
  toggleLogoutSuccess: (value: boolean) => void;
  loginSuccess: boolean;
  toggleLoginSuccess: (value: boolean) => void;
};

export const ToastContext = createContext<ToastContextType>({
  registerSuccess: false,
  toggleRegisterSuccess: (registerSuccess) => console.warn("No rs provider"),
  logoutSuccess: false,
  toggleLogoutSuccess: (logoutSuccess) => console.warn("No rs provider"),
  loginSuccess: false,
  toggleLoginSuccess: (loginSuccess) => console.warn("No rs provider"),
});

export const useToastContext = () => useContext(ToastContext);

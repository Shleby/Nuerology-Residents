import { createContext, useContext } from "react";

export type UserContextType = {
  email: string;
  password: string;
  token: string;
  displayName: string;
  userType: string;
  loggedIn: Boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setToken: (value: string) => void;
  setDisplayName: (value: string) => void;
  setUserType: (value: string) => void;
  setLoggedIn: (value: Boolean) => void;
};
export function createCtx<UserContextType>() {
  const ctx = createContext<UserContextType | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (!c) {
      throw new Error("useCtx must be inside a Provider with a value");
    }
    return c;
  }
  return [useCtx, ctx.Provider] as const;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUserContext = () => useContext(UserContext);

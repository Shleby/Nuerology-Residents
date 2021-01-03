import { createContext, useContext } from "react";

export type UserContextType = {
  userData: any;
  setUserData: (User: any) => void;
};

export const UserContext = createContext<UserContextType>({
  userData: {},
  setUserData: (user) => console.warn("no user provider"),
});

export const useUserContext = () => useContext(UserContext);

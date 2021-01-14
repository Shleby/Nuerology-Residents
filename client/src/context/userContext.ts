import { createContext, useContext } from "react";

export type UserContextType = {
  email: string;
  toggleEmail: (value: string) => void;
  token: string;
  toggleToken: (value: string) => void;
  displayName: string;
  toggleDisplayName: (value: string) => void;
  userType: string;
  toggleUserType: (value: string) => void;
  loggedIn: boolean;
  toggleLoggedIn: (value: boolean) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUserContext = () => useContext(UserContext);

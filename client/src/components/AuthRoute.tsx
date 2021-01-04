import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import React from "react";
import { NonAuthRoutes } from "../authentication/userAuth";
import { useUserContext } from "../context/userContext";

interface IAuthRouteProps {
  Component: React.FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
  requiredRoles: string[];
}

export const AuthRoute = ({
  Component,
  path,
  exact = false,
  requiredRoles,
}: IAuthRouteProps): JSX.Element => {
  const { loggedIn, userType } = useUserContext()!;

  const userHasRequiredRole = requiredRoles.includes(userType);
  const isAuthenticated = loggedIn; // TODO: verify if token is still valid

  const message = userHasRequiredRole
    ? "Please log in to view this page"
    : "You do not have authorized access";

  return (
    <Route
      exact={exact}
      path={path}
      render={(props: RouteComponentProps) =>
        isAuthenticated && userHasRequiredRole ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: userHasRequiredRole
                ? NonAuthRoutes.login
                : NonAuthRoutes.unauthorized,
              state: { message, requestedPath: path },
            }}
          />
        )
      }
    />
  );
};

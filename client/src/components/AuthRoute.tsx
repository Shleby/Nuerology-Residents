import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import React from "react";
import { NonAuthRoutes } from "../authentication/userAuth";
import Cookies from "universal-cookie";

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
  const cookies = new Cookies();
  const userHasRequiredRole = requiredRoles.includes(
    cookies.get("usertype") || ""
  );

  const message = userHasRequiredRole
    ? "Please log in to view this page"
    : "You do not have authorized access";

  return (
    <Route
      exact={exact}
      path={path}
      render={(props: RouteComponentProps) =>
        cookies.get("success") && userHasRequiredRole ? (
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

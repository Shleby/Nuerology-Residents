import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import React, { useContext } from "react";
import { NonAuthRoutes } from "../authentication/userAuth";

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
  //   const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);
  const isAuthenticated = false;
  //   const { userRole } = useContext(UserRoleContext);
  //   const userHasRequiredRole = requiredRoles.includes(userRole);
  const userHasRequiredRole = true;
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

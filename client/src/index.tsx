import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./pages/authPages/Login";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./pages/authPages/Signup";
import NotFound from "./pages/NotFound";
import {
  AuthRoutes,
  NonAuthRoutes,
  UserRoles,
} from "./authentication/userAuth";
import { AuthRoute } from "./components/AuthRoute";
import Unauthorized from "./pages/Unauthorized";
import { UserContext } from "./context/userContext";
import ResidentLanding from "./pages/resident_pages/ResidentLanding";
import { ToastContext } from "./context/toastContext";
import AdminLanding from "./pages/admin_pages/AdminLanding";

ReactDOM.render(
  <React.StrictMode>
    <CreateRouting />
  </React.StrictMode>,
  document.getElementById("root")
);

function CreateRouting() {
  // Used for initializing the context provider
  const [uemail, setEmail] = useState<string>("");
  const [utoken, setToken] = useState<string>("");
  const [udisplayName, setDisplayName] = useState<string>("");
  const [uuserType, setUserType] = useState<string>("");
  const [uloggedIn, setLoggedIn] = useState<boolean>(false);
  const [rSuccess, toggleRSuccess] = useState<boolean>(false);
  const [lSuccess, toggleLSuccess] = useState<boolean>(false);
  const [inSuccess, toggleInSuccess] = useState<boolean>(false);

  return (
    <ToastContext.Provider
      value={{
        registerSuccess: rSuccess,
        toggleRegisterSuccess: toggleRSuccess,
        logoutSuccess: lSuccess,
        toggleLogoutSuccess: toggleLSuccess,
        loginSuccess: inSuccess,
        toggleLoginSuccess: toggleInSuccess,
      }}
    >
      <UserContext.Provider
        value={{
          email: uemail,
          toggleEmail: setEmail,
          token: utoken,
          toggleToken: setToken,
          displayName: udisplayName,
          toggleDisplayName: setDisplayName,
          userType: uuserType,
          toggleUserType: setUserType,
          loggedIn: uloggedIn,
          toggleLoggedIn: setLoggedIn,
        }}
      >
        <Router>
          <Switch>
            {/* Paths accessible for all users */}
            <Route path={NonAuthRoutes.register} component={Signup} />
            <Route exact path={NonAuthRoutes.login} component={Login} />
            {/* Paths accessible for authenticated residents */}
            <AuthRoute
              path={AuthRoutes.residentAccount}
              Component={NotFound}
              requiredRoles={[
                String(UserRoles.resident),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            <AuthRoute
              path={AuthRoutes.residentDashboard}
              Component={ResidentLanding}
              requiredRoles={[
                String(UserRoles.resident),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            <AuthRoute
              path={AuthRoutes.residentStatistics}
              Component={NotFound}
              requiredRoles={[
                String(UserRoles.resident),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            {/* Paths available for authenticated attendees */}
            <AuthRoute
              path={AuthRoutes.attendeeAccount}
              Component={NotFound}
              requiredRoles={[
                String(UserRoles.attendee),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            <AuthRoute
              path={AuthRoutes.attendeeDashboard}
              Component={NotFound}
              requiredRoles={[
                String(UserRoles.attendee),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            <AuthRoute
              path={AuthRoutes.attendeeStatistics}
              Component={NotFound}
              requiredRoles={[
                String(UserRoles.attendee),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            {/* Paths available for authenticated nurses */}
            <AuthRoute
              path={AuthRoutes.nurseAccount}
              Component={NotFound}
              requiredRoles={[
                String(UserRoles.nurse),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            <AuthRoute
              path={AuthRoutes.nurseDashboard}
              Component={NotFound}
              requiredRoles={[
                String(UserRoles.nurse),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            <AuthRoute
              path={AuthRoutes.nurseStatistics}
              Component={NotFound}
              requiredRoles={[
                String(UserRoles.nurse),
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            {/* Paths available for authenticated admins */}
            <AuthRoute
              path={AuthRoutes.adminPanel}
              Component={AdminLanding}
              requiredRoles={[
                String(UserRoles.admin),
                String(UserRoles.superAdmin),
              ]}
            />
            {/* Paths for edge cases */}
            <Route path={NonAuthRoutes.unauthorized} component={Unauthorized} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </UserContext.Provider>
    </ToastContext.Provider>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { makeStyles, TextField, Theme } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import HomeSvg from "../../components/HomeSvg";
import { useToastContext } from "../../context/toastContext";
import "../../App.css";
import Cookies from "universal-cookie";
import { LogoutApi } from "../../authentication/jwtFunctions";
import { ColorButton } from "../../components/ColorButton";

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    color: "#8a6565 !important",
    backgroundColor: "white !important",
    "& MuiFormLabel-root.Mui-focused": {
      color: "#8a6565",
      backgroundColor: "white",
    },
    "&:focus": {
      color: "#8a6565",
      backgroundColor: "white",
    },
    "&:after": {
      borderBottom: `2px solid #8a6565`,
      backgroundColor: "white",
    },
    "&:hover": {
      color: "#8a6565",
      backgroundColor: "white",
    },
    "&:selected": {
      color: "#8a6565",
      backgroundColor: "white",
    },
  },
}));

export default function Login() {
  const {
    registerSuccess,
    toggleRegisterSuccess,
    logoutSuccess,
    toggleLogoutSuccess,
    loginSuccess,
    toggleLoginSuccess,
  } = useToastContext();
  const classes = useStyles();
  const history = useHistory();
  const cookies = new Cookies();

  // States kept track of for the login form
  const [formEmail, setFormEmail] = useState<string>("");
  const [formPassword, setFormPassword] = useState<string>("");
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  /**
   * Renders in a toast
   */
  useEffect(() => {
    if (registerSuccess) {
      toast.success("Successfully Registered", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      toggleRegisterSuccess(false);
    }
    if (logoutSuccess) {
      toast.dark("Successfully Logged Out", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      toggleLogoutSuccess(false);
    }
    if (cookies.get("usertype") != null) {
      setLoggedIn(cookies.get("success"));
    }
  });

  /**
   * Form change listener that updates state on change
   * @param e Change listener
   * @param formID Marks which state to update
   */
  function onFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formID: string
  ) {
    e.preventDefault();
    if (formID === "email") {
      setFormEmail(e.target.value);
    } else if (formID === "password") {
      setFormPassword(e.target.value);
    }
  }

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const userData = {
      email: formEmail,
      password: formPassword,
    };

    try {
      await axios({
        method: "POST",
        url: "http://localhost:5000/api/login",
        data: userData,
        headers: { "content-type": "application/json" },
      }).then((res) => {
        toggleLoginSuccess(true);
        resetForm();
        console.log(res);
        if (res.data.success) {
          setLoggedIn(res.data.success);
          cookies.set("token", res.data.token, {
            // sameSite: "strict",
            // httpOnly: true,
            // secure: true,
            // expires: new Date(Date.now()+3600
          });
          cookies.set("email", res.data.message.email, {
            // sameSite: "strict",
            // httpOnly: true,
            // secure: true,
            // maxAge: 3600,
          });
          cookies.set("displayname", res.data.message.displayName, {
            // sameSite: "strict",
            // httpOnly: true,
            // secure: true,
            // maxAge: 3600,
          });
          cookies.set("usertype", res.data.message.userType, {
            // sameSite: "strict",
            // httpOnly: true,
            // secure: true,
            // maxAge: 3600,
          });
          cookies.set("success", res.data.success, {
            // sameSite: "strict",
            // httpOnly: true,
            // secure: true,
            // maxAge: 3600,
          });
          if (res.data.message.userType === "resident") {
            console.log("Successfully Logged In");
            history.push("/resident_dashboard");
          } else if (res.data.message.userType === "attendee") {
            console.log("Successfully Logged In");
            history.push("/attendee_dashboard");
          } else if (res.data.message.userType === "nurse") {
            console.log("Successfully Logged In");
            history.push("/nurse_dashboard");
          } else if (res.data.message.userType === "admin") {
            console.log("Successfully Logged In");
            history.push("/admin");
          } else if (res.data.message.userType === "superAdmin") {
            console.log("Successfully Logged In");
            history.push("/admin");
          }
        }
      });
    } catch (err) {
      console.log(err);
    }

    if (!loginSuccess) {
      toast.dark("Invalid Login Credentials", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    resetForm();
  };

  function resetForm() {
    setFormEmail("");
    setFormPassword("");
  }

  async function logout(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    await LogoutApi();
    toggleLogoutSuccess(true);
    setLoggedIn(false);
  }

  function GoToDashboard() {
    if (cookies.get("usertype") === "resident") {
      return (
        <Link to="/resident_dashboard" className="lg:text-lg">
          <text className="text-white lg:text-crimson">
            Go to dashboard -{">"}
          </text>
        </Link>
      );
    } else if (cookies.get("usertype") === "attendee") {
      return (
        <Link to="/attendee_dashboard" className="lg:text-lg">
          <text className="text-white lg:text-crimson">
            Go to dashboard -{">"}
          </text>
        </Link>
      );
    } else if (cookies.get("usertype") === "nurse") {
      return (
        <Link to="/nurse_dashboard" className="lg:text-lg">
          <text className="text-white lg:text-crimson">
            Go to dashboard -{">"}
          </text>
        </Link>
      );
    } else if (
      cookies.get("usertype") === "admin" ||
      cookies.get("usertype") === "superAdmin"
    ) {
      return (
        <Link to="/admin" className="lg:text-lg">
          <text className="text-white lg:text-crimson">
            Go to dashboard -{">"}
          </text>
        </Link>
      );
    } else {
      return (
        <text className="text-white lg:text-crimson">
          Error, please log out. User type not found
        </text>
      );
    }
  }

  if (isLoggedIn) {
    return (
      <div className="lg:grid lg:grid-cols-3 lg:bg-none lg:pt-0 lg:px-0 lg:justify-items-stretch lg:text-black text-white h-screen w-full flex flex-col pt-5 px-3 overflow-hidden bg-login-img justify-items-center items-center text-white">
        <div className="lg:col-span-2 lg:h-screen lg:bg-login-img lg:bg-cover lg:bg-no-repeat lg:bg-center">
          <div className="lg:mt-6 lg:ml-6 lg:text-4xl font-quicksand flex flex-row items-center">
            <HomeSvg />
            <h1 className="lg:text-white text-xl sm:text-4xl">
              Track your time in Residency
            </h1>
          </div>
        </div>
        <div className="lg:shadow-2xl lg:shadow-inner lg:h-screen lg:grid lg:justify-items-center lg:w-full w-full sm:w-9/12">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className="enter-anim lg:block lg:rounded-lg lg:shadow-2xl lg:w-3/4 lg:bg-white lg:h-64 sm:flex-col sm:flex lg:p-6">
            <h1 className="lg:text-4xl lg:text-crimson text-white">
              Welcome back
            </h1>
            <h1 className="lg:text-4xl text-white lg:text-black">
              {cookies.get("displayname")}
            </h1>
            <h2 className="lg:text-2xl">
              <text className="lg:text-lightGrey">
                You are already logged in
              </text>
            </h2>
            {GoToDashboard()}
            <div>
              <ColorButton className="w-full" onClick={(e) => logout(e)}>
                Logout
              </ColorButton>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="lg:grid lg:grid-cols-3 lg:bg-none lg:pt-0 lg:px-0 lg:justify-items-stretch lg:text-black text-white h-screen w-full flex flex-col pt-5 px-3 overflow-hidden bg-login-img justify-items-center items-center text-white">
        <div className="lg:col-span-2 lg:h-screen lg:bg-login-img lg:bg-cover lg:bg-no-repeat lg:bg-center">
          <div className="lg:mt-6 lg:ml-6 lg:text-4xl font-quicksand flex flex-row items-center">
            <HomeSvg />
            <h1 className="lg:text-white text-xl sm:text-4xl">
              Track your time in Residency
            </h1>
          </div>
        </div>
        <div className="lg:shadow-2xl lg:shadow-inner lg:h-screen lg:grid lg:justify-items-center lg:w-full w-full sm:w-9/12">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className="enter-anim lg:block lg:rounded-lg lg:shadow-2xl lg:w-3/4 lg:bg-white sm:flex-col sm:flex lg:p-6">
            <h1 className="xl:text-4xl lg:text-left text-center text-2xl sm:text-3xl lg:text-crimson text-white">
              Welcome back
            </h1>
            <h2 className="lg:text-left lg:text-3xl text-center text-2xl xl:text-4xl sm:text-3xl">
              <text className="text-lightGrey">Login</text> /{" "}
              <Link to="/register">Sign up</Link>
            </h2>
            <form className="lg:pt-4 pt-20" onSubmit={submit}>
              <div className="w-full">
                <div className="pb-2">
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    variant="filled"
                    className="w-full"
                    value={formEmail}
                    required
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => onFormChange(e, "email")}
                    InputProps={{
                      className: classes.textField,
                    }}
                    InputLabelProps={{
                      className: classes.textField,
                    }}
                  />
                </div>
                <div className="pb-2">
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    variant="filled"
                    className="w-full"
                    value={formPassword}
                    type="password"
                    required
                    defaultValue=""
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => onFormChange(e, "password")}
                    InputProps={{
                      className: classes.textField,
                    }}
                    InputLabelProps={{
                      className: classes.textField,
                    }}
                  />
                </div>

                <ColorButton
                  variant="contained"
                  className="w-full"
                  type="submit"
                  onSubmit={submit}
                >
                  Login
                </ColorButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

import {
  Button,
  makeStyles,
  TextField,
  Theme,
  withStyles,
} from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import HomeSvg from "../../components/HomeSvg";
import { useToastContext } from "../../context/toastContext";
import "../../App.css";
import Cookies from "universal-cookie";
import { LogoutApi } from "../../authentication/jwtFunctions";

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
  const ColorButton = withStyles((theme: Theme) => ({
    root: {
      color: "white",
      backgroundColor: "#841617",
      "&:hover": {
        backgroundColor: "rgba(132,22,23,0.8)",
      },
      marginTop: "20px",
    },
  }))(Button);

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

  if (isLoggedIn) {
    return (
      <div className="xl:grid xl:grid-cols-3">
        <div className="xl:col-span-2 xl:h-screen xl:bg-img">
          <div className="xl:flex xl:flex-row xl:items-center xl:mt-6 xl:ml-6 xl:text-4xl font-quicksand">
            <HomeSvg />
            <h1 className="text-white">Track your time in Residency</h1>
          </div>
        </div>
        <div className="xl:bg-white xl:shadow-2xl xl:shadow-inner xl:h-screen xl:grid xl:justify-items-center">
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
          <div className="enter-anim xl:rounded-lg xl:shadow-2xl xl:w-3/4 xl:bg-white xl:mt-96 xl:h-64 xl:flex-col xl:flex xl:p-6">
            <h1 className="xl:text-4xl" style={{ color: "#841617" }}>
              Welcome back
            </h1>
            <h1 className="xl:text-4xl" style={{ color: "black" }}>
              {cookies.get("displayname")}
            </h1>
            <h2 className="xl:text-2xl">
              <text className="xl:text-lightGrey">
                You are already logged in
              </text>
            </h2>
            <Link to="/resident_dashboard" className="xl:text-lg">
              <text style={{ color: "#841617" }}>Go to dashboard -{">"}</text>
            </Link>
            <ColorButton onClick={(e) => logout(e)}>Logout</ColorButton>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="xl:grid xl:grid-cols-3 xl:overflow-hidden">
        <div className="xl:col-span-2 xl:h-screen bg-img">
          <div className="xl:flex xl:flex-row xl:items-center xl:mt-6 xl:ml-6 xl:text-4xl font-quicksand">
            <HomeSvg />
            <h1 className="xl:text-white">Track your time in Residency</h1>
          </div>
        </div>
        <div className=" xl:bg-white xl:shadow-2xl xl:shadow-inner xl:h-screen xl:grid xl:justify-items-center">
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
          <div className="enter-anim xl:rounded-lg xl:shadow-2xl xl:w-3/4 xl:bg-white xl:mt-96 xl:h-96 xl:flex-col xl:flex xl:p-9">
            <h1 className="xl:text-4xl" style={{ color: "#841617" }}>
              Welcome back
            </h1>
            <h2 className="xl:text-3xl">
              <text className="xl:text-lightGrey">Login</text> /{" "}
              <Link to="/register">Sign up</Link>
            </h2>
            <form
              className="xl:flex xl:flex-col xl:mt-6 xl:gap-4"
              onSubmit={submit}
            >
              <TextField
                id="email"
                name="email"
                label="Email"
                variant="filled"
                value={formEmail}
                required
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => onFormChange(e, "email")}
                InputProps={{
                  className: classes.textField,
                }}
                InputLabelProps={{
                  className: classes.textField,
                }}
              />
              <TextField
                id="password"
                name="password"
                label="Password"
                variant="filled"
                value={formPassword}
                type="password"
                required
                defaultValue=""
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => onFormChange(e, "password")}
                InputProps={{
                  className: classes.textField,
                }}
                InputLabelProps={{
                  className: classes.textField,
                }}
              />
              <ColorButton variant="contained" type="submit" onSubmit={submit}>
                Login
              </ColorButton>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

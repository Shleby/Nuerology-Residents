import {
  Button,
  makeStyles,
  TextField,
  Theme,
  withStyles,
} from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../App.css";
import HomeSvg from "../../components/HomeSvg";
import { useUserContext } from "../../context/userContext";

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
    email,
    password,
    token,
    displayName,
    userType,
    loggedIn,
    setEmail,
    setPassword,
    setToken,
    setDisplayName,
    setUserType,
    setLoggedIn,
  } = useUserContext()!;
  const classes = useStyles();
  const history = useHistory();

  // States kept track of for the login form
  const [formEmail, setFormEmail] = useState<string | null>(null);
  const [formPassword, setFormPassword] = useState<string | null>(null);

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
    },
  }))(Button);

  const handleLogout = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await axios({
        method: "GET",
        url: "http://localhost:5000/api/logout",
      }).then((res) => {
        setToken("");
        setLoggedIn(false);
        setUserType("");
        setDisplayName("");
        setEmail("");
        setPassword("");
      });
    } catch (err) {
      console.log(err);
    }
  };

  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const userData = {
      email: formEmail,
      password: formPassword,
    };

    try {
      axios({
        method: "POST",
        url: "http://localhost:5000/api/login",
        data: userData,
        headers: { "content-type": "application/json" },
      }).then((res) => {
        setToken(res.data.token);
        setLoggedIn(res.data.success);
        setUserType(res.data.message.userType);
        setDisplayName(res.data.message.displayName);
        setEmail(res.data.message.email);
        setPassword(res.data.message.password);
      });
    } catch (err) {
      console.log(err);
    }
    // First Reset Form
    resetForm();

    // Second, if the user logged in, push to their landing page
    console.log("Attempting to redirect");
    console.log(loggedIn);
    if (loggedIn) {
      console.log("Logged in");
      if (userType === "resident") {
        console.log("Successfully Logged In");
        history.push("/resident_dashboard");
      } else if (userType === "attendee") {
        console.log("Successfully Logged In");
        history.push("/attendee_dashboard");
      } else if (userType === "nurse") {
        console.log("Successfully Logged In");
        history.push("/nurse_dashboard");
      } else if (userType === "admin") {
        console.log("Successfully Logged In");
        history.push("/admin");
      }
    }
  };

  function resetForm() {
    setFormEmail("");
    setFormPassword("");
  }
  if (!loggedIn) {
    return (
      <div className="grid grid-cols-3">
        <div className="col-span-2 h-screen bg-img">
          <div className="flex flex-row items-center mt-6 ml-6 text-4xl font-quicksand">
            <HomeSvg />
            <h1 className="text-white">Track your time in Residency</h1>
          </div>
        </div>
        <div className="bg-white shadow-2xl shadow-inner h-screen grid justify-items-center">
          <div className="enter-anim rounded-lg shadow-2xl w-3/4 bg-white mt-96 h-80 flex-col flex p-6">
            <h1 className="text-4xl" style={{ color: "#841617" }}>
              Welcome back
            </h1>
            <h2 className="text-3xl">
              <text className="text-lightGrey">Login</text> /{" "}
              <Link to="/register">Sign up</Link>
            </h2>
            <form className="flex flex-col mt-6 gap-4" onSubmit={submit}>
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
  } else {
    return (
      <div className="grid grid-cols-3">
        <div className="col-span-2 h-screen bg-img">
          <div className="flex flex-row items-center mt-6 ml-6 text-4xl font-quicksand">
            <HomeSvg />
            <h1 className="text-white">Track your time in Residency</h1>
          </div>
        </div>
        <div className="bg-white shadow-2xl shadow-inner h-screen grid justify-items-center">
          <div className="enter-anim rounded-lg shadow-2xl w-3/4 bg-white mt-96 h-60 flex-col flex p-6">
            <h1 className="text-4xl" style={{ color: "#841617" }}>
              Welcome back
            </h1>
            <h1 className="text-4xl" style={{ color: "black" }}>
              {displayName}
            </h1>
            <h2 className="text-2xl">
              <text className="text-lightGrey">You are already logged in</text>
            </h2>
            <Link to="/resident_dashboard" className="text-lg">
              <text style={{ color: "#841617" }}>Go to dashboard -{">"}</text>
            </Link>
            <ColorButton onClick={handleLogout}>Logout</ColorButton>
          </div>
        </div>
      </div>
    );
  }
}

import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import HomeSvg from "../../components/HomeSvg";
import "../../App.css";
import {
  Button,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  RadioProps,
  TextField,
  Theme,
  withStyles,
} from "@material-ui/core";
import Recaptcha from "react-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as EmailValidator from "email-validator";
import { useToastContext } from "../../context/toastContext";

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

export default function Signup() {
  const classes = useStyles();
  const history = useHistory();
  const { toggleRegisterSuccess } = useToastContext();

  /**
   * Registration states to keep track of
   */
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordCheck, setPasswordCheck] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [ouid, setOUID] = useState<string | null>(null);
  const [recaptchaLoad, setRecaptchaLoad] = useState(true);
  const [isVerified, setIsVerified] = useState(true);

  /**
   * Methods to support recaptcha
   */
  function recaptchaLoaded() {
    setRecaptchaLoad(true);
  }

  function verifiedRecaptcha(e: any) {
    if (e) {
      setIsVerified(true);
    }
  }

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
      setEmail(e.target.value);
    } else if (formID === "password") {
      setPassword(e.target.value);
    } else if (formID === "check") {
      setPasswordCheck(e.target.value);
    } else if (formID === "name") {
      setDisplayName(e.target.value);
    } else if (formID === "ouid") {
      setOUID(e.target.value);
    }
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserRole((event.target as HTMLInputElement).value);
  };

  const StyledRadio = withStyles({
    root: {
      color: "#841617",
      "&$checked": {
        color: "#841617",
      },
    },
    checked: {},
  })((props: RadioProps) => <Radio color="default" {...props} />);

  const ColorButton = withStyles((theme: Theme) => ({
    root: {
      color: "white",
      backgroundColor: "#841617",
      "&:hover": {
        backgroundColor: "rgba(132,22,23,0.8)",
      },
    },
  }))(Button);

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (userRole === "") {
      toast.dark("No Account Type selected", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (userRole === "resident" && ouid?.length !== 9) {
      toast.dark("Incorrect OUID", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (password !== passwordCheck) {
      toast.dark("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (!EmailValidator.validate(String(email))) {
      toast.dark("Email is invalid", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    // Passes recaptcha verifications
    if (recaptchaLoad && isVerified) {
      const userData = {
        email: email,
        password: password,
        passwordCheck: passwordCheck,
        ouid: ouid,
        displayName: displayName,
        userType: userRole,
      };
      try {
        await axios({
          method: "POST",
          url: "http://localhost:5000/api/register",
          data: userData,
          headers: { "content-type": "application/json" },
        }).then((res) => {
          toggleRegisterSuccess(true);
        });

        history.push("/");
      } catch (err) {
        if (err.message.includes("409")) {
          toast.dark("Account already exists", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.dark("Error in registration", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    }
    resetForm();
  };

  function resetForm() {
    setEmail("");
    setPassword("");
    setPasswordCheck("");
    setDisplayName("");
    setOUID("");
    setUserRole("");
  }
  return (
    <div className="2xl:grid 2xl:grid-cols-3 2xl:overflow-hidden xl:overflow-hidden xl:grid xl:grid-cols-3 lg:flex lg:flex-col">
      <div className="2xl:col-span-2 2xl:h-screen 2xl:bg-login-img 2xl:bg-cover 2xl:bg-no-repeat 2xl:bg-center xl:col-span-2 xl:h-screen xl:bg-login-img xl:bg-cover xl:bg-no-repeat xl:bg-center lg:bg-none md:bg-none sm:bg-none">
        <div className="2xl:flex 2xl:flex-row 2xl:items-center 2xl:mt-6 2xl:ml-6 2xl:text-4xl font-quicksand xl:flex xl:flex-row xl:items-center xl:mt-6 xl:ml-6 xl:text-4xl lg:p-8">
          <HomeSvg />
          <h1 className="2xl:text-white xl:text-white lg:text-center lg:text-4xl">
            Track your time in Residency
          </h1>
        </div>
      </div>
      <div className="2xl:bg-white 2xl:shadow-2xl 2xl:shadow-inner 2xl:h-screen 2xl:grid 2xl:justify-items-center xl:bg-white xl:shadow-2xl xl:shadow-inner xl:h-screen xl:grid xl:justify-items-center lg:grid">
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
        <div className="enter-anim 2xl:rounded-lg 2xl:shadow-2xl 2xl:w-3/4 2xl:bg-white 2xl:m-12 2xl:h-auto 2xl:flex-col 2xl:flex 2xl:p-6 xl:rounded-lg xl:shadow-2xl xl:w-3/4 xl:bg-white xl:m-12 xl:h-auto xl:flex-col xl:flex xl:p-6 lg:rounded-lg lg:shadow-2xl lg:w-auto lg:bg-white lg:h-auto lg:flex-col lg:flex lg:p-10 lg:place-self-center">
          <h1 className="2xl:text-4xl xl:text-3xl lg:text-3xl">
            <Link to="/">Login</Link> /{" "}
            <text className="2xl:text-lightGrey xl:text-lightGrey lg:text-lightGrey">
              Signup
            </text>
          </h1>
          <form
            className="2xl:flex 2xl:flex-col 2xl:mt-6 2xl:gap-4 xl:flex xl:flex-col xl:mt-6 xl:gap-4 "
            onSubmit={submit}
          >
            <p className="2xl:text-lg xl:text-base">Required Fields*</p>
            <FormLabel component="legend">
              <text className="2xl:text-base xl:text-sm">
                Select Account Type
              </text>
            </FormLabel>
            <div className="xl:flex xl:flex-col lg:grid lg:grid-cols-2 lg:gap-4 ">
              <RadioGroup
                defaultValue="Resident"
                aria-label="userRole"
                name="customized-radios"
                value={userRole}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="resident"
                  control={<StyledRadio />}
                  label="Resident"
                />
                <FormControlLabel
                  value="attendee"
                  control={<StyledRadio />}
                  label="Attendee"
                />
                <FormControlLabel
                  value="nurse"
                  control={<StyledRadio />}
                  label="Nurse"
                />
                <FormControlLabel
                  value="admin"
                  disabled
                  control={<StyledRadio />}
                  label="Administrator"
                />
              </RadioGroup>
              <div className="2xl:flex-none xl:flex-none lg:flex lg:flex-col">
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  variant="filled"
                  value={email}
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
                  value={password}
                  type="password"
                  required
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
                <TextField
                  id="check"
                  name="check"
                  label="Confirm Password"
                  variant="filled"
                  type="password"
                  value={passwordCheck}
                  required
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => onFormChange(e, "check")}
                  InputProps={{
                    className: classes.textField,
                  }}
                  InputLabelProps={{
                    className: classes.textField,
                  }}
                />
                <FormLabel component="legend">Required for residents</FormLabel>
                <TextField
                  id="ouid"
                  name="ouid"
                  label="OU ID (9-digit)"
                  variant="filled"
                  required={userRole === "resident"}
                  value={ouid}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => onFormChange(e, "ouid")}
                  InputProps={{
                    className: classes.textField,
                  }}
                  InputLabelProps={{
                    className: classes.textField,
                  }}
                />
                <p className="2xl:text-lg xl:text-base lg:text-sm">
                  Optional Fields
                </p>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  variant="filled"
                  value={displayName}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => onFormChange(e, "name")}
                  InputProps={{
                    className: classes.textField,
                  }}
                  InputLabelProps={{
                    className: classes.textField,
                  }}
                />
                <Recaptcha
                  // TODO: Genereate sitekey for this app, current one is shelbyhuffy.com
                  sitekey="6LeqMgAaAAAAAE9IOOKeYk34ElJ8BT7NfgeXp7Gk"
                  render="explicit"
                  onloadCallback={recaptchaLoaded}
                  verifyCallback={verifiedRecaptcha}
                />
              </div>
            </div>
            <ColorButton variant="contained" type="submit">
              Sign up
            </ColorButton>
          </form>
        </div>
      </div>
    </div>
  );
}

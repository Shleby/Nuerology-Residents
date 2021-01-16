import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import HomeSvg from "../../components/HomeSvg";
import "../../App.css";
import {
  FormControlLabel,
  FormLabel,
  makeStyles,
  RadioGroup,
  TextField,
  Theme,
} from "@material-ui/core";
import Recaptcha from "react-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as EmailValidator from "email-validator";
import { useToastContext } from "../../context/toastContext";
import { ColorButton } from "../../components/ColorButton";
import { StyledRadio } from "../../components/StyledRadio";

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
    <div className="lg:grid lg:grid-cols-3 lg:bg-none lg:pt-0 lg:px-0 lg:justify-items-stretch lg:text-black w-full flex flex-col pt-5 px-3 overflow-hidden bg-login-img justify-items-center items-center h-screen text-white">
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
        <div className="enter-anim lg:block lg:rounded-lg lg:shadow-2xl lg:w-3/4 lg:bg-white lg:p-6 sm:flex sm:flex-col">
          <h1 className="lg:text-left lg:text-3xl xl:text-4xl text-center text-2xl sm:text-3xl">
            <Link to="/">Login</Link> /{" "}
            <text className="text-lightGrey">Signup</text>
          </h1>
          <form className="pt-4" onSubmit={submit}>
            <p className="lg:block lg:pb-3 lg:text-lg hidden">
              Required Fields (*)
            </p>
            <FormLabel component="legend">
              <text className="lg:text-black lg:text-base text-white sm:text-xl">
                Select Account Type*
              </text>
            </FormLabel>
            <div>
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
                <div className="hidden">
                  <FormControlLabel
                    value="admin"
                    disabled
                    control={<StyledRadio />}
                    label="Administrator"
                  />
                </div>
              </RadioGroup>
              <div className="w-full">
                <div className="pb-2">
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    variant="filled"
                    className="w-full"
                    value={email}
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
                    value={password}
                    type="password"
                    required
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

                <div className="pb-2">
                  <TextField
                    id="check"
                    name="check"
                    label="Confirm Password"
                    variant="filled"
                    className="w-full"
                    type="password"
                    value={passwordCheck}
                    required
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => onFormChange(e, "check")}
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
                    id="ouid"
                    name="ouid"
                    label="OU ID (9-digit)"
                    variant="filled"
                    className="w-full"
                    required={userRole === "resident"}
                    value={ouid}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => onFormChange(e, "ouid")}
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
                    id="name"
                    name="name"
                    label="Name"
                    variant="filled"
                    className="w-full"
                    value={displayName}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => onFormChange(e, "name")}
                    InputProps={{
                      className: classes.textField,
                    }}
                    InputLabelProps={{
                      className: classes.textField,
                    }}
                  />
                </div>
                <Recaptcha
                  // TODO: Genereate sitekey for this app, current one is shelbyhuffy.com
                  sitekey="6LeqMgAaAAAAAE9IOOKeYk34ElJ8BT7NfgeXp7Gk"
                  render="explicit"
                  onloadCallback={recaptchaLoaded}
                  verifyCallback={verifiedRecaptcha}
                />
              </div>
            </div>
            <ColorButton variant="contained" type="submit" className="w-full">
              Sign up
            </ColorButton>
          </form>
        </div>
      </div>
    </div>
  );
}

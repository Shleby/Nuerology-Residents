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
        });
        history.push("/");
      } catch (err) {
        console.log(err);
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
    <div className="grid grid-cols-3">
      <div className="col-span-2 h-screen bg-img">
        <div className="flex flex-row items-center mt-6 ml-6 text-4xl font-quicksand">
          <HomeSvg />
          <h1 className="text-white">Track your time in Residency</h1>
        </div>
      </div>
      <div className="bg-white shadow-2xl shadow-inner h-screen grid justify-items-center">
        <div className=" enter-anim rounded-lg shadow-2xl w-3/4 bg-white m-10 h-auto flex-col flex p-6">
          <h1 className="text-3xl">
            <Link to="/">Login</Link> /{" "}
            <text className="text-lightGrey">Signup</text>
          </h1>
          <form className="flex flex-col mt-6 gap-4" onSubmit={submit}>
            <p className="text-lg">Required Fields*</p>
            <FormLabel component="legend">Select Account Type</FormLabel>
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
            <p className="text-lg">Optional Fields</p>
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
            <ColorButton variant="contained" type="submit">
              Sign up
            </ColorButton>
          </form>
        </div>
      </div>
    </div>
  );
}

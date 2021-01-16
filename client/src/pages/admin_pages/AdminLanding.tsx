import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Paper,
  Slide,
  TextField,
  Theme,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ColorButton } from "../../components/ColorButton";
import { toast, ToastContainer } from "react-toastify";
import { TransitionProps } from "@material-ui/core/transitions";
import Cookies from "universal-cookie";
import refreshToken from "../../authentication/jwtFunctions";
import axios from "axios";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
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

export default function AdminLanding() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [formEmail, setFormEmail] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [formPassword, setFormPassword] = useState<string>("");
  const [formPasswordCheck, setFormPasswordCheck] = useState<string>("");
  const [formName, setName] = useState<string>("");
  const [formSecret, setSecret] = useState<string>("");
  const [formOUID, setOUID] = useState<string>("");
  const [formUserType, setUserType] = useState<string>("");
  const [created, setCreated] = useState<string>("");
  const classes = useStyles();
  const cookies = new Cookies();

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
    } else if (formID === "passwordCheck") {
      setFormPasswordCheck(e.target.value);
    } else if (formID === "name") {
      setName(e.target.value);
    } else if (formID === "secret") {
      setSecret(e.target.value);
    }
  }
  const handleAdminOpen = () => {
    setAdminOpen(true);
  };
  const handleAsk = () => {
    setAskOpen(true);
  };
  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleClose = () => {
    setDeleteOpen(false);
    setAdminOpen(false);
    setSearchOpen(false);
    setAskOpen(false);
    resetForm();
  };

  async function handleSearch() {
    try {
      refreshToken(); // checks if token is expired, if so refresh

      const userData = {
        email: formEmail,
      };
      await axios({
        method: "POST",
        data: userData,
        url: "http://localhost:5000/api/getuserdata",
        headers: { "x-access-token": cookies.get("token") },
      }).then((res) => {
        setName(res.data.displayName);
        setEmail(res.data.email);
        setOUID(res.data.ouid);
        setUserType(res.data.userType);
        setCreated(res.data.createdAt);
      });
      toast.dark("Search Successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("Search complete");
    } catch (err) {
      console.log(err);
      resetForm();
      toast.error("Search Was Not Successful", {
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
  async function handleAdminCreation() {
    try {
      refreshToken(); // checks if token is expired, if so refresh

      const userData = {
        email: formEmail,
        password: formPassword,
        passwordCheck: formPasswordCheck,
        displayName: formName,
        adminSecret: formSecret,
        userType: "admin",
      };
      await axios({
        method: "POST",
        data: userData,
        url: "http://localhost:5000/api/register",
        headers: { "content-type": "application/json" },
      });
      toast.dark("Admin Creation Successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setAdminOpen(false);
      console.log("Admin Creation complete");
    } catch (err) {
      console.log(err);
      resetForm();
      toast.error(`Admin Creation Was Not Successful`, {
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
  async function handleDelete() {
    try {
      refreshToken(); // checks if token is expired, if so refresh

      const userData = {
        email: formEmail,
      };
      await axios({
        method: "DELETE",
        data: userData,
        url: "http://localhost:5000/api/delete",
        headers: { "x-access-token": cookies.get("token") },
      });
      toast.dark("Deletion Successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setFormEmail("");
      setDeleteOpen(false);
      setAskOpen(false);
      console.log("Deletion complete");
    } catch (err) {
      console.log(err);
      resetForm();
      setAskOpen(false);
      toast.error("Deletion Was Not Successful", {
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

  function resetForm() {
    setFormEmail("");
    setFormPassword("");
    setFormPasswordCheck("");
    setName("");
    setSecret("");
    setUserType("");
    setOUID("");
    setCreated("");
    setEmail("");
  }

  return (
    <div className="grid grid-cols-3 bg-admin-img bg-cover bg-no-repeat bg-center h-screen">
      <div className="grid col-span-2 py-10 px-28">
        <Paper className="font-quicksand h-auto">
          <h1 className="text-center text-3xl pt-5">Developer Tools</h1>
          <div className="grid grid-cols-2">
            <div>
              <h2 className="pl-10 pt-10 text-2xl">Quick Navigation</h2>
              <div className="flex flex-col px-10 pb-10">
                <ColorButton>
                  <Link to="/resident_dashboard">Go to Resident Dashboard</Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/resident_account">
                    Go to Resident Account Settings
                  </Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/resident_statistics">
                    Go to Resident Statistics
                  </Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/attendee_dashboard">Go to Attendee Dashboard</Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/attendee_account">
                    Go to Attendee Account Settings
                  </Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/attendee_statistics">
                    Go to Attendee Statistics
                  </Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/nurse_dashboard">Go to Nurse Dashboard</Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/nurse_account">Go to Nurse Account Settings</Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/nurse_statistics">Go to Nurse Statistics</Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/register">Go to Registration</Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/support">Go to Support</Link>
                </ColorButton>
                <ColorButton>
                  <Link to="/unauthorized">Go to unauthorized</Link>
                </ColorButton>
              </div>
            </div>
            <div>
              <h2 className="pl-10 pt-10 text-2xl">
                Future Tools to be implemented
              </h2>
            </div>
          </div>
        </Paper>
      </div>
      <div className="pt-10 pr-28">
        <Paper className="font-quicksand">
          <h1 className="text-center text-3xl pt-5">Admin Tools</h1>
          <div className="flex flex-col px-10 pb-10">
            <ColorButton onClick={handleDeleteOpen}>Delete User</ColorButton>
            <Dialog
              open={deleteOpen}
              TransitionComponent={Transition}
              onClose={handleClose}
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"User Deletion Tool"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  This tool allows you to delete any user from our database,
                  just supply their email
                </DialogContentText>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  variant="filled"
                  className="w-full"
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
              </DialogContent>
              <DialogActions>
                <ColorButton onClick={handleClose}>Close</ColorButton>
                <ColorButton onClick={handleAsk}>Delete User</ColorButton>
              </DialogActions>
            </Dialog>
            <Dialog
              open={askOpen}
              TransitionComponent={Transition}
              onClose={handleClose}
            >
              <DialogTitle id="alert-dialog-slide-title">
                {`Are you sure you would like to delete ${formEmail}?`}
              </DialogTitle>
              <DialogActions>
                <ColorButton onClick={handleClose}>No</ColorButton>
                <ColorButton onClick={handleDelete}>Yes</ColorButton>
              </DialogActions>
            </Dialog>
            <ColorButton onClick={handleAdminOpen}>Add Admin</ColorButton>
            <Dialog
              open={adminOpen}
              TransitionComponent={Transition}
              onClose={handleClose}
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"Admin Creation Tool"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  This tool allows you to create new admins
                </DialogContentText>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  variant="filled"
                  className="w-full"
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
                  className="w-full"
                  type="password"
                  value={formPassword}
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
                />{" "}
                <TextField
                  id="passwordCheck"
                  name="passwordCheck"
                  label="Password Check"
                  variant="filled"
                  className="w-full"
                  type="password"
                  value={formPasswordCheck}
                  required
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => onFormChange(e, "passwordCheck")}
                  InputProps={{
                    className: classes.textField,
                  }}
                  InputLabelProps={{
                    className: classes.textField,
                  }}
                />
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  variant="filled"
                  className="w-full"
                  value={formName}
                  required
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
                <TextField
                  id="secret"
                  name="secret"
                  label="Secret"
                  variant="filled"
                  className="w-full"
                  type="password"
                  value={formSecret}
                  required
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => onFormChange(e, "secret")}
                  InputProps={{
                    className: classes.textField,
                  }}
                  InputLabelProps={{
                    className: classes.textField,
                  }}
                />
              </DialogContent>
              <DialogActions>
                <ColorButton onClick={handleClose}>Close</ColorButton>
                <ColorButton onClick={handleAdminCreation}>
                  Create Admin
                </ColorButton>
              </DialogActions>
            </Dialog>
            <ColorButton onClick={handleSearchOpen}>
              Search for User
            </ColorButton>
            <Dialog
              open={searchOpen}
              TransitionComponent={Transition}
              onClose={handleClose}
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"User Search Tool"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  This tool allows you to search for any user in our database,
                  just supply their email
                </DialogContentText>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  variant="filled"
                  className="w-full"
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
                <h1 className="font-quicksand pt-5">Search Results</h1>
                <h1>Name: {formName}</h1>
                <h1>Email: {email}</h1>
                <h1>OUID: {formOUID}</h1>
                <h1>User Role: {formUserType}</h1>
                <h1>Account Created on: {created}</h1>
              </DialogContent>
              <DialogActions>
                <ColorButton onClick={handleClose}>Close</ColorButton>
                <ColorButton onClick={handleSearch}>
                  Search for User
                </ColorButton>
              </DialogActions>
            </Dialog>
          </div>
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
        </Paper>
      </div>
    </div>
  );
}

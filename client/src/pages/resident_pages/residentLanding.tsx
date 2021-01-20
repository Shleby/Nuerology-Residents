import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useToastContext } from "../../context/toastContext";
import Cookies from "universal-cookie";
import refreshToken, { LogoutApi } from "../../authentication/jwtFunctions";
import AppsRoundedIcon from "@material-ui/icons/AppsRounded";
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import SupervisedUserCircleRoundedIcon from "@material-ui/icons/SupervisedUserCircleRounded";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DeleteIcon from "@material-ui/icons/Delete";
export default function ResidentLanding() {
  const cookies = new Cookies();
  const { loginSuccess, toggleLoginSuccess } = useToastContext();

  const [id, setID] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (loginSuccess) {
      toast.success("Login Successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      toggleLoginSuccess(false);
    }
  });

  function loadData() {
    try {
      refreshToken(); // checks if token is expired, if so refresh

      const userData = {
        email: cookies.get("email"),
      };
      axios({
        method: "POST",
        data: userData,
        url: "http://localhost:5000/api/getuserdata",
        headers: { "x-access-token": cookies.get("token") },
      }).then((res) => {
        setEmail(res.data.email);
        setPassword(res.data.password);
        setID(res.data._id);
        setDisplayName(res.data.displayName);
        setUserType(res.data.userType);
        setToken(res.data.token);
      });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
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
      <div className="flex flex-row">
        <div className="h-screen flex flex-col p-10">
          <DeleteIcon />
          <hr className="text-black" />
          <span className="flex flex-col justify-start h-5/6">
            <AppsRoundedIcon className="text-gray-300" />
            <PieChartRoundedIcon className="text-gray-300" />
            <SupervisedUserCircleRoundedIcon className="text-gray-300" />
          </span>
          <ExitToAppIcon className="text-5xl text-gray-300" />
        </div>
        <div className="h-screen flex-grow bg-yellow ">f</div>
        <div className="h-screen ">d</div>
      </div>
      {/* <button onClick={(e) => loadData()}>Click me</button>
      <div>
        <h1>Resident Landing Page</h1>
        <h1>Hello, {displayName}</h1>
        <h1>{id}</h1>
        <h1>{email}</h1>
        <h1>{password}</h1>
        <h1>{displayName}</h1>
        <h1>{userType}</h1>
        <h1>{token}</h1>
      </div> */}
    </div>
  );
}

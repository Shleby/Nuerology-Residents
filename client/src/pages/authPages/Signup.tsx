import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import HomeSvg from "../../components/HomeSvg";
import { useUserContext } from "../../context/userContext";
import "../../App.css";

export default function Signup() {
  // eslint-disable-next-line
  const { userData, setUserData } = useUserContext();
  const history = useHistory();

  // eslint-disable-next-line
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordCheck, setPasswordCheck] = useState<string>();
  const [displayName, setDisplayName] = useState<string>();
  const [error, setError] = useState();

  const submit = async (e: { preventDefault: () => void }) => {
    console.log(
      email + " " + password + " " + passwordCheck + " " + displayName
    );
    var reqData = {
      email: email,
      password: password,
      passwordCheck: passwordCheck,
      displayName: displayName,
    };

    try {
      await axios({
        method: "post",
        url: "http://localhost:5000/users/register",
        data: $.param(reqData),
        headers: { "content-type": "application/json" },
      }).catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("No response", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });

      console.log("Register Successful");

      const loginResponse = await axios({
        method: "post",
        url: "http://localhost:5000/users/login",
        data: {
          email: email,
          password: password,
        },
      }).catch(function (error) {
        console.log(error);
      });

      setUserData({
        token: loginResponse,
        user: loginResponse,
      });
      // localStorage.setItem("auth-token", loginResponse);
      history.push("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2 h-screen">
        <div className="flex flex-row items-center mt-6 ml-6 text-4xl font-quicksand">
          <HomeSvg />
          <h1>Track your time in Residency</h1>
        </div>
      </div>
      <div className="bg-crimson shadow-2xl shadow-inner h-screen grid justify-items-center">
        <div className="rounded-lg shadow-2xl w-3/4 bg-white mt-96 h-80 flex-col flex p-6">
          <h1 className="text-3xl">
            <Link to="/">Login</Link> /{" "}
            <text className="text-lightGrey">Signup</text>
          </h1>
          <form className="flex flex-col mt-6 gap-4" onSubmit={submit}>
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setEmail(e.target.value)}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setPasswordCheck(e.target.value)}
            />
            <input
              type="text"
              id="dsplay-name"
              placeholder="Display Name"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setDisplayName(e.target.value)}
            />
            <button type="submit" value="Register" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

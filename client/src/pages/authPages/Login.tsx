import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../App.css";
import HomeSvg from "../../components/HomeSvg";
import { useUserContext } from "../../context/userContext";

export default function Login() {
  // eslint-disable-next-line
  const { userData, setUserData } = useUserContext();
  const history = useHistory();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState();

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const loginUser = { email, password };
      const loginResponse = await axios.post(
        "http://localhost:5000/users/login",
        loginUser
      );
      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem("auth-token", loginResponse.data.token);
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
          <h1 className="text-lightGrey">Track your time in Residency</h1>
        </div>
      </div>
      <div className="bg-crimson shadow-2xl shadow-inner h-screen grid justify-items-center">
        <div className="rounded-lg shadow-2xl w-3/4 bg-white mt-96 h-80 flex-col flex p-6">
          <h1 className="text-3xl">
            <text className="text-lightGrey">Login</text> /{" "}
            <Link to="/register">Sign up</Link>
          </h1>

          <form className="flex flex-col mt-6 gap-4" onSubmit={submit}>
            <label>Email: </label>
            <input
              type="email"
              id="email"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setEmail(e.target.value)}
            />
            <label>Password: </label>
            <input
              type="password"
              id="password"
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setPassword(e.target.value)}
            />
            <input type="submit" value="Login" className="btn btn-primary" />
          </form>
        </div>
      </div>
    </div>
  );
}

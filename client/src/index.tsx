import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./Signup";

ReactDOM.render(
  <React.StrictMode>
    <CreateRouting />
  </React.StrictMode>,
  document.getElementById("root")
);

function CreateRouting() {
  return (
    <Router>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/">
        <Login />
      </Route>
    </Router>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

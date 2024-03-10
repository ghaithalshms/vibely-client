import React from "react";
import "./login.css";
import Signin from "./signin";
import Signup from "./signup";
import Toggle from "./toggle";
const Login = ({ isDarkMode }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100svh" }}>
      <div className="login-container" id="login-container">
        <Toggle />
        <Signup isDarkMode={isDarkMode} />
        <Signin isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};
export default Login;

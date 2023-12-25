import React from "react";
import "./login.css";
import Signin from "./signin";
import Signup from "./signup";
import Toggle from "./toggle";
const Login = ({ isDarkMode }) => {
  return (
    <div className="login-container" id="login-container">
      <Toggle />
      <Signup isDarkMode={isDarkMode} />
      <Signin isDarkMode={isDarkMode} />
    </div>
  );
};
export default Login;

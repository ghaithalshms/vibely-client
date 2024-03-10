import React, { useEffect } from "react";
const Toggle = () => {
  let container;
  useEffect(() => {
    // eslint-disable-next-line
    container = document.getElementById("login-container");
  });
  return (
    <div className="toggle-container only-pc">
      <div className="toggle">
        <div className="toggle-panel toggle-left">
          <h2>Welcome Back!</h2>
          <p>Enter your informations to sign in!</p>
          <button
            className="transparent-button three-quarters-width"
            id="login"
            onClick={() => {
              container.classList.remove("active");
            }}
          >
            Sign In
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <h2>Welcome, Friend!</h2>
          <p>Sign up to join our site!</p>
          <button
            className="transparent-button three-quarters-width "
            id="register"
            onClick={() => {
              container.classList.add("active");
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
export default Toggle;

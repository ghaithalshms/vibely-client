import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateLink } from "../../API";
import axios from "axios";

// ICONS
import IconLight from "../icon/light-mode/vibely-text-light.png";
import IconDark from "../icon/dark-mode/vibely-text-dark.png";

const ForgotPassword = ({ isDarkMode, handleCatchAxios, setErrorCode }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState(null);

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const usernameOrEmail = document.getElementById("username").value;

    try {
      const res = await axios.post(updateLink.forgotPassword, {
        usernameOrEmail,
      });
      setEmailAddress(res.data.email);
      setEmailSent(true);
    } catch (err) {
      handleCatchAxios(err);
    }
  };

  const renderForgotPasswordForm = () => (
    <>
      <span style={{ margin: "10px 0" }}>
        Enter your email or username and we'll send you a link to get back into
        your account.
      </span>
      <input
        id="username"
        type="email text"
        autoComplete="email username"
        placeholder="Username or Email"
      />
      <button onClick={handleForgotPassword} className="full-width">
        Next
      </button>
      <Link to="/login">Go back to login page</Link>
    </>
  );

  const renderEmailSentMessage = () => (
    <>
      <span style={{ margin: "10px 0" }}>
        {`An email has been sent to ${emailAddress}. If you don't see it, please
        check your spam folder.`}
      </span>
      <button
        onClick={() => {
          setErrorCode(0);
          navigate("/login");
        }}
        className="full-width"
      >
        Go back to login page
      </button>
    </>
  );

  const renderContent = emailSent
    ? renderEmailSentMessage()
    : renderForgotPasswordForm();

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100vh" }}>
      <div className="forgot-password-container" id="forgot-password-container">
        <img
          className="login-icon"
          src={isDarkMode ? IconDark : IconLight}
          alt=""
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
        {renderContent}
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { updateLink } from "../../API";
import axios from "axios";
import md5 from "md5";

// ICONS
import IconLight from "../icon/light-mode/vibely-text-light.png";
import IconDark from "../icon/dark-mode/vibely-text-dark.png";

const ResetPassword = ({ isDarkMode, handleCatchAxios, setErrorCode }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isTokenWrong, setIsTokenWrong] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { username, token } = getQueryParams(location.search);
    setUsername(username);
    setToken(token);
  }, [location.search]);

  const getQueryParams = (search) => {
    const params = new URLSearchParams(search);
    return {
      username: params.get("username"),
      token: params.get("token"),
    };
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(updateLink.resetPassword, {
        token,
        password: md5(password),
      });
      setIsReset(true);
      if (res.data === "wrong token") setIsTokenWrong(true);
    } catch (err) {
      handleCatchAxios(err);
    }
  };

  const handleCheckPassword = () => {
    if (password && password === repeatPassword) {
      setPasswordError(false);
      return true;
    }
    setPasswordError(true);
    return false;
  };

  const renderResetForm = () => (
    <>
      <span
        style={{ fontSize: "1.2rem", margin: "7px 0" }}
      >{`Hello, ${username}`}</span>
      <input
        id="password-signup"
        type="password"
        autoComplete="off"
        placeholder="Choose your password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <input
        id="repeat-password-signup"
        type="password"
        autoComplete="password"
        placeholder="Repeat your password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.currentTarget.value)}
      />
      {passwordError && (
        <span className="error-span">Please check your password</span>
      )}
      <button className="full-width" onClick={handleReset}>
        Reset my password
      </button>
      <Link to="/login" style={{ marginLeft: "auto", marginRight: "auto" }}>
        Go back to login page
      </Link>
    </>
  );

  const renderResetConfirmation = () => (
    <>
      <span
        onClick={handleRedirect}
        className="pointer"
        style={{ fontSize: "1.1rem", margin: "7px 0" }}
      >
        {isTokenWrong
          ? `Sorry, this link has expired. Click here to send a new link.`
          : `Your password reset successfully, click here to login.`}
      </span>
    </>
  );

  const handleReset = () => {
    if (handleCheckPassword()) {
      handleResetPassword();
    }
  };

  const handleRedirect = () => {
    setErrorCode(0);
    navigate(isTokenWrong ? "/forgot-password" : "/login");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100vh" }}>
      <div
        className="forgot-password-container"
        id="forgot-password-container"
        style={{ display: "flex", alignItems: "flex-start" }}
      >
        <img
          style={{ marginLeft: "auto", marginRight: "auto" }}
          className="login-icon"
          src={isDarkMode ? IconDark : IconLight}
          alt=""
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
        {!isReset ? renderResetForm() : renderResetConfirmation()}
      </div>
    </div>
  );
};

export default ResetPassword;

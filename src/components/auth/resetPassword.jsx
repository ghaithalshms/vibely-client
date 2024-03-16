import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { updateLink } from "../../API";
import axios from "axios";

// ICONS
import IconLight from "../icon/light-mode/vibely-text-light.png";
import IconDark from "../icon/dark-mode/vibely-text-dark.png";
import md5 from "md5";

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
    const getQueryParam = (name) => {
      const params = new URLSearchParams(location.search);
      return params.get(name);
    };

    setUsername(getQueryParam("username"));
    setToken(getQueryParam("token"));
  }, [location.search]);

  const handleResetPassword = async () => {
    await axios
      .post(updateLink.resetPassword, {
        token,
        password: md5(password),
      })
      .then((res) => {
        setIsReset(true);
        if (res.data === "wrong token") setIsTokenWrong(true);
      })
      .catch((err) => handleCatchAxios(err));
  };

  const handleCheckPassword = () => {
    if (password?.length > 0 && password === repeatPassword) {
      setPasswordError(false);
      return true;
    } else return false;
  };

  const returnElement = !isReset ? (
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
      <button
        className="full-width"
        onClick={() => {
          if (handleCheckPassword()) handleResetPassword();
          else setPasswordError(true);
        }}
      >
        Reset my password
      </button>
      <Link to="/login" style={{ marginLeft: "auto", marginRight: "auto" }}>
        Go back to login page
      </Link>
    </>
  ) : (
    <>
      <span
        onClick={() => {
          setErrorCode(0);
          navigate(isTokenWrong ? "/forgot-password" : "/login");
        }}
        className="pointer"
        style={{ fontSize: "1.1rem", margin: "7px 0" }}
      >
        {isTokenWrong
          ? `Sorry, this link has expired. Click here to send a new link.`
          : `Your password reset successfully, click here to login.`}
      </span>
    </>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100svh" }}>
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
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
        {returnElement}
      </div>
    </div>
  );
};
export default ResetPassword;

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { postLink } from "../../API";
import axios from "axios";
import md5 from "md5";
import Cookies from "js-cookie";
import DialogModal from "../dialogModal/dialogModal";

// ICONS
import IconLight from "../icon/light-mode/vibely-text-light.png";
import IconDark from "../icon/dark-mode/vibely-text-dark.png";

const Signin = ({ isDarkMode }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalBody, setModalBody] = useState("");

  const handleSignIn = async () => {
    const user = {
      usernameOrEmail: document.getElementById("username").value,
      password: md5(document.getElementById("password-signin").value),
    };
    await axios
      .post(postLink.signIn, user)
      .then((response) => {
        Cookies.set("token", response.data.token, { expires: 1000 });
        Cookies.set("username", response.data.username, { expires: 1000 });
        window.location.href = "/";
      })
      .catch((error) => {
        setDialogOpen(true);
        setModalHeader("Ooups");
        if (error?.code === "ERR_NETWORK") {
          setModalBody(
            `Sorry, a problem happened while connecting to the server`
          );
          return;
        }
        switch (error?.response?.status) {
          case 401:
            setModalBody(`Your password is incorrect, try again.`);
            break;
          case 404:
            setModalBody(`This username does not exist.`);
            break;
          default:
            setModalBody(
              `Sorry, an error happened: ${error?.response?.status}`
            );
        }
      });
  };
  const vibelyIcon = useRef(null);
  let container;
  useEffect(() => {
    // eslint-disable-next-line
    container = document.getElementById("login-container");
  });
  useEffect(() => {
    if (vibelyIcon.current)
      vibelyIcon.current.src = isDarkMode ? IconDark : IconLight;
  }, [isDarkMode]);

  return (
    <div className="form-container sign-in">
      <img
        className="login-icon"
        src={isDarkMode ? IconDark : IconLight}
        ref={vibelyIcon}
        alt=""
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
      <h2 className="only-mobile">Welcome Back!</h2>
      <input
        id="username"
        type="email text"
        autoComplete="email username"
        placeholder="Username or Email"
      />
      <input
        id="password-signin"
        type="password"
        autoComplete="password"
        placeholder="Password"
      />
      <button onClick={() => handleSignIn()} className="full-width">
        Sign In
      </button>
      <Link className="a-span" to="/forgot-password">
        Forgot Your Password?
      </Link>
      <span
        className="only-mobile a-span"
        onClick={() => container.classList.add("active")}
      >
        Don't have an account? Sign up!
      </span>
      {isDialogOpen && (
        <DialogModal
          isDarkMode={isDarkMode}
          header={modalHeader}
          body={modalBody}
          isOpen={isDialogOpen}
          onNo={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};
export default Signin;

import React, { useEffect, useRef, useState } from "react";
import { postLink } from "../../API";
import axios from "axios";
import md5 from "md5";
import Cookies from "js-cookie";
import DialogModal from "../dialogModal/dialogModal";
import { termsOfUse } from "./termsOfUse";

import IconLight from "../icon/light-mode/vibely-text-light.png";
import IconDark from "../icon/dark-mode/vibely-text-dark.png";

const Signup = ({ isDarkMode }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState("Terms of Use");
  const [modalBody, setModalBody] = useState(termsOfUse);

  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorText, setUsernameErrorText] = useState();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleCheckPassword = () => {
    if (password?.length > 0 && password === repeatPassword) {
      setPasswordError(false);
      return true;
    } else return false;
  };

  const handleCheckUsername = (username) => {
    if (username?.length > 0) {
      axios
        .post(postLink.checkUsername, {
          username,
        })
        .then((res) => {
          if (res.data === "This username is available.") {
            setUsernameError(false);
            return true;
          } else {
            setUsernameError(true);
            setUsernameErrorText(res.data);
            return false;
          }
        })
        .catch((error) => {
          setDialogOpen(true);
          setModalHeader("Ooups");
          if (error.code === "ERR_NETWORK") {
            setModalBody(
              `Sorry, a problem happened while connecting to the server`
            );
            return;
          }
          setModalBody(`Sorry, an error happened: ${error?.response?.status}`);
        });
      setPasswordError(false);
      return true;
    } else return false;
  };

  const handleSignUp = async () => {
    const user = { username, firstName: name, password: md5(password), email };
    await axios
      .post(postLink.signUp, user)
      .then((response) => {
        setModalHeader("Hello, Friend!");
        setModalBody(response.data.message);
        setDialogOpen(true);
        Cookies.set("token", response.data.token, { expires: 1000 });
        Cookies.set("username", response.data.username, { expires: 1000 });
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      })
      .catch((error) => {
        setDialogOpen(true);
        setModalHeader("Ooups");
        if (error.code === "ERR_NETWORK") {
          setModalBody(
            `Sorry, a problem happened while connecting to the server`
          );
          return;
        }
        setModalBody(`Sorry, an error happened: ${error?.response?.status}`);
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

  const stepReturn = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              id="first-name"
              type="text"
              autoComplete="first-name"
              placeholder="What's your name?"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Your e-mail"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />

            <button
              className="full-width"
              onClick={() => {
                if (name && email) setStep(step + 1);
              }}
            >
              Next
            </button>
          </>
        );
      case 2:
        return (
          <>
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
            <div className="container full-width">
              <button className="half-width" onClick={() => setStep(step - 1)}>
                Previous
              </button>
              <button
                className="half-width"
                onClick={() => {
                  if (handleCheckPassword()) setStep(step + 1);
                  else setPasswordError(true);
                }}
              >
                Next
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <input
              id="username"
              type="text"
              autoComplete="username user"
              placeholder="Choose your username!"
              value={username}
              onChange={(e) => {
                setUsername(e.currentTarget.value);
                handleCheckUsername(e.currentTarget.value);
              }}
            />
            {usernameError && (
              <span className="error-span">{usernameErrorText}</span>
            )}
            <div style={{ width: "100%" }} className="container">
              <button className="half-width " onClick={() => setStep(step - 1)}>
                Previous
              </button>
              <button
                className="half-width "
                onClick={async () => {
                  const condition = await handleCheckUsername(username);
                  if (condition) setStep(step + 1);
                }}
              >
                Next
              </button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <p className="pointer" onClick={() => setDialogOpen(true)}>
              By signing up, you agree to our{" "}
              <span className="underline">Terms of Service</span>,{" "}
              <span className="underline"> Privacy Policy</span> and{" "}
              <span className="underline"> Use of Cookies</span>.
            </p>
            <div style={{ width: "100%" }} className="container">
              <button className="half-width " onClick={() => setStep(step - 1)}>
                Previous
              </button>
              <button
                className="half-width "
                onClick={async () => {
                  const condition = await handleCheckUsername(username);
                  if (condition) handleSignUp();
                }}
              >
                Sign Up!
              </button>
            </div>
          </>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="form-container sign-up">
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
      <h2 className="only-mobile">Hello, Friend!</h2>
      {stepReturn()}
      <span
        className="only-mobile a-span"
        onClick={() => container.classList.remove("active")}
      >
        Already have an account? Sign in!
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
export default Signup;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./style.css";
import Login from "./components/login/login";
import Profile from "./components/profile/profile";
import axios from "axios";
import { getLink } from "./API";
import IsLoadingComponent from "./components/isLoadingComponent/isLoadingComponent";
// import ForgotPassword from "./components/forgotPassword";
import DialogModal from "./components/dialogModal/dialogModal";

const App = () => {
  // FOR ERROR MODAL
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogModalHeader, setDialogModalHeader] = useState("");
  const [dialogModalBody, setDialogModalBody] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  let token = Cookies.get("token");

  const handleTheme = () => {
    // check dark mode and enable it
    if (Cookies.get("dark-mode") === "true")
      document.body.classList.add("dark-mode");
    // body class listener for dark mode
    const handleSetDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };
    // Update theme-color meta tag based on dark mode
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = document.body.classList.contains("dark-mode")
        ? "#68053a" // Dark mode color
        : "#f874bb"; // Light mode color
    }
    document.body.addEventListener("transitionend", handleSetDarkMode);
    return () => {
      document.body.removeEventListener("transitionend", handleSetDarkMode);
    };
  };

  const handleActivateServer = async () => {
    await axios
      .get(getLink.activateServer)
      .then()
      .catch((err) => {
        setDialogOpen(true);
        setDialogModalHeader("Ooups");
        if (err?.code === "ERR_NETWORK")
          setDialogModalBody(
            `Sorry, a problem happened while connecting to the server`
          );
        else
          setDialogModalBody(
            `Sorry, an error happened: ${err?.response?.status}`
          );
      });
    setIsLoading(false);
  };

  useEffect(() => {
    handleTheme();
    handleActivateServer();
  }, []);

  // LOADING SCREEN
  if (isLoading) return <IsLoadingComponent />;

  // IF SERVER ERROR, ERROR MODAL
  if (isDialogOpen)
    return (
      <DialogModal
        isDarkMode={isDarkMode}
        isOpen={isDialogOpen}
        header={dialogModalHeader}
        body={dialogModalBody}
        onNo={() => window.location.reload()}
      />
    );

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !token ? <Login isDarkMode={isDarkMode} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/*"
          element={
            token ? (
              <Profile isDarkMode={isDarkMode} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

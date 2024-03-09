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
import { handleAddScrollListener } from "./components/func/scrollPercentage";
import Home from "./components/home/home";
import Explorer from "./components/explorer/explorer";
import Search from "./components/search/search";
// import defaultPfp from "./components/icon/default profile picture.jpg";
import Activities from "./components/activities/activities";
import EditProfile from "./components/edit profile/editProfile";
import Inbox from "./components/inbox/inbox";
//socket io
import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_API_URL);
const App = () => {
  // FOR ERROR MODAL
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogModalHeader, setDialogModalHeader] = useState("");
  const [dialogModalBody, setDialogModalBody] = useState("");

  const [scrollingPercentage, setScrollingPercentage] = useState(0);
  // const [profilePicture, setProfilePicture] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [clientSocket, setClientSocket] = useState(null);

  let token = Cookies.get("token");
  let username = Cookies.get("username");

  const handleTheme = () => {
    // check dark mode and enable it

    // if (Cookies.get("dark-mode") === "true")
    //   document.body.classList.add("dark-mode");
    // body class listener for dark mode
    const handleSetDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      document.body.classList.add("dark-mode");
    // Update theme-color meta tag based on dark mode
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = document.body.classList.contains("dark-mode")
        ? "#68053a" // Dark mode color
        : "#f874bb"; // Light mode color
    }
    // Update color-scheme for scrollbar etc
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.content = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";
    }
    document.body.addEventListener("transitionend", handleSetDarkMode);
    return () => {
      document.body.removeEventListener("transitionend", handleSetDarkMode);
    };
  };

  const handleCatchAxios = (err) => {
    if (err?.code === "ERR_NETWORK") {
      setDialogOpen(true);
      setDialogModalHeader("Ooups");
      setDialogModalBody(
        `Sorry, a problem happened while connecting to the server`
      );
    } else if (err?.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("username");
      window.location.href = "/login";
    } else if (err?.response?.status === 404) {
      setDialogOpen(true);
      setDialogModalHeader("Ooups");
      setDialogModalBody(`Sorry, this page does not exist`);
    }
    console.error(err);

    // setDialogModalBody(`Sorry, an error happened: ${err?.response?.status}`);
  };

  const handleIsServerWorking = async () => {
    await axios
      .get(getLink.activateServer)
      .then()
      .catch((err) => {
        handleCatchAxios(err);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    handleAddScrollListener(setScrollingPercentage);
    handleTheme();
    handleIsServerWorking();
    // eslint-disable-next-line
  }, []);

  const handleSetClientSocket = () => {
    if (!socket.connected && Cookies.get("username")) {
      socket.emit("set_username", Cookies.get("username"));
      setClientSocket(socket);
    }
  };

  useEffect(() => {
    handleSetClientSocket();
    // eslint-disable-next-line
  }, [socket]);

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
        onNo={() => (window.location.href = "/")}
      />
    );

  return (
    <Router>
      <Routes>
        {/*  WITH TOKEN */}
        {/* HOME ROUTE */}
        <Route
          path="/"
          element={
            token && username ? (
              <Home
                isDarkMode={isDarkMode}
                scrollingPercentage={scrollingPercentage}
                handleCatchAxios={handleCatchAxios}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* SEARCH ROUTE */}
        <Route
          path="/search"
          element={
            token && username ? (
              <Search
                isDarkMode={isDarkMode}
                handleCatchAxios={handleCatchAxios}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* INBOX ROUTE */}
        <Route
          path="/inbox/*"
          element={
            token && username ? (
              <Inbox
                isDarkMode={isDarkMode}
                scrollingPercentage={scrollingPercentage}
                handleCatchAxios={handleCatchAxios}
                clientSocket={clientSocket}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* EXPLORER ROUTE */}
        <Route
          path="/explorer"
          element={
            token && username ? (
              <Explorer
                isDarkMode={isDarkMode}
                scrollingPercentage={scrollingPercentage}
                handleCatchAxios={handleCatchAxios}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* ACTIVITIES ROUTE */}
        <Route
          path="/activities/*"
          element={
            token && username ? (
              <Activities
                isDarkMode={isDarkMode}
                scrollingPercentage={scrollingPercentage}
                handleCatchAxios={handleCatchAxios}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ACCOUNT ROUTE */}
        <Route
          path="/account/edit-profile"
          element={
            token && username ? (
              <EditProfile
                isDarkMode={isDarkMode}
                handleCatchAxios={handleCatchAxios}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* PROFILE ROUTE */}
        <Route
          path="/*"
          element={
            token && username ? (
              <Profile
                isDarkMode={isDarkMode}
                scrollingPercentage={scrollingPercentage}
                handleCatchAxios={handleCatchAxios}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/*  WITHOUT TOKEN */}
        <Route
          path="/login"
          element={
            !(token && username) ? (
              <Login isDarkMode={isDarkMode} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

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
// import ForgotPassword from "./components/forgotPassword";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  let token = Cookies.get("token");
  useEffect(() => {
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
  }, []);

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

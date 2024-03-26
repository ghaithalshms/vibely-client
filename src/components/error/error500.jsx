import React from "react";
import Navbar from "../navbar/navbar";
import error500iconLight from "../icon/light-mode/error/error500.png";
import error500iconDark from "../icon/dark-mode/error/error500.png";
import { useNavigate } from "react-router-dom";

const Error500 = ({ isDarkMode, handleCatchAxios, setErrorCode }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    setErrorCode(0);
    navigate("/");
  };

  const renderNavbar = () => (
    <Navbar
      isDarkMode={isDarkMode}
      handleCatchAxios={handleCatchAxios}
      setErrorCode={setErrorCode}
      error500={true}
    />
  );

  const renderContent = () => (
    <div className="container-y" style={{ alignItems: "center" }}>
      <h1 style={{ fontSize: "4rem" }}>500</h1>
      <h3>Sorry, the connection to the server has failed.</h3>
      <img
        style={{ maxWidth: "80svw", width: "500px" }}
        src={isDarkMode ? error500iconDark : error500iconLight}
        alt="error500"
      />
    </div>
  );

  return (
    <div
      className="main-container pointer"
      style={{
        height: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleClick}
    >
      {renderNavbar()}
      {renderContent()}
    </div>
  );
};

export default Error500;

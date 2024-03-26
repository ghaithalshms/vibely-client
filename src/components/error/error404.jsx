import React from "react";
import Navbar from "../navbar/navbar";
import error404icon from "../icon/light-mode/error/error404.png";
import { useNavigate } from "react-router-dom";

const Error404 = ({ isDarkMode, handleCatchAxios, setErrorCode }) => {
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
    />
  );

  const renderContent = () => (
    <div className="container-y" style={{ alignItems: "center" }}>
      <h1 style={{ fontSize: "4rem" }}>404</h1>
      <h3>They don't know this page doesn't exist</h3>
      <img
        style={{ maxWidth: "80svw", width: "500px" }}
        src={error404icon}
        alt="error404"
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

export default Error404;

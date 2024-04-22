import React, { useState } from "react";
import defaultPfp from "../icon/default profile picture.jpg";
import { useNavigate } from "react-router-dom";

const LoginToSeeFeatures = ({ isDarkMode, userData }) => {
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const renderPfpElement = () => {
    return (
      <img
        className="profile-picture"
        style={{
          minWidth: "70px",
          minHeight: "70px",
          maxWidth: "70px",
          maxHeight: "70px",
          top: "-20px",
          zIndex: "2",
        }}
        src={
          pfpLoaded
            ? `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${userData.username}`
            : defaultPfp
        }
        onLoad={() => setPfpLoaded(true)}
        onError={() => setPfpLoaded(true)}
        alt="Pfp"
        onContextMenu={(event) => event.preventDefault()}
      />
    );
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        bottom: "0",
        left: "0",
        height: "25svh",
        width: "100svw",
      }}
      onClick={() => navigate("/")}
    >
      {renderPfpElement()}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, .75)",
          color: "white",
          backdropFilter: "blur(10px)",
          position: "fixed",
          height: "20svh",
          width: "100svw",
          bottom: "0",
          zIndex: "1",
          padding: "40px 15px 0",
        }}
      >
        <h3>Login into Vibely!</h3>
        <h4 style={{ marginTop: "5px" }}>
          Log in to see photos and videos from friends and other people
        </h4>
      </div>
    </div>
  );
};

export default LoginToSeeFeatures;

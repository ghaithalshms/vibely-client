import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLink } from "../../API";
import Cookies from "js-cookie";
import axios from "axios";
import defaultPfp from "../icon/default profile picture.jpg";

const NotificationComponent = ({
  user,
  notification,
  visitUser,
  handleCatchAxios,
  refreshNotification,
  setLoading,
  setErrorCode,
}) => {
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const navigate = useNavigate();

  const notificationMessage = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "comment like":
        return "liked your comment";
      case "follow":
        return "started following you";
      case "request":
        return "wants to follow you";
      default:
        return "";
    }
  };

  const handleProfileClick = () => {
    setErrorCode(0);
    navigate(`/${user.username}`);
    if (visitUser) visitUser(user.username);
  };

  const handleAcceptFollowRequest = async () => {
    setLoading(true);
    axios
      .post(postLink.acceptFollowRequest, {
        username: user.username,
        token: Cookies.get("token"),
      })
      .then(() => refreshNotification())
      .catch((err) => handleCatchAxios(err));

    setLoading(false);
  };

  return (
    <div className="container-x" style={{ marginBottom: "5px" }}>
      <img
        className="profile-picture pointer"
        style={{
          width: "43px",
          height: "43px",
          marginRight: "0.8rem",
          marginBottom: "0.5rem",
        }}
        src={
          pfpLoaded
            ? `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${user.username}`
            : defaultPfp
        }
        onLoad={() => setPfpLoaded(true)}
        onError={() => setPfpLoaded(true)}
        alt="Pfp"
        onClick={handleProfileClick}
      />
      <div
        className="container-x"
        style={{ alignItems: "center", width: "100%" }}
      >
        <pre>
          <span
            className="pointer"
            onClick={handleProfileClick}
            style={{ fontSize: "16px", marginRight: "5px", fontWeight: "600" }}
          >
            {user.firstName}
          </span>
          {notificationMessage()}
        </pre>
        {notification.type === "request" && (
          <button onClick={handleAcceptFollowRequest}>Accept</button>
        )}
      </div>
    </div>
  );
};

export default NotificationComponent;

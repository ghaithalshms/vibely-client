import React from "react";
import defaultPfp from "../icon/default profile picture.jpg";
// import adminIcon from "../icon/admin.png";
// import verifiedIcon from "../icon/verified.png";
import { useNavigate } from "react-router-dom";
import { postLink } from "../../API";
import Cookies from "js-cookie";
import axios from "axios";

const NotificationComponent = ({
  user,
  notification,
  visitUser,
  handleCatchAxios,
  refreshNoitfication,
  setLoading,
}) => {
  const handlePfp = () => {
    if (user?.picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(user.picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
    else return defaultPfp;
  };

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
        return;
    }
  };

  const handleAcceptFollowRequest = async () => {
    setLoading(true);
    axios
      .post(postLink.acceptFollowRequest, {
        username: user.username,
        token: Cookies.get("token"),
      })
      .then(() => refreshNoitfication())
      .catch((err) => handleCatchAxios(err));
  };

  return (
    <div className="container-x " style={{ marginBottom: "5px" }}>
      <img
        className="profile-picture pointer"
        style={{
          width: "43px",
          height: "43px",
          marginRight: "0.8rem",
          marginBottom: "0.5rem",
        }}
        src={handlePfp()}
        alt="pfp"
        onClick={() => {
          navigate(`/${user.username}`);
          if (visitUser) visitUser(user.username);
        }}
      />
      <div
        className="container-x"
        style={{ alignItems: "center", width: "100%" }}
      >
        <pre>
          <span
            className="pointer"
            onClick={() => {
              navigate(`/${user.username}`);
              if (visitUser) visitUser(user.username);
            }}
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

import React, { useState } from "react";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";
import Cookies from "js-cookie";
import defaultPfp from "../icon/default profile picture.jpg";

const InboxUserComponent = ({ user, message, setChatUser }) => {
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const nameAndIcon = (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 style={{ marginRight: "5px" }}>{`${user.firstName} `}</h3>
        {user.isVerified && (
          <img
            style={{ height: "20px", width: "20px", marginRight: "3px" }}
            src={verifiedIcon}
            alt="verified"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          />
        )}
        {user.isAdmin && (
          <img
            style={{ height: "15px", width: "15px" }}
            src={adminIcon}
            alt="admin"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          />
        )}
      </div>
      {/* <span>{`@${user.username}`}</span> */}
      <span
        style={{
          fontWeight:
            message.to === Cookies.get("username") && !message.seen
              ? "bold"
              : "normal",
        }}
      >{`${
        message.message
          ? message.message
          : message.fileType === "picture"
          ? "Picture"
          : message.fileType === "video"
          ? "Video"
          : "Audio"
      }`}</span>
    </div>
  );
  return (
    <div
      className="container-x pointer"
      onClick={() => setChatUser(user)}
      style={{ marginBottom: "5px" }}
    >
      <img
        className="profile-picture"
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
        onError={() => setPfpLoaded(false)}
        alt="Pfp"
      />
      <div>{nameAndIcon}</div>
    </div>
  );
};

export default InboxUserComponent;

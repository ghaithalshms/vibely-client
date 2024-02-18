import React from "react";
import defaultPfp from "../icon/default profile picture.jpg";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";
import { useNavigate } from "react-router-dom";
import backLight from "../icon/light-mode/chat/back.png";
import backDark from "../icon/dark-mode/chat/back.png";
import { timeDifference } from "../func/timeDifference";
import spotifyIcon from "../icon/spotify.png";

const ChatHeader = ({ isDarkMode, chatUser, setChatUser }) => {
  const handlePfp = () => {
    if (chatUser?.picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(chatUser?.picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
    else return defaultPfp;
  };
  const navigate = useNavigate();

  const backIconElement = (
    <img
      style={{
        width: "20px",
        height: "20px",
        marginRight: "1rem",
      }}
      src={isDarkMode ? backDark : backLight}
      onClick={() => {
        navigate(`/inbox`);
        setChatUser(null);
      }}
      alt="back"
      className="pointer"
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    />
  );

  const nameAndIcon = (
    <>
      <div
        className="container-x pointer"
        style={{ alignItems: "center" }}
        onClick={() => navigate(`/${chatUser?.username}`)}
      >
        <h3 style={{ marginRight: "5px" }}>{`${chatUser?.firstName} `}</h3>
        {chatUser?.isVerified && (
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
        {chatUser?.isAdmin && (
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
        {/* SPOTIFY ICON */}
        <img
          style={{
            display: "none",
            width: "35px",
            height: "35px",
            position: "absolute",
            right: "20px",
            top: "20px",
          }}
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          src={spotifyIcon}
          alt="spotify"
        />
      </div>
    </>
  );
  return (
    <div className="chat-header-container">
      <div className="only-mobile">{backIconElement}</div>
      {chatUser && (
        <>
          <img
            className="profile-picture pointer"
            style={{
              width: "43px",
              height: "43px",
              marginRight: "0.8rem",
              marginBottom: "0.5rem",
            }}
            onClick={() => navigate(`/${chatUser?.username}`)}
            src={handlePfp()}
            alt=""
          />
          <div className="chat-header-user-container">
            <div>{nameAndIcon}</div>
            <span className="last-seen-span">
              {chatUser.lastSeen === "online"
                ? "Online"
                : `Last seen ${timeDifference(chatUser.lastSeen)}`}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;

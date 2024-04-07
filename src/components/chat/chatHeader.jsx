import React, { useState } from "react";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";
import { useNavigate } from "react-router-dom";
import backLight from "../icon/light-mode/chat/back.png";
import backDark from "../icon/dark-mode/chat/back.png";
import { timeDifference } from "../func/timeDifference";
import spotifyIcon from "../icon/spotify.png";
import defaultPfp from "../icon/default profile picture.jpg";
import handleCache from "../../cache/cacheMedia";

const ChatHeader = ({ isDarkMode, chatUser, setChatUser, setErrorCode }) => {
  const navigate = useNavigate();

  const [pfp, setPfp] = useState(null);
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const handleBackButtonClick = () => {
    setErrorCode(0);
    navigate(`/inbox`);
    setChatUser(null);
  };

  const handleProfileClick = () => {
    setErrorCode(0);
    navigate(`/${chatUser?.username}`);
  };

  const renderBackIcon = () => (
    <img
      style={{
        width: "20px",
        height: "20px",
        marginRight: "1rem",
      }}
      src={isDarkMode ? backDark : backLight}
      onClick={handleBackButtonClick}
      alt="back"
      className="pointer"
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    />
  );

  const renderNameAndIcon = () => (
    <div
      className="container-x pointer"
      style={{ alignItems: "center" }}
      onClick={handleProfileClick}
    >
      <h3 style={{ marginRight: "5px" }}>{`${chatUser?.firstName} `}</h3>
      {chatUser?.isVerified && (
        <img
          style={{ height: "20px", width: "20px", marginRight: "3px" }}
          src={verifiedIcon}
          alt="verified"
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
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
      )}
      <img
        style={{
          display: "none",
          width: "35px",
          height: "35px",
          position: "absolute",
          right: "20px",
          top: "20px",
        }}
        src={spotifyIcon}
        alt="spotify"
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
    </div>
  );

  return (
    <div className="chat-header-container">
      <div className="only-mobile">{renderBackIcon()}</div>
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
            onClick={handleProfileClick}
            src={pfpLoaded ? pfp : defaultPfp}
            onLoad={() =>
              handleCache(
                "pfp",
                `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${chatUser.username}`,
                chatUser.username,
                setPfp,
                setPfpLoaded
              )
            }
            onError={() => setPfpLoaded(false)}
            alt="Pfp"
          />
          <div className="chat-header-user-container">
            <div>{renderNameAndIcon()}</div>
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

import React, { useRef, useEffect, useState } from "react";
import "../../style.css";
import Cookies from "js-cookie";
import axios from "axios";
import verifiedIcon from "../../icon/verified.png";
import adminIcon from "../../icon/admin.png";
import { postLink } from "../../API";
import YesNoDialog from "../yesNoDialog/yesNoDialog";

import defaultPfp from "../../icon/default profile picture.jpg";
// LIGHT THEME ICON
import linkIconLight from "../../icon/light-mode/profile/link.png";
import optionsIconLight from "../../icon/light-mode/navbar/options.png";
// DARK THEME ICON
import linkIconDark from "../../icon/dark-mode/profile/link.png";
import optionsIconDark from "../../icon/dark-mode/navbar/options.png";

import GetUserListModal from "../user/getUserListModal";

const DataContainer = ({ isDarkMode, userData, setUserData, visitUser }) => {
  const tokenUsername = Cookies.get("username");
  const token = Cookies.get("token");
  const linkIconRef = useRef();
  const optionsIconRef = useRef();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogModalHeader, setDialogModalHeader] = useState();
  const [dialogModalBody, setDialogModalBody] = useState();

  const [locationOptionsIcon, setLocationOptionsIcon] = useState(0);
  // eslint-disable-next-line
  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);

  const [isUserListModalOpen, setUserListModalOpen] = useState(false);
  const [userListModalType, setUserListModalType] = useState();

  useEffect(() => {
    // LINK ICON
    if (linkIconRef.current)
      linkIconRef.current.src = isDarkMode ? linkIconDark : linkIconLight;
    // OPTIONS ICON
    if (optionsIconRef.current)
      optionsIconRef.current.src = isDarkMode
        ? optionsIconDark
        : optionsIconLight;
  }, [isDarkMode]);

  // GET LOCATION FOR options icon
  useEffect(() => {
    const container = document.querySelector(".container-x");
    const updateContainerRight = () => {
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setLocationOptionsIcon(window.innerWidth - containerRect.right + "px");
      }
    };
    updateContainerRight(); // Initial update
    window.addEventListener("resize", updateContainerRight);
    return () => {
      window.removeEventListener("resize", updateContainerRight);
    };
  }, []);

  const handlePfp = () => {
    if (userData?.picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(userData.picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
    else return defaultPfp;
  };

  const handleFollow = async () => {
    await axios
      .post(postLink.follow, {
        username: userData.username,
        token,
      })
      .then((res) => {
        switch (res.data) {
          case "followed":
            setUserData((prevState) => ({ ...prevState, isFollowing: true }));
            break;
          case "follow requested":
            setUserData((prevState) => ({
              ...prevState,
              isFollowRequested: true,
            }));
            break;
          case "unfollowed":
            setUserData((prevState) => ({ ...prevState, isFollowing: false }));
            break;
          case "follow request deleted":
            setUserData((prevState) => ({
              ...prevState,
              isFollowRequested: false,
            }));
            break;
          default:
            setUserData((prevState) => ({ ...prevState }));
        }
      })
      .catch((error) => {
        setDialogOpen(true);
        setDialogModalHeader("Ooups");
        setDialogModalBody(
          `Sorry, an error happened: ${error?.response?.status}`
        );
      });
  };

  const nameAndIcon = (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3
          style={{ marginRight: "5px" }}
        >{`${userData.firstName} ${userData.lastName}`}</h3>
        {userData.isVerified && (
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
        {userData.isAdmin && (
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
      <span>{`@${userData.username}`}</span>
    </div>
  );

  return (
    <div
      className="data-container container-y"
      style={{ position: "relative" }}
    >
      {/* OPTIONS ICON  */}
      <img
        style={{
          width: "28px",
          height: "28px",
          marginRight: "8px",
          position: "fixed",
          marginTop: "30px",
          right: locationOptionsIcon,
        }}
        src={isDarkMode ? optionsIconDark : optionsIconLight}
        alt="options"
        className="pointer"
        onClick={() => setOptionsModalOpen(true)}
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
      <div
        className="container-x"
        style={{ padding: "1rem", paddingTop: "2rem" }}
      >
        <img
          className="profile-picture"
          src={handlePfp()}
          alt="Pfp"
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
        <div
          className="container-y"
          style={{
            justifyContent: "center",
            marginLeft: "10%",
          }}
        >
          {/* FOR PC NAME AND ICONS */}
          <div className="only-pc">{nameAndIcon}</div>

          {/* FOR PC follower and following */}
          <div className="only-pc" style={{ marginTop: "15px" }}>
            <div className="container-x">
              <div
                className="pointer"
                onClick={() => {
                  if (
                    userData.username === Cookies.get("username") ||
                    !userData.privacity ||
                    userData.isFollowing
                  ) {
                    setUserListModalOpen(true);
                    setUserListModalType("Followers");
                  }
                }}
                style={{ marginRight: "10px" }}
              >{`${userData.followerCount} follower`}</div>
              <div
                className="pointer"
                onClick={() => {
                  if (
                    userData.username === Cookies.get("username") ||
                    !userData.privacity ||
                    userData.isFollowing
                  ) {
                    setUserListModalOpen(true);
                    setUserListModalType("Following");
                  }
                }}
              >{`${userData.followingCount} following`}</div>
            </div>
            {tokenUsername !== userData.username && (
              <button className="full-width" onClick={() => handleFollow()}>
                {userData.isFollowing
                  ? "Unfollow"
                  : userData.isFollowRequested
                  ? "Requested"
                  : "Follow"}
              </button>
            )}
          </div>
          {/* FOR MOBILE FOLLOW FOLLOWING*/}
          <div className="only-mobile" style={{ marginTop: "10px" }}>
            <div className="container-x">
              {/* follower */}
              <div
                style={{ alignItems: "center", marginRight: "10px" }}
                className="container-y pointer"
                onClick={() => {
                  if (
                    userData.username === Cookies.get("username") ||
                    !userData.privacity ||
                    userData.isFollowing
                  ) {
                    setUserListModalOpen(true);
                    setUserListModalType("Followers");
                  }
                }}
              >
                {`${userData.followerCount}`}
                <div>follower</div>
              </div>
              {/* following */}
              <div
                style={{ alignItems: "center" }}
                className="container-y pointer"
                onClick={() => {
                  if (
                    userData.username === Cookies.get("username") ||
                    !userData.privacity ||
                    userData.isFollowing
                  ) {
                    setUserListModalOpen(true);
                    setUserListModalType("Following");
                  }
                }}
              >
                {`${userData.followingCount}`}
                <div>following</div>
              </div>
            </div>
            {tokenUsername !== userData.username && (
              <button className="full-width" onClick={() => handleFollow()}>
                {userData.isFollowing
                  ? "Unfollow"
                  : userData.isFollowRequested
                  ? "Requested"
                  : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* FOR MOBILE NAME AND ICONS */}
      <div className="only-mobile">{nameAndIcon}</div>
      {/* BIOGRAPHY */}
      <div style={{ marginTop: "8px" }}>{userData.biography}</div>
      {/* LINK */}
      {userData.link && (
        <div
          className="container-x"
          style={{
            marginTop: "8px",
            alignItems: "center",
          }}
        >
          <img
            style={{ width: "14px", height: "14px", marginRight: "8px" }}
            src={isDarkMode ? linkIconDark : linkIconLight}
            ref={linkIconRef}
            alt="link"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          />
          <div>
            <a
              className="link"
              target="_blank"
              rel="noreferrer"
              href={`https://${userData.link}`}
            >
              {userData.link}
            </a>
          </div>
        </div>
      )}
      {userData?.username && isUserListModalOpen && (
        <GetUserListModal
          isDarkMode={isDarkMode}
          header={userListModalType}
          isOpen={isUserListModalOpen}
          onRequestClose={() => setUserListModalOpen(false)}
          type={userListModalType}
          username={userData.username}
          visitUser={(username) => {
            setUserListModalOpen(false);
            visitUser(username);
          }}
        />
      )}

      {isDialogOpen && (
        <YesNoDialog
          isDarkMode={isDarkMode}
          header={dialogModalHeader}
          body={dialogModalBody}
          isOpen={isDialogOpen}
          onNo={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};
export default DataContainer;

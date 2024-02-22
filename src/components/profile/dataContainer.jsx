import React, { useRef, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import verifiedIcon from "../icon/verified.png";
import adminIcon from "../icon/admin.png";
import { postLink } from "../../API";
import defaultPfp from "../icon/default profile picture.jpg";

// LIGHT THEME ICON
import linkIconLight from "../icon/light-mode/profile/link.png";
import optionsIconLight from "../icon/light-mode/navbar/options.png";
// DARK THEME ICON
import linkIconDark from "../icon/dark-mode/profile/link.png";
import optionsIconDark from "../icon/dark-mode/navbar/options.png";

import GetUserListModal from "../user/getUserListModal";
import MoreModal from "../navbar/moreModal";
import { useNavigate } from "react-router-dom";

const DataContainer = ({
  isDarkMode,
  userData,
  setUserData,
  visitUser,
  handleCatchAxios,
}) => {
  const tokenUsername = Cookies.get("username");
  const token = Cookies.get("token");
  const linkIconRef = useRef();
  const optionsIconRef = useRef();
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const [followButtonText, setFollowButtonText] = useState(
    userData.isFollowing
      ? "Unfollow"
      : userData.isFollowRequested
      ? "Requested"
      : "Follow"
  );

  // eslint-disable-next-line
  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);

  const [isUserListModalOpen, setUserListModalOpen] = useState(false);
  const [userListModalType, setUserListModalType] = useState();

  const navigate = useNavigate();

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

  const handleFollow = async () => {
    setFollowButtonText(
      userData.isFollowing
        ? "follow"
        : userData.isFollowRequested
        ? "follow"
        : userData.privacity
        ? "requested"
        : "unfollow"
    );
    await axios
      .post(postLink.follow, {
        username: userData.username,
        token,
      })
      .then((res) => {
        switch (res.data) {
          case "followed":
            setUserData((prevState) => ({
              ...prevState,
              isFollowing: true,
              followerCount: userData.followerCount + 1,
            }));
            break;
          case "follow requested":
            setUserData((prevState) => ({
              ...prevState,
              isFollowRequested: true,
            }));
            break;
          case "unfollowed":
            setUserData((prevState) => ({
              ...prevState,
              isFollowing: false,
              followerCount: userData.followerCount - 1,
            }));
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
      .catch((err) => handleCatchAxios(err));
  };

  const nameAndIcon = (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3
          className="single-line"
          style={{ marginRight: "5px" /*, width: "max-content"*/ }}
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

  const followerAndFollowingPC = (
    <div className="container-x">
      <div
        className="pointer single-line"
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
        className="pointer single-line"
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
  );

  const optionsIcon = (
    <img
      style={{
        width: "28px",
        height: "28px",
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
  );

  const followerAndFollowingMobile = (
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
  );

  const userLink = (
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
  );

  const followMessageButtons = (
    <div className="container-x" style={{ width: "210px" }}>
      <button className="full-width" onClick={handleFollow}>
        {followButtonText}
      </button>
      <button
        onClick={() => {
          navigate(`/inbox/${userData.username}`);
        }}
      >
        {"Message"}
      </button>
    </div>
  );

  return (
    <div className="data-container container-y">
      <div
        className="container-x"
        style={{
          paddingBottom: "1rem",
          // paddingTop: "2rem",
          justifyContent: "space-between",
        }}
      >
        <div className="container-x" style={{ width: "100%" }}>
          <img
            className="profile-picture-page"
            src={
              pfpLoaded
                ? `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${userData.username}`
                : defaultPfp
            }
            onLoad={() => setPfpLoaded(true)}
            onError={() => setPfpLoaded(false)}
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
              width: "100%",
              alignItems: "center",
            }}
          >
            {/* FOR PC NAME AND ICONS */}
            <div className="only-pc">{nameAndIcon}</div>

            {/* FOR PC follower and following */}
            <div className="only-pc">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "15px",
                }}
              >
                {followerAndFollowingPC}
                {tokenUsername !== userData.username && followMessageButtons}
              </div>
            </div>
            {/* FOR MOBILE FOLLOW FOLLOWING*/}
            <div className="only-mobile">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {followerAndFollowingMobile}
                {tokenUsername !== userData.username && followMessageButtons}
              </div>
            </div>
          </div>
        </div>
        {/* OPTIONS ICON  */}
        {userData.username === Cookies.get("username") && optionsIcon}
      </div>
      {/* FOR MOBILE NAME AND ICONS */}
      <div className="only-mobile">{nameAndIcon}</div>
      {/* BIOGRAPHY */}
      <div style={{ marginTop: "8px" }}>{userData.biography}</div>
      {/* LINK */}
      {userData.link && userLink}
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
          handleCatchAxios={handleCatchAxios}
        />
      )}
      {isOptionsModalOpen && (
        <MoreModal
          isDarkMode={isDarkMode}
          isOpen={isOptionsModalOpen}
          onRequestClose={() => setOptionsModalOpen(false)}
        />
      )}
    </div>
  );
};
export default DataContainer;

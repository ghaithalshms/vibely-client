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
import handleCache from "../../cache/cacheMedia";

const DataContainer = ({
  isDarkMode,
  userData,
  setUserData,
  visitUser,
  handleCatchAxios,
  setErrorCode,
  setUserPostFlowArray,
}) => {
  const tokenUsername = Cookies.get("username");
  const token = Cookies.get("token");
  const linkIconRef = useRef();
  const optionsIconRef = useRef();

  const [pfp, setPfp] = useState(null);
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const [followButtonText, setFollowButtonText] = useState(
    userData.isFollowing
      ? "Unfollow"
      : userData.isFollowRequested
      ? "Requested"
      : "Follow"
  );

  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);

  const [isUserListModalOpen, setUserListModalOpen] = useState(false);
  const [userListModalType, setUserListModalType] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    updateIcons(); // eslint-disable-next-line
  }, [isDarkMode]);

  const updateIcons = () => {
    if (linkIconRef.current)
      linkIconRef.current.src = isDarkMode ? linkIconDark : linkIconLight;
    if (optionsIconRef.current)
      optionsIconRef.current.src = isDarkMode
        ? optionsIconDark
        : optionsIconLight;
  };

  const handleFollow = async () => {
    try {
      const res = await axios.post(postLink.follow, {
        username: userData.username,
        token,
      });

      switch (res.data) {
        case "Followed":
          setFollowButtonText("Unfollow");
          setUserData((prevState) => ({
            ...prevState,
            isFollowing: true,
            followerCount: userData.followerCount + 1,
          }));
          break;
        case "Follow request sent":
          setFollowButtonText("Requested");
          setUserData((prevState) => ({
            ...prevState,
            isFollowRequested: true,
          }));
          break;
        case "Unfollowed":
          setFollowButtonText("Follow");
          setUserData((prevState) => ({
            ...prevState,
            isFollowing: false,
            followerCount: userData.followerCount - 1,
          }));
          setUserPostFlowArray([]);
          break;
        case "Follow request deleted":
          setFollowButtonText("Follow");
          setUserData((prevState) => ({
            ...prevState,
            isFollowRequested: false,
          }));
          break;
        default:
          setUserData((prevState) => ({ ...prevState }));
      }
    } catch (err) {
      handleCatchAxios(err);
    }
  };

  const renderNameAndIcons = () => (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 className="single-line">{`${userData.firstName} ${userData.lastName}`}</h3>
        {userData.isVerified && (
          <img
            style={{ height: "20px", width: "20px", marginRight: "3px" }}
            src={verifiedIcon}
            alt="verified"
            onContextMenu={(event) => event.preventDefault()}
          />
        )}
        {userData.isAdmin && (
          <img
            style={{ height: "15px", width: "15px" }}
            src={adminIcon}
            alt="admin"
            onContextMenu={(event) => event.preventDefault()}
          />
        )}
      </div>
      <span>{`@${userData.username}`}</span>
    </div>
  );

  const renderFollowerAndFollowing = () => (
    <div className="container-x">
      <div
        className="pointer single-line"
        onClick={() => handleUserListModalOpen("Followers")}
        style={{ marginRight: "10px" }}
      >{`${userData.followerCount} follower`}</div>
      <div
        className="pointer single-line"
        onClick={() => handleUserListModalOpen("Following")}
      >{`${userData.followingCount} following`}</div>
    </div>
  );

  const renderOptionsIcon = () => (
    <img
      style={{ width: "28px", height: "28px" }}
      src={isDarkMode ? optionsIconDark : optionsIconLight}
      alt="options"
      className="pointer"
      onClick={() => setOptionsModalOpen(true)}
      onContextMenu={(event) => event.preventDefault()}
    />
  );

  const renderFollowerAndFollowingMobile = () => (
    <div className="container-x">
      <div
        style={{ alignItems: "center", marginRight: "10px" }}
        className="container-y pointer"
        onClick={() => handleUserListModalOpen("Followers")}
      >
        {`${userData.followerCount}`}
        <div>follower</div>
      </div>
      <div
        style={{ alignItems: "center" }}
        className="container-y pointer"
        onClick={() => handleUserListModalOpen("Following")}
      >
        {`${userData.followingCount}`}
        <div>following</div>
      </div>
    </div>
  );

  const renderUserLink = () => (
    <div
      className="container-x"
      style={{ marginTop: "8px", alignItems: "center" }}
    >
      <img
        style={{ width: "14px", height: "14px", marginRight: "8px" }}
        src={isDarkMode ? linkIconDark : linkIconLight}
        ref={linkIconRef}
        alt="link"
        onContextMenu={(event) => event.preventDefault()}
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

  const renderFollowMessageButtons = () => (
    <div className="container-x" style={{ width: "210px" }}>
      <button className="full-width" onClick={handleFollow}>
        {followButtonText}
      </button>
      <button
        onClick={() => {
          setErrorCode(0);
          navigate(`/inbox/${userData.username}`);
        }}
      >
        {"Message"}
      </button>
    </div>
  );

  const handleUserListModalOpen = (type) => {
    if (
      userData.username === tokenUsername ||
      !userData.privacity ||
      userData.isFollowing
    ) {
      setUserListModalOpen(true);
      setUserListModalType(type);
    }
  };

  return (
    <div className="data-container container-y">
      <div
        className="container-x"
        style={{
          paddingBottom: "1rem",
          justifyContent: "space-between",
        }}
      >
        <div className="container-x" style={{ width: "100%" }}>
          <img
            className="profile-picture-page"
            src={pfpLoaded ? pfp : defaultPfp}
            onLoad={() =>
              handleCache(
                "pfp",
                `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${userData.username}`,
                userData.username,
                setPfp,
                setPfpLoaded
              )
            }
            onError={() => setPfpLoaded(false)}
            alt="Pfp"
            onContextMenu={(event) => event.preventDefault()}
          />
          <div
            className="container-y"
            style={{
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div className="only-pc">{renderNameAndIcons()}</div>
            <div className="only-pc">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "15px",
                }}
              >
                {renderFollowerAndFollowing()}
                {tokenUsername !== userData.username &&
                  renderFollowMessageButtons()}
              </div>
            </div>
            <div className="only-mobile">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {renderFollowerAndFollowingMobile()}
                {tokenUsername !== userData.username &&
                  renderFollowMessageButtons()}
              </div>
            </div>
          </div>
        </div>
        {userData.username === tokenUsername && renderOptionsIcon()}
      </div>
      <div className="only-mobile">{renderNameAndIcons()}</div>
      <div style={{ marginTop: "8px" }}>{userData.biography}</div>
      {userData.link && renderUserLink()}
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
          setErrorCode={setErrorCode}
        />
      )}
      {isOptionsModalOpen && (
        <MoreModal
          isDarkMode={isDarkMode}
          isOpen={isOptionsModalOpen}
          onRequestClose={() => setOptionsModalOpen(false)}
          setErrorCode={setErrorCode}
        />
      )}
    </div>
  );
};

export default DataContainer;

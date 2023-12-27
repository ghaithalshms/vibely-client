import React, { useRef, useEffect } from "react";
import "../../style.css";
import Cookies from "js-cookie";
import axios from "axios";
import verifiedIcon from "../../icon/verified.png";
import adminIcon from "../../icon/admin.png";
// LIGHT THEME ICON
import linkIconLight from "../../icon/light-mode/profile/link.png";
// DARK THEME ICON
import linkIconDark from "../../icon/dark-mode/profile/link.png";
import { postLink } from "../../API";

const DataContainer = ({ isDarkMode, userData, setUserData }) => {
  const token = Cookies.get("token");
  const linkIconRef = useRef();

  useEffect(() => {
    if (linkIconRef.current)
      linkIconRef.current.src = isDarkMode ? linkIconDark : linkIconLight;
  }, [isDarkMode]);

  const handlePfp = () => {
    if (userData?.picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(userData.picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
    else return;
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
            setUserData((prevState) => ({ ...prevState, isFollowed: true }));
            break;
          case "follow requested":
            setUserData((prevState) => ({
              ...prevState,
              isFollowRequested: true,
            }));
            break;
          case "unfollowed":
            setUserData((prevState) => ({ ...prevState, isFollowed: false }));
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
      .catch((err) => console.error(err));
  };

  const nameAndIcon = (
    <div className="container-x" style={{ alignItems: "center" }}>
      <h3
        style={{ marginRight: "5px" }}
      >{`${userData.firstName} ${userData.lastName}`}</h3>
      {userData.isVerified && (
        <img
          style={{ height: "20px", width: "20px" }}
          src={verifiedIcon}
          alt="verified"
        />
      )}
      {userData.isAdmin && (
        <img
          style={{ height: "15px", width: "15px" }}
          src={adminIcon}
          alt="admin"
        />
      )}
    </div>
  );

  return (
    <div className="container-y">
      <div
        className="data-container container-x"
        style={{ padding: "1rem", paddingTop: "2rem" }}
      >
        <img className="profile-picture" src={handlePfp()} alt="Pfp" />
        <div
          className="container-y"
          style={{
            justifyContent: "center",
            marginLeft: "10%",
          }}
        >
          {/* FOR PC NAME AND ICONS */}
          <div className="only-pc">{nameAndIcon}</div>
          <span className="only-pc">{`@${userData.username}`}</span>
          {/* FOR PC follower and following */}
          <div className="only-pc" style={{ marginTop: "15px" }}>
            <div className="container-x">
              <div
                style={{ marginRight: "10px" }}
              >{`${userData.followerCount} follower`}</div>
              <div>{`${userData.followingCount} following`}</div>
            </div>
            {token !== userData.username && (
              <button className="full-width" onClick={() => handleFollow()}>
                {userData.isFollowing
                  ? "Unfollow"
                  : userData.isFollowRequested
                  ? "Follow requested"
                  : "Follow"}
              </button>
            )}
          </div>
          {/* FOR MOBILE FOLLOW FOLLOWING*/}
          <div className="only-mobile" style={{ marginTop: "10px" }}>
            <div className="container-x">
              {/* follower */}
              <div
                className="container-y"
                style={{ alignItems: "center", marginRight: "10px" }}
              >
                {`${userData.followerCount}`}
                <div>follower</div>
              </div>
              {/* following */}
              <div className="container-y" style={{ alignItems: "center" }}>
                {`${userData.followingCount}`}
                <div>following</div>
              </div>
            </div>
            {token !== userData.username && (
              <button className="full-width" onClick={() => handleFollow()}>
                {userData.isFollowing
                  ? "Unfollow"
                  : userData.isFollowRequested
                  ? "Follow requested"
                  : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* FOR MOBILE NAME AND ICONS */}
      <div className="only-mobile" style={{ marginLeft: "16px" }}>
        {nameAndIcon}
      </div>
      {/* BIOGRAPHY */}
      <div style={{ marginLeft: "16px", marginTop: "8px" }}>
        {userData.biography}
      </div>
      {/* LINK */}
      {userData.link && (
        <div
          className="container-x"
          style={{
            marginLeft: "16px",
            marginTop: "8px",
            alignItems: "center",
          }}
        >
          <img
            style={{ width: "14px", height: "14px", marginRight: "8px" }}
            src={isDarkMode ? linkIconDark : linkIconLight}
            ref={linkIconRef}
            alt="link"
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
    </div>
  );
};
export default DataContainer;

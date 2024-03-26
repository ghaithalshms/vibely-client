import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postLink } from "../../API";
import Cookies from "js-cookie";
import defaultPfp from "../icon/default profile picture.jpg";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";

const UserComponent = ({
  user,
  visitUser,
  setChatUser,
  followBtn,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [pfpLoaded, setPfpLoaded] = useState(false);
  const [followBtnText, setFollowBtnText] = useState("Follow");

  const navigate = useNavigate();

  const getFollowButtonText = (user) => {
    if (user.isFollowing) return "Unfollow";
    if (user.isFollowRequested) return "Requested";
    return "Follow";
  };

  useEffect(() => {
    setFollowBtnText(getFollowButtonText(user)); // eslint-disable-next-line
  }, []);

  const handleFollow = async () => {
    try {
      const res = await axios.post(postLink.follow, {
        username: user.username,
        token: Cookies.get("token"),
      });

      switch (res.data) {
        case "followed":
        case "unfollowed":
        case "follow request deleted":
          setFollowBtnText("Follow");
          break;
        case "follow requested":
          setFollowBtnText("Requested");
          break;
        default:
          setFollowBtnText("Follow");
      }
    } catch (err) {
      handleCatchAxios(err);
    }
  };

  const handleProfileClick = () => {
    setErrorCode(0);
    navigate(setChatUser ? `/inbox/${user.username}` : `/${user.username}`);
    if (setChatUser) setChatUser(user);
    if (visitUser) visitUser(user.username);
  };

  const renderNameAndIcon = () => (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 style={{ marginRight: "5px" }}>{`${user.firstName} ${
          followBtn ? "" : user.lastName
        }`}</h3>
        {user.isVerified && renderIcon(verifiedIcon, "20px")}
        {user.isAdmin && renderIcon(adminIcon, "15px")}
      </div>
      <span>{`@${user.username}`}</span>
    </div>
  );

  const renderIcon = (icon, size) => (
    <img
      style={{ height: size, width: size, marginRight: "3px" }}
      src={icon}
      alt="icon"
      onContextMenu={(event) => event.preventDefault()}
    />
  );

  return (
    <div
      className="container-x"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        className="container-x pointer"
        onClick={handleProfileClick}
        style={{ marginBottom: "5px" }}
      >
        <img
          className="profile-picture"
          style={{
            width: "43px",
            height: "43px",
            marginRight: "0.8rem",
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
        <div>{renderNameAndIcon()}</div>
      </div>
      {user.username !== Cookies.get("username") && followBtn && (
        <button
          onClick={handleFollow}
          style={{ margin: "0", padding: "3px 3%", width: "103px" }}
        >
          {followBtnText}
        </button>
      )}
    </div>
  );
};

export default UserComponent;

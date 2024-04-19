import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postLink } from "../../API";
import Cookies from "js-cookie";
import defaultPfp from "../icon/default profile picture.jpg";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";

const SuggestionUserComponent = ({
  user,
  visitUser,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [followBtnText, setFollowBtnText] = useState("Follow");

  const [pfpLoaded, setPfpLoaded] = useState(false);

  const navigate = useNavigate();

  const handleSetFollowBtnText = (resData) => {
    switch (resData) {
      case "Followed":
        setFollowBtnText("Unfollow");
        break;
      case "Follow request sent":
        setFollowBtnText("Requested");
        break;
      case "Unfollowed":
      case "Follow request deleted":
        setFollowBtnText("Follow");
        break;
      default:
        break;
    }
  };

  const handleFollow = async () => {
    try {
      const res = await axios.post(postLink.follow, {
        username: user.username,
        token: Cookies.get("token"),
      });
      handleSetFollowBtnText(res.data);
    } catch (err) {
      handleCatchAxios(err);
    }
  };

  const goToUserProfile = () => {
    setErrorCode(0);
    navigate(`/${user.username}`);
    if (visitUser) visitUser(user.username);
  };

  const renderNameAndIcons = () => (
    <div
      className="container-x pointer"
      onClick={goToUserProfile}
      style={{ alignItems: "center" }}
    >
      <span
        style={{ fontSize: "0.9rem", marginRight: "5px" }}
      >{`${user.username} `}</span>
      {user.isVerified && renderIcon(verifiedIcon, 20)}
      {user.isAdmin && renderIcon(adminIcon, 15)}
    </div>
  );

  const renderIcon = (icon, size) => (
    <img
      style={{ height: `${size}px`, width: `${size}px`, marginRight: "3px" }}
      src={icon}
      alt="icon"
      onContextMenu={(event) => event.preventDefault()}
    />
  );

  return (
    <div className="suggestion-user-container">
      <div className="pfp-name">
        <img
          className="suggestion-profile-picture pointer"
          onClick={goToUserProfile}
          src={
            pfpLoaded
              ? `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${user.username}`
              : defaultPfp
          }
          onLoad={() => setPfpLoaded(true)}
          alt="Pfp"
        />
        {renderNameAndIcons()}
      </div>
      <div className="suggestions-user-follow-btn">
        <span className="pointer" onClick={handleFollow}>
          {followBtnText}
        </span>
      </div>
    </div>
  );
};

export default SuggestionUserComponent;

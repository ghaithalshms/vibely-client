import React, { useState } from "react";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postLink } from "../../API";
import Cookies from "js-cookie";

const SuggestionUserComponent = ({ user, visitUser, handleCatchAxios }) => {
  const [followBtnText, setFollowBtnText] = useState("Follow");

  const navigate = useNavigate();

  const handleSetFollowBtnText = (resData) => {
    switch (resData) {
      case "followed":
        setFollowBtnText("Unfollow");
        break;
      case "follow requested":
        setFollowBtnText("Requested");
        break;
      case "unfollowed":
        setFollowBtnText("Follow");
        break;
      case "follow request deleted":
        setFollowBtnText("Follow");
        break;
      default:
        return;
    }
  };

  const handleFollow = async () => {
    await axios
      .post(postLink.follow, {
        username: user.username,
        token: Cookies.get("token"),
      })
      .then((res) => {
        handleSetFollowBtnText(res.data);
      })
      .catch((err) => handleCatchAxios(err));
  };

  const nameAndIcon = (
    <div
      className="container-x pointer"
      onClick={() => {
        navigate(`/${user.username}`);
        if (visitUser) visitUser(user.username);
      }}
      style={{ alignItems: "center" }}
    >
      <span
        style={{ fontSize: "0.9rem", marginRight: "5px" }}
      >{`${user.username} `}</span>
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
  );
  return (
    <div className="suggestion-user-container">
      <div className="pfp-name">
        <img
          className="suggestion-profile-picture pointer"
          onClick={() => {
            navigate(`/${user.username}`);
            if (visitUser) visitUser(user.username);
          }}
          src={`${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${user.username}`}
          alt=""
        />
        {nameAndIcon}
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

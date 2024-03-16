import React, { useState } from "react";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postLink } from "../../API";
import Cookies from "js-cookie";
import defaultPfp from "../icon/default profile picture.jpg";

const UserComponent = ({
  user,
  visitUser,
  setChatUser,
  followBtn,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const [followBtnText, setFollowBtnText] = useState(
    user.isFollowing
      ? "Unfollow"
      : user.isFollowRequested
      ? "Requested"
      : "Follow"
  );

  const handleFollow = async () => {
    await axios
      .post(postLink.follow, {
        username: user.username,
        token: Cookies.get("token"),
      })
      .then((res) => {
        switch (res.data) {
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
            setFollowBtnText("Follow");
        }
      })
      .catch((err) => handleCatchAxios(err));
  };

  const navigate = useNavigate();
  const nameAndIcon = (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 style={{ marginRight: "5px" }}>{`${user.firstName} ${
          followBtn ? "" : user.lastName
        }`}</h3>
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
      <span>{`@${user.username}`}</span>
    </div>
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
        onClick={() => {
          if (setChatUser) {
            setErrorCode(0);
            navigate(`/inbox/${user.username}`);
            setChatUser(user);
          } else {
            setErrorCode(0);
            navigate(`/${user.username}`);
            if (visitUser) visitUser(user.username);
          }
        }}
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
        <div>{nameAndIcon}</div>
      </div>
      {followBtn && (
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

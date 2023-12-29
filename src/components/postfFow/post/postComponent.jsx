import React, { useState } from "react";
import axios from "axios";
import defaultPfp from "../../icon/default profile picture.jpg";
import adminIcon from "../../icon/admin.png";
import verifiedIcon from "../../icon/verified.png";
import { useNavigate } from "react-router-dom";
import { timeDifference } from "../../func/timeDifference";
import "./post.css";
import Cookies from "js-cookie";
import CommentComponent from "./commentComponent";

// LIGHT MODE ICONS
import like0Light from "../../icon/light-mode/post/like 0.png";
import like1Light from "../../icon/light-mode/post/like 1.png";
import save0Light from "../../icon/light-mode/post/save 0.png";
import save1Light from "../../icon/light-mode/post/save 1.png";
import commentLight from "../../icon/light-mode/post/comment.png";
import optionsLight from "../../icon/light-mode/post/options.png";
// DARK MODE ICONS
import like0Dark from "../../icon/dark-mode/post/like 0.png";
import like1Dark from "../../icon/dark-mode/post/like 1.png";
import save0Dark from "../../icon/dark-mode/post/save 0.png";
import save1Dark from "../../icon/dark-mode/post/save 1.png";
import commentDark from "../../icon/dark-mode/post/comment.png";
import optionsDark from "../../icon/dark-mode/post/options.png";
import { postLink } from "../../../API";

const PostComponent = ({
  isDarkMode,
  user,
  post,
  handleUpdatePost,
  visitUser,
  handleCatchAxios,
}) => {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const handlePicture = (picture) => {
    if (picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
    else return defaultPfp;
  };

  const handleLikePost = async () => {
    handleUpdatePost(post.postID, "like");
    await axios
      .post(postLink.likePost, {
        postID: post.postID,
        token: Cookies.get("token"),
      })
      .then()
      .catch((err) => handleCatchAxios(err));
  };

  const handleSavePost = async () => {
    handleUpdatePost(post.postID, "save");
    await axios
      .post(postLink.savePost, {
        postID: post.postID,
        token: Cookies.get("token"),
      })
      .then()
      .catch((err) => handleCatchAxios(err));
  };

  const navigate = useNavigate();
  const nameIconDate = (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 style={{ marginRight: "5px" }}>{`${user.firstName} `}</h3>
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
      <span>{`@${user.username} · ${timeDifference(post.postDate)}`}</span>
    </div>
  );

  const postHeader = (
    <div className="post-header">
      <div
        className="container-x pointer"
        onClick={() => {
          navigate(`/${user.username}`);
          visitUser(user.username);
        }}
      >
        <img
          className="profile-picture"
          style={{
            width: "43px",
            height: "43px",
            marginRight: "0.8rem",
            marginBottom: "0.5rem",
          }}
          src={handlePicture(user?.picture)}
          alt=""
        />
        <div>{nameIconDate}</div>
      </div>
      <img
        className="pointer"
        style={{ height: "20px", width: "20px" }}
        src={isDarkMode ? optionsDark : optionsLight}
        alt="options"
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
    </div>
  );

  const postIcons = (
    <>
      <div
        className="post-icons container-x"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          marginTop: "1rem",
        }}
      >
        <div
          className="container-x"
          style={{
            alignItems: "center",
          }}
        >
          {/* LIKE ICON */}
          <img
            className="pointer"
            style={{ height: "24px", width: "24px", marginRight: "0.7rem" }}
            src={
              isDarkMode
                ? post.isLiked
                  ? like1Dark
                  : like0Dark
                : post.isLiked
                ? like1Light
                : like0Light
            }
            alt="like"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
            onClick={handleLikePost}
          />
          {/* COMMENT ICON */}
          <img
            className="pointer"
            style={{ height: "22px", width: "22px" }}
            src={isDarkMode ? commentDark : commentLight}
            alt="comment"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
            onClick={() => setIsCommentsModalOpen(true)}
          />
        </div>
        {/* SAVE ICON */}
        <img
          className="pointer"
          style={{ height: "22px", width: "22px" }}
          src={
            isDarkMode
              ? post.isSaved
                ? save1Dark
                : save0Dark
              : post.isSaved
              ? save1Light
              : save0Light
          }
          alt="save"
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          onClick={handleSavePost}
        />
      </div>
      {/* LIKE COUNT SPAN */}
      {post.likeCount !== 0 && (
        <span
          style={{ marginTop: ".5rem", marginLeft: "10px" }}
        >{`${post.likeCount} like`}</span>
      )}
    </>
  );

  const postBody = (
    <div className="post-content container-y">
      <pre>{post.description}</pre>
      {post?.picture && (
        <img
          className="post-picture"
          src={handlePicture(post?.picture)}
          alt="post pic"
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
      )}
      {/* POST ICONS */}
      {postIcons}
    </div>
  );

  return (
    <div className="container-y" style={{ padding: "10px", marginTop: "1rem" }}>
      {/* user info */}
      {postHeader}
      {/* post desc, pic and icons */}
      {postBody}
      {/* bottom line */}
      <div className="line">
        <hr />
      </div>
    </div>
  );
};

export default PostComponent;

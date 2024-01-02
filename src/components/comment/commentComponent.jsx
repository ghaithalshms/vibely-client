import React, { useState } from "react";
import defaultPfp from "../icon/default profile picture.jpg";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { deleteLink, postLink } from "../../API";
// LIGHT MODE ICONS
import like0Light from "../icon/light-mode/post/like 0.png";
import like1Light from "../icon/light-mode/post/like 1.png";
import deleteLight from "../icon/light-mode/post/delete.png";
// DARK MODE ICONS
import like0Dark from "../icon/dark-mode/post/like 0.png";
import like1Dark from "../icon/dark-mode/post/like 1.png";
import deleteDark from "../icon/dark-mode/post/delete.png";

const CommentComponent = ({
  isDarkMode,
  comment,
  visitUser,
  handleCatchAxios,
  handleUpdateComments,
}) => {
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const handlePfp = () => {
    if (comment?.picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(comment.picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
    else return defaultPfp;
  };

  const handleLikeComment = async () => {
    handleUpdateComments(comment.commentID);
    await axios
      .post(postLink.likeComment, {
        commentID: comment.commentID,
        token: Cookies.get("token"),
      })
      .then()
      .catch((err) => handleCatchAxios(err));
  };

  const handleDeleteComment = async () => {
    setIsCommentDeleted(true);
    await axios
      .post(deleteLink.deleteComment, {
        token: Cookies.get("token"),
        commentID: comment.commentID,
      })
      .then()
      .catch((err) => {
        console.log(err);
        handleCatchAxios(err);
      });
  };

  const navigate = useNavigate();

  const nameAndIcon = (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 style={{ marginRight: "5px" }}>{`${comment.firstName} `}</h3>
        {comment.isVerified && (
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
        {comment.isAdmin && (
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
      {/* <span>{`@${comment.username}`}</span> */}
    </div>
  );

  const likeIconCount = (
    <div
      className="container-x"
      style={{ marginLeft: "auto", marginTop: "10px" }}
    >
      {/* LIKE ICON */}
      <img
        className="pointer"
        style={{
          height: "17px",
          width: "17px",
          marginRight: "0.5rem",
        }}
        src={
          isDarkMode
            ? comment.isLiked
              ? like1Dark
              : like0Dark
            : comment.isLiked
            ? like1Light
            : like0Light
        }
        alt="like"
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
        onClick={handleLikeComment}
      />
      {/* LIKE COUNT */}
      {comment.likeCount > 0 && (
        <span style={{ marginRight: "5px" }}>{comment.likeCount}</span>
      )}
      {/* COMMENT DELETE ICON */}
      {comment.username === Cookies.get("username") && (
        <img
          className="pointer"
          style={{
            height: "17px",
            width: "17px",
          }}
          src={isDarkMode ? deleteDark : deleteLight}
          alt="like"
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          onClick={handleDeleteComment}
        />
      )}
    </div>
  );

  if (isCommentDeleted) return <></>;
  return (
    <div className="container-x">
      <img
        className="profile-picture pointer"
        style={{
          width: "43px",
          height: "43px",
          marginRight: "0.8rem",
          marginBottom: "0.5rem",
        }}
        src={handlePfp()}
        alt=""
        onClick={() => {
          navigate(`/${comment.username}`);
          if (visitUser) visitUser(comment.username);
        }}
      />
      <div className="container-y">
        <div
          className="pointer"
          onClick={() => {
            navigate(`/${comment.username}`);
            if (visitUser) visitUser(comment.username);
          }}
        >
          {nameAndIcon}
        </div>
        <p>{comment.comment}</p>
      </div>
      {/* LIKE ICON AND LIKE COUNT*/}
      {likeIconCount}
    </div>
  );
};

export default CommentComponent;

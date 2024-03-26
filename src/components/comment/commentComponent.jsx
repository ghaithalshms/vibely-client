import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { deleteLink, postLink } from "../../API";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";
import defaultPfp from "../icon/default profile picture.jpg";
import like0Light from "../icon/light-mode/post/like 0.png";
import like1Light from "../icon/light-mode/post/like 1.png";
import deleteLight from "../icon/light-mode/post/delete.png";
import like0Dark from "../icon/dark-mode/post/like 0.png";
import like1Dark from "../icon/dark-mode/post/like 1.png";
import deleteDark from "../icon/dark-mode/post/delete.png";

const CommentComponent = ({
  isDarkMode,
  comment,
  visitUser,
  handleUpdateComments,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);
  const [pfpLoaded, setPfpLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${comment.username}`
        );
        setPfpLoaded(true);
      } catch (error) {
        setPfpLoaded(false);
      }
    };

    loadProfilePicture();
  }, [comment.username]);

  const handleLikeComment = async () => {
    try {
      await axios.post(postLink.likeComment, {
        commentID: comment.commentID,
        token: Cookies.get("token"),
      });
      handleUpdateComments(comment.commentID);
    } catch (error) {
      handleCatchAxios(error);
    }
  };

  const handleDeleteComment = async () => {
    setIsCommentDeleted(true);
    try {
      await axios.post(deleteLink.deleteComment, {
        token: Cookies.get("token"),
        commentID: comment.commentID,
      });
    } catch (error) {
      handleCatchAxios(error);
    }
  };

  const renderNameAndIcon = () => (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 style={{ marginRight: "5px" }}>{`${comment.firstName} `}</h3>
        {comment.isVerified && renderIcon(verifiedIcon)}
        {comment.isAdmin && renderIcon(adminIcon)}
      </div>
    </div>
  );

  const renderIcon = (icon) => (
    <img
      style={{ height: "20px", width: "20px", marginRight: "3px" }}
      src={icon}
      alt="icon"
      onContextMenu={(event) => event.preventDefault()}
    />
  );

  const renderLikeIconAndCount = () => (
    <div
      className="container-x"
      style={{ marginLeft: "auto", marginTop: "10px" }}
    >
      <img
        className="pointer"
        style={{ height: "17px", width: "17px", marginRight: "0.5rem" }}
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
        onContextMenu={(event) => event.preventDefault()}
        onClick={handleLikeComment}
      />
      {comment.likeCount > 0 && (
        <span style={{ marginRight: "5px" }}>{comment.likeCount}</span>
      )}
      {comment.username === Cookies.get("username") && renderDeleteIcon()}
    </div>
  );

  const renderDeleteIcon = () => (
    <img
      className="pointer"
      style={{ height: "17px", width: "17px" }}
      src={isDarkMode ? deleteDark : deleteLight}
      alt="delete"
      onContextMenu={(event) => event.preventDefault()}
      onClick={handleDeleteComment}
    />
  );

  if (isCommentDeleted) return null;

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
        src={
          pfpLoaded
            ? `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${comment.username}`
            : defaultPfp
        }
        onLoad={() => setPfpLoaded(true)}
        onError={() => setPfpLoaded(false)}
        alt="Pfp"
        onClick={() => {
          setErrorCode(0);
          navigate(`/${comment.username}`);
          if (visitUser) visitUser(comment.username);
        }}
      />
      <div className="container-y">
        <div
          className="pointer"
          onClick={() => navigate(`/${comment.username}`)}
        >
          {renderNameAndIcon()}
        </div>
        <p>{comment.comment}</p>
      </div>
      {renderLikeIconAndCount()}
    </div>
  );
};

export default CommentComponent;

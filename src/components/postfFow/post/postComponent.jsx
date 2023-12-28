import React, { useEffect, useRef } from "react";
import defaultPfp from "../../../icon/default profile picture.jpg";
import adminIcon from "../../../icon/admin.png";
import verifiedIcon from "../../../icon/verified.png";
import { useNavigate } from "react-router-dom";
import { timeDifference } from "../../func/timeDifference";
import "./post.css";

// LIGHT MODE ICONS
import like0Light from "../../../icon/light-mode/post/like 0.png";
import like1Light from "../../../icon/light-mode/post/like 1.png";
import save0Light from "../../../icon/light-mode/post/save 0.png";
import save1Light from "../../../icon/light-mode/post/save 1.png";
import commentLight from "../../../icon/light-mode/post/comment.png";
import optionsLight from "../../../icon/light-mode/post/options.png";
// DARK MODE ICONS
import like0Dark from "../../../icon/dark-mode/post/like 0.png";
import like1Dark from "../../../icon/dark-mode/post/like 1.png";
import save0Dark from "../../../icon/dark-mode/post/save 0.png";
import save1Dark from "../../../icon/dark-mode/post/save 1.png";
import commentDark from "../../../icon/dark-mode/post/comment.png";
import optionsDark from "../../../icon/dark-mode/post/options.png";

const PostComponent = ({ isDarkMode, user, post, visitUser }) => {
  const likeIconRef = useRef();
  const saveIconRef = useRef();
  const commentIconRef = useRef();
  const optionsIconRef = useRef();
  useEffect(() => {
    if (likeIconRef.current)
      likeIconRef.current.src = isDarkMode
        ? post.isLiked
          ? like1Dark
          : like0Dark
        : post.isLiked
        ? like1Light
        : like0Light;
  }, [isDarkMode]);

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
  return (
    <div className="container-y" style={{ padding: "10px", marginTop: "1rem" }}>
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
          style={{ height: "20px", width: "20px" }}
          src={isDarkMode ? optionsDark : optionsLight}
          ref={optionsIconRef}
          alt="options"
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
      </div>
      <div className="post-content container-y">
        <p>{post.description}</p>
        {post?.picture && (
          <img
            className="post-picture"
            src={handlePicture(post?.picture)}
            alt="post pic"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
            style={{ marginBottom: "1rem" }}
          />
        )}
        <div
          className="post-icons container-x"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
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
              ref={optionsIconRef}
              alt="options"
              // block right click
              onContextMenu={(event) => {
                event.preventDefault();
              }}
            />
            {/* COMMENT ICON */}
            <img
              style={{ height: "22px", width: "22px" }}
              src={isDarkMode ? commentDark : commentLight}
              ref={optionsIconRef}
              alt="options"
              // block right click
              onContextMenu={(event) => {
                event.preventDefault();
              }}
            />
          </div>
          {/* SAVE ICON */}
          <img
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
            ref={optionsIconRef}
            alt="options"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          />
        </div>
        {/* LIKE COUNT SPAN */}
        {post.likeCount !== 0 && (
          <span
            style={{ marginTop: ".5rem", marginLeft: "10px" }}
          >{`${post.likeCount} like`}</span>
        )}
      </div>
    </div>
  );
};

export default PostComponent;

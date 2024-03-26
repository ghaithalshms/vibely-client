import React, { useState } from "react";
import axios from "axios";
import adminIcon from "../icon/admin.png";
import verifiedIcon from "../icon/verified.png";
import { useNavigate } from "react-router-dom";
import { timeDifference } from "../func/timeDifference";
import "./post.css";
import Cookies from "js-cookie";
import CommentsModal from "../comment/commentsModal";
import GetUserListModal from "../user/getUserListModal";
import PostMoreModal from "./postMoreModal";
import defaultPfp from "../icon/default profile picture.jpg";

// LIGHT MODE ICONS
import like0Light from "../icon/light-mode/post/like 0.png";
import like1Light from "../icon/light-mode/post/like 1.png";
import save0Light from "../icon/light-mode/post/save 0.png";
import save1Light from "../icon/light-mode/post/save 1.png";
import commentLight from "../icon/light-mode/post/comment.png";
import optionsLight from "../icon/light-mode/post/options.png";
// DARK MODE ICONS
import like0Dark from "../icon/dark-mode/post/like 0.png";
import like1Dark from "../icon/dark-mode/post/like 1.png";
import save0Dark from "../icon/dark-mode/post/save 0.png";
import save1Dark from "../icon/dark-mode/post/save 1.png";
import commentDark from "../icon/dark-mode/post/comment.png";
import optionsDark from "../icon/dark-mode/post/options.png";
import { postLink } from "../../API";

const PostComponent = ({
  isDarkMode,
  user,
  post,
  postFlow,
  setPostFlow,
  visitUser,
  handleUpdatePost,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isUserListModalOpen, setUserListModalOpen] = useState(false);
  const [pfpLoaded, setPfpLoaded] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(post.fileType === "text/plain");

  const [isPostMoreModalOpen, setPostMoreModalOpen] = useState(false);
  const [isPostDeleted, setPostDeleted] = useState(false);

  const navigate = useNavigate();

  const handleLikePost = async () => {
    handleUpdate("like", postLink.likePost);
  };

  const handleSavePost = async () => {
    handleUpdate("save", postLink.savePost);
  };

  const handleUpdate = async (action, link) => {
    handleUpdatePost(post.postID, action, postFlow, setPostFlow);
    try {
      await axios.post(link, {
        postID: post.postID,
        token: Cookies.get("token"),
      });
    } catch (err) {
      handleCatchAxios(err);
    }
  };

  const handleProfileClick = () => {
    setErrorCode(0);
    navigate(`/${user.username}`);
    if (visitUser) visitUser(user.username);
  };

  const renderNameIconDate = () => (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 style={{ marginRight: "5px" }}>{`${user.firstName} `}</h3>
        {user.isVerified && (
          <img
            src={verifiedIcon}
            alt="verified"
            style={{ height: "20px", width: "20px", marginRight: "3px" }}
          />
        )}
        {user.isAdmin && (
          <img
            src={adminIcon}
            alt="admin"
            style={{ height: "15px", width: "15px" }}
          />
        )}
      </div>
      <span>{`@${user.username} · ${timeDifference(post.postDate)}`}</span>
    </div>
  );

  const renderPostMoreIcons = () => (
    <>
      {(post.username === Cookies.get("username") ||
        user.username === Cookies.get("username")) && (
        <img
          className="pointer"
          style={{ height: "20px", width: "20px" }}
          src={isDarkMode ? optionsDark : optionsLight}
          alt="options"
          onContextMenu={(event) => event.preventDefault()}
          onClick={() => setPostMoreModalOpen(true)}
        />
      )}
    </>
  );

  const renderPostHeader = () => (
    <div className="post-header">
      <div className="container-x pointer" onClick={handleProfileClick}>
        <img
          className="profile-picture"
          style={{
            width: "43px",
            height: "43px",
            marginRight: "0.8rem",
            marginBottom: "0.5rem",
          }}
          src={
            pfpLoaded
              ? `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${user.username}`
              : defaultPfp
          }
          onLoad={() => setPfpLoaded(true)}
          onError={() => setPfpLoaded(false)}
          alt="Pfp"
          onContextMenu={(event) => event.preventDefault()}
        />
        <div>{renderNameIconDate()}</div>
      </div>
      {renderPostMoreIcons()}
    </div>
  );

  const renderPostFileLoading = () => (
    <div
      className="full-width"
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <span className="loader" />
    </div>
  );

  const renderPostIcons = () => (
    <div
      className="post-icons container-x"
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        marginTop: "1rem",
      }}
    >
      <div className="container-x" style={{ alignItems: "center" }}>
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
          onContextMenu={(event) => event.preventDefault()}
          onClick={handleLikePost}
        />
        <div
          className="container-x pointer"
          onClick={() => setIsCommentsModalOpen(true)}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <img
            style={{ height: "22px", width: "22px" }}
            src={isDarkMode ? commentDark : commentLight}
            alt="comment"
            onContextMenu={(event) => event.preventDefault()}
          />
          {post.commentCount > 0 && (
            <span style={{ marginLeft: "10px" }}>{`${post.commentCount}`}</span>
          )}
        </div>
      </div>
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
        onContextMenu={(event) => event.preventDefault()}
        onClick={handleSavePost}
      />
    </div>
  );

  const renderLikeCount = post.likeCount !== 0 && (
    <span
      className="pointer"
      style={{ marginTop: ".5rem", marginLeft: "10px" }}
      onClick={() => setUserListModalOpen(true)}
    >{`${post.likeCount} like`}</span>
  );

  const renderPostBody = () => (
    <div className="post-content container-y">
      <pre>{post.description}</pre>
      {!fileLoaded && renderPostFileLoading()}
      {post.fileType?.startsWith("image") && (
        <img
          className="post-file"
          loading="lazy"
          src={`${
            process.env.REACT_APP_API_URL
          }/api/post/file?token=${Cookies.get("token")}&postID=${post.postID}`}
          onLoad={() => setFileLoaded(true)}
          onError={() => setFileLoaded(false)}
          alt="Post pic"
          onContextMenu={(event) => event.preventDefault()}
        />
      )}
      {post.fileType?.startsWith("video") && (
        <video
          style={{ display: fileLoaded ? "inline" : "none" }}
          className="post-file"
          loading="lazy"
          src={`${
            process.env.REACT_APP_API_URL
          }/api/post/file?token=${Cookies.get("token")}&postID=${post.postID}`}
          onLoadedData={() => setFileLoaded(true)}
          onError={() => setFileLoaded(false)}
          type="video/mp4"
          controls
          controlsList="nodownload"
          onContextMenu={(event) => event.preventDefault()}
        />
      )}

      {renderPostIcons()}
      {renderLikeCount}
    </div>
  );

  if (isPostDeleted) return null;

  return (
    <div className="container-y" style={{ padding: "10px", marginTop: "1rem" }}>
      {renderPostHeader()}
      {renderPostBody()}
      <div className="line">
        <hr />
      </div>
      {isCommentsModalOpen && (
        <CommentsModal
          isDarkMode={isDarkMode}
          isOpen={isCommentsModalOpen}
          onRequestClose={() => setIsCommentsModalOpen(false)}
          header={"Comments"}
          postID={post.postID}
          visitUser={(username) => {
            setIsCommentsModalOpen(false);
            if (visitUser) visitUser(username);
          }}
          handleCatchAxios={handleCatchAxios}
          setErrorCode={setErrorCode}
        />
      )}
      {post.likeCount > 0 && isUserListModalOpen && (
        <GetUserListModal
          isDarkMode={isDarkMode}
          header={"Liked Users"}
          isOpen={isUserListModalOpen}
          onRequestClose={() => setUserListModalOpen(false)}
          type={"Liked Users"}
          visitUser={(username) => {
            setUserListModalOpen(false);
            if (visitUser) visitUser(username);
          }}
          handleCatchAxios={handleCatchAxios}
          postID={post.postID}
          setErrorCode={setErrorCode}
        />
      )}
      {isPostMoreModalOpen &&
        (post.username === Cookies.get("username") ||
          user.username === Cookies.get("username")) && (
          <PostMoreModal
            isDarkMode={isDarkMode}
            isOpen={isPostMoreModalOpen}
            onRequestClose={() => setPostMoreModalOpen(false)}
            setPostDeleted={() => setPostDeleted(true)}
            postID={post.postID}
            handleCatchAxios={handleCatchAxios}
            isArchived={post.isArchived}
          />
        )}
    </div>
  );
};

export default PostComponent;

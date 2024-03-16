import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../../modal.css";
import { getLink, postLink } from "../../API";
import axios from "axios";
import CommentComponent from "./commentComponent";
import Cookies from "js-cookie";

Modal.setAppElement("#root");

const CommentsModal = ({
  isDarkMode,
  isOpen,
  onRequestClose,
  header,
  postID,
  visitUser,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [commentsArray, setCommentsArray] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [publishButtonDisabled, setPublishButtonDisabled] = useState(false);

  const [comment, setComment] = useState("");

  const handleGetComments = async () => {
    setLoading(true);
    await axios
      .get(getLink.getPostComments, {
        params: {
          postID,
          token: Cookies.get("token"),
        },
      })
      .then((res) => setCommentsArray(res.data))
      .catch((err) => handleCatchAxios(err));
    setLoading(false);
  };

  const handleUpdateComments = (commentID) => {
    let updatedPosts = [];
    commentsArray.forEach((comment) => {
      updatedPosts.push(
        comment.commentID === commentID
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            }
          : comment
      );
    });

    setCommentsArray(updatedPosts);
  };

  const handleCreateComment = async () => {
    setPublishButtonDisabled(true);
    const btnPublish = document.getElementById("btn-publish");
    btnPublish.setAttribute("disabled", "");
    axios
      .post(postLink.createComment, {
        token: Cookies.get("token"),
        postID,
        comment,
      })
      .then(() => {
        setComment("");
        handleGetComments();
        btnPublish.removeAttribute("disabled");
      })
      .catch((err) => handleCatchAxios(err));
  };

  useEffect(() => {
    handleGetComments();
    // eslint-disable-next-line
  }, []);

  const loadingIconElement = (
    <div
      className="full-width"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <span className="loader" />
    </div>
  );

  const commentsElement =
    commentsArray.length > 0 ? (
      commentsArray?.map((comment) => (
        <CommentComponent
          key={comment.commentID}
          isDarkMode={isDarkMode}
          comment={comment}
          visitUser={visitUser}
          handleCatchAxios={handleCatchAxios}
          handleUpdateComments={handleUpdateComments}
          setErrorCode={setErrorCode}
        />
      ))
    ) : (
      <h3 style={{ textAlign: "center" }}>No comments yet</h3>
    );

  const addCommentElement = (
    <div className="container-x" style={{ marginTop: "10px" }}>
      <input
        type="textarea"
        placeholder={`Comment as @${Cookies.get("username")}`}
        value={comment}
        onChange={(e) => setComment(e.currentTarget.value)}
      />
      {comment && (
        <button
          id="btn-publish"
          style={{ padding: "10px 15px", margin: "5px 0", marginLeft: "5px" }}
          onClick={handleCreateComment}
        >
          {publishButtonDisabled && (
            <span style={{ marginBottom: "5px" }} className="mini-loader" />
          )}
          {!publishButtonDisabled && "Publish"}
        </button>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setCommentsArray([]);
        setLoading(true);
        onRequestClose();
      }}
      contentLabel="User List"
      className="modal-container"
      ariaHideApp={false}
      style={{
        overlay: {
          zIndex: 100,
          backgroundColor: isDarkMode
            ? "rgba(255, 255, 255, 0.25)"
            : "rgba(0, 0, 0, 0.25)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: "fadeIn 0.3s",
        },
        content: {
          position: "static",
          width: "350px",
          height: "auto",
          maxHeight: "60svh",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "black" : "white",
          borderColor: isDarkMode ? "black" : "white",
          animation: "fadeIn 0.3s",
        },
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>{header}</h2>
      <div>
        {/* LOADING ICON */}
        {isLoading && loadingIconElement}
        {/* COMMENTS  */}
        {!isLoading && (
          <div style={{ maxHeight: "270px", overflowY: "auto" }}>
            {commentsElement}
          </div>
        )}
        {/* ADD COMMENT */}
        {addCommentElement}
      </div>
    </Modal>
  );
};

export default CommentsModal;

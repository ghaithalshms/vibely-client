import React from "react";
import Modal from "react-modal";
import "../../modal.css";
import axios from "axios";
import { deleteLink, updateLink } from "../../API";
import Cookies from "js-cookie";

Modal.setAppElement("#root");

const PostMoreModal = ({
  isDarkMode,
  isOpen,
  isArchived,
  onRequestClose,
  setPostDeleted,
  postID,
  handleCatchAxios,
}) => {
  const handleDeletePost = async () => {
    setPostDeleted();
    await axios
      .post(deleteLink.deletePost, {
        token: Cookies.get("token"),
        postID,
      })
      .then()
      .catch((err) => handleCatchAxios(err));
  };
  const handleArchivePost = async () => {
    setPostDeleted();
    await axios
      .post(updateLink.archivePost, {
        token: Cookies.get("token"),
        postID,
      })
      .then()
      .catch((err) => handleCatchAxios(err));
  };
  const handleUnarchivePost = async () => {
    setPostDeleted();
    await axios
      .post(updateLink.unarchivePost, {
        token: Cookies.get("token"),
        postID,
      })
      .then()
      .catch((err) => handleCatchAxios(err));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Yes/No Dialog"
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
          width: "300px",
          height: "auto",
          maxHeight: "60svh",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "black" : "white",
          borderColor: isDarkMode ? "black" : "white",
          animation: "fadeIn 0.3s",
        },
      }}
    >
      <h2>More</h2>
      <div className="container-y">
        <button onClick={handleDeletePost}>Delete</button>
        {isArchived ? (
          <button onClick={handleUnarchivePost}>Unarchive</button>
        ) : (
          <button onClick={handleArchivePost}>Archive</button>
        )}
      </div>
    </Modal>
  );
};

export default PostMoreModal;

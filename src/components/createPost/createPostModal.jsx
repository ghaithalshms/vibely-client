import React from "react";
import Modal from "react-modal";
import "../../modal.css";
import CreatePost from "./createPost";

Modal.setAppElement("#root");

const CreatePostModal = ({
  isDarkMode,
  isOpen,
  onRequestClose,
  handleCatchAxios,
  updateUserPostFlow,
}) => {
  const modalStyles = {
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
      height: "auto",
      maxHeight: "60svh",
      borderRadius: "8px",
      backgroundColor: isDarkMode ? "black" : "white",
      borderColor: isDarkMode ? "black" : "white",
      animation: "fadeIn 0.3s",
    },
  };

  const renderCreatePostModal = () => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="User List"
        className="modal-container create-post-modal-container"
        ariaHideApp={false}
        style={modalStyles}
      >
        <h2 style={{ marginBottom: "1rem" }}>Share post</h2>
        <div>
          <CreatePost
            isDarkMode={isDarkMode}
            handleCatchAxios={handleCatchAxios}
            updateUserPostFlow={updateUserPostFlow}
            onRequestClose={onRequestClose}
          />
        </div>
      </Modal>
    );
  };

  return renderCreatePostModal();
};

export default CreatePostModal;

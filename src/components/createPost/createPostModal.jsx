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
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User List"
      className="modal-container create-post-modal-container"
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
          // width: "95svw",
          height: "auto",
          maxHeight: "60svh",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "black" : "white",
          borderColor: isDarkMode ? "black" : "white",
          animation: "fadeIn 0.3s",
        },
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Share post</h2>
      <div>
        <CreatePost
          isDarkMode={isDarkMode}
          handleCatchAxios={handleCatchAxios}
        />
      </div>
    </Modal>
  );
};

export default CreatePostModal;

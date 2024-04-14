import React, { useState } from "react";
import Modal from "react-modal";
import "../../modal.css";
import Cookies from "js-cookie";

Modal.setAppElement("#root");

const OneTimeFileModal = ({ isDarkMode, isOpen, onRequestClose, message }) => {
  const [fileLoaded, setFileLoaded] = useState(false);

  const modalStyle = {
    overlay: {
      zIndex: 100,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      animation: "fadeIn 0.3s",
    },
    content: {
      position: "static",
      height: "auto",
      width: "auto",
      maxWidth: "99svw",
      maxHeight: "95svh",
      borderRadius: "8px",
      backgroundColor: isDarkMode ? "#202020b8" : "#ffffffb4",
      borderColor: isDarkMode ? "black" : "white",
      animation: "fadeIn 0.3s",
      overFlow: "hidden",
    },
  };

  const renderFileLoading = () => {
    return (
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
  };

  const renderMediaElement = () => {
    const mediaUrl = `${
      process.env.REACT_APP_API_URL
    }/api/chat/message-file?token=${Cookies.get("token")}&messageID=${
      message.id
    }`;

    if (message.fileType?.startsWith("image")) {
      return (
        <>
          {!fileLoaded && renderFileLoading()}
          <img
            style={{ maxHeight: "70svh", maxWidth: "90svw" }}
            className="message-picture"
            loading="lazy"
            src={mediaUrl}
            onLoad={() => setFileLoaded(true)}
            onError={onRequestClose}
            alt="Chat pic"
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          />
        </>
      );
    } else if (message.fileType?.startsWith("video")) {
      return (
        <video
          style={{ maxHeight: "70svh", maxWidth: "90svw" }}
          className="message-video"
          loading="lazy"
          src={mediaUrl}
          onLoad={() => setFileLoaded(true)}
          onError={() => setFileLoaded(false)}
          type="video/mp4"
          controls
          controlsList="nodownload"
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User List"
      className="modal-container create-post-modal-container"
      ariaHideApp={false}
      style={modalStyle}
    >
      {renderMediaElement()}
    </Modal>
  );
};

export default OneTimeFileModal;

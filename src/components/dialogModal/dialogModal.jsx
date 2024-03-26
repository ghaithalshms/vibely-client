import React from "react";
import Modal from "react-modal";
import "../../modal.css";

Modal.setAppElement("#root");

const DialogModal = ({
  isDarkMode,
  isOpen,
  header,
  body,
  msgYes,
  msgNo,
  onYes,
  onNo,
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
      width: "300px",
      height: "auto",
      maxHeight: "60svh",
      borderRadius: "8px",
      backgroundColor: isDarkMode ? "black" : "white",
      borderColor: isDarkMode ? "black" : "white",
      animation: "fadeIn 0.3s",
    },
  };

  const renderButtons = (
    <div className="modal-buttons">
      {msgYes && <button onClick={onYes}>Yes</button>}
      {msgNo && <button onClick={onNo}>No</button>}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onNo}
      contentLabel="Dialog Modal"
      className="modal-container"
      ariaHideApp={false}
      style={modalStyles}
    >
      <h2>{header}</h2>
      <p>{body}</p>
      {renderButtons}
    </Modal>
  );
};

export default DialogModal;

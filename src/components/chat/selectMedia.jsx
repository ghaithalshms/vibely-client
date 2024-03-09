import React, { useState, useRef, useEffect } from "react";

import galeryIconLight from "../icon/light-mode/create post/galery.png";
import galeryIconDark from "../icon/dark-mode/create post/galery.png";

const SelectMedia = ({ isDarkMode, onRequestClose, handleSendMessage }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [warning, setWarning] = useState("");
  const pictureRef = useRef();
  const [videoSrc, setVideoSrc] = useState(null);

  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);

  useEffect(() => handleUploadPictureClick(), []);

  const handleSend = async () => {
    setSendButtonDisabled(true);

    const btnSend = document.getElementById("btn-send");
    btnSend.setAttribute("disabled", "");

    handleSendMessage(file, fileType);

    pictureRef.current.src = null;
    setVideoSrc(null);
    setFile(null);
    setFileType(null);
    onRequestClose();

    btnSend.removeAttribute("disabled");
  };

  const handleFileLoad = (e) => {
    setWarning("");
    if (e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 3 * 1024 * 1024) {
        setWarning("Sorry, max file size is 3 mb");
        pictureRef.current.src = null;
        setVideoSrc(null);
        setFile(null);
      } else {
        setFile(file);
        setFileType(file.type);
        if (file.type?.startsWith("image"))
          pictureRef.current.src = URL.createObjectURL(file);
        else if (file.type?.startsWith("video")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result;
            setVideoSrc(base64Data);
          };
          reader.readAsDataURL(file);
        } else {
          setWarning("Invalid file type, please upload an image or video");
          setFile(null);
          setFileType(null);
          setVideoSrc(null);
          pictureRef.current.src = null;
        }
      }
    }
  };

  // a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleUploadPictureClick = () => {
    hiddenFileInput.current.click();
  };

  const removeFile = (
    <div
      className="remove-picture"
      style={{
        backgroundColor: "rgba(15, 20, 25, 0.75)",
        backdropFilter: "blur(4px)",
        width: "32px",
        height: "32px",
        borderRadius: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "5px",
        right: "5px",
        cursor: "pointer",
        display: fileType?.startsWith("image")
          ? pictureRef.current && file
            ? pictureRef.current.src.split("/").some((element) => {
                return element === "null";
              })
              ? "none"
              : "flex"
            : "none"
          : videoSrc && file
          ? "flex"
          : "none",
      }}
      onClick={() => {
        setFile(null);
        pictureRef.current.src = null;
        setVideoSrc(null);
      }}
    >
      <span style={{ color: "white" }}>X</span>
    </div>
  );

  const pictureDisplay = (
    <img
      className="post-file"
      ref={pictureRef}
      alt="Added"
      style={{
        display:
          fileType?.startsWith("image") && pictureRef.current && file
            ? pictureRef.current.src.split("/").some((element) => {
                return element === "null";
              })
              ? "none"
              : "block"
            : "none",
      }}
    />
  );

  const videoDisplay = (
    <video
      src={videoSrc}
      type="video/mp4"
      controls
      controlsList="nodownload"
      className="post-file"
      style={{
        display:
          fileType?.startsWith("video") && videoSrc && file ? "block" : "none",
      }}
    />
  );

  const addedFileDisplay = (
    <>
      {warning && <div>{warning}</div>}
      {/* ADDED PICTURE DISPLAY */}
      <div style={{ position: "relative", marginBottom: "0.5rem" }}>
        {pictureDisplay}
        {videoDisplay}
        {removeFile}
      </div>
    </>
  );

  const addPictureIcon = (
    <>
      {/* ADD PICTURE/VIDEO */}
      <input
        type="file"
        accept="image/*, video/*"
        onChange={handleFileLoad}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />

      <div
        className="container-y pointer"
        style={{ alignItems: "center", display: file ? "none" : "flex" }}
        onClick={handleUploadPictureClick}
      >
        <img
          src={isDarkMode ? galeryIconDark : galeryIconLight}
          alt="Add"
          style={{
            width: "80px",
            height: "80px",
            marginLeft: ".5rem",

            marginBottom: "1rem",
          }}
        />

        <p style={{ fontSize: "1rem" }}>Click here to choose media to send</p>
      </div>
    </>
  );

  return (
    <div className="container-y full-width">
      {addedFileDisplay}
      <div
        className="container-x"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {file && (
          <button
            id="btn-send"
            className="full-width"
            style={{ margin: "0" }}
            onClick={handleSend}
          >
            {sendButtonDisabled && (
              <span style={{ marginBottom: "5px" }} className="mini-loader" />
            )}
            {!sendButtonDisabled && "Send"}
          </button>
        )}
        {addPictureIcon}
      </div>
    </div>
  );
};

export default SelectMedia;

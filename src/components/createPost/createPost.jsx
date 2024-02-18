import React, { useState, useRef } from "react";
import axios from "axios";
import { postLink } from "../../API";

import galeryIconLight from "../icon/light-mode/create post/galery.png";
import galeryIconDark from "../icon/dark-mode/create post/galery.png";
import Cookies from "js-cookie";

const CreatePost = ({ isDarkMode, handleCatchAxios }) => {
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [video, setVideo] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [warning, setWarning] = useState("");
  const pictureRef = useRef();
  const [videoSrc, setVideoSrc] = useState(null);

  const handleOnChangeDescription = (value) => {
    setDescription(value);
  };

  //UPLOAD POST PICTURE
  const handleFileLoad = (e) => {
    setWarning("");
    if (e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        setWarning("Sorry, max file size is 2mb");
        pictureRef.current.src = null;
        setVideoSrc(null);
        setPicture(null);
        setVideo(null);
      } else {
        if (file.type.startsWith("image/")) {
          setPicture(file);
          setFileType("picture");
          setVideo(null);
          pictureRef.current.src = URL.createObjectURL(file);
        } else if (file.type.startsWith("video/")) {
          setVideo(file);
          setFileType("video");
          setPicture(null);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result;
            setVideoSrc(base64Data);
          };
          reader.readAsDataURL(file);
        } else {
          setWarning("Invalid file type, please upload an image or video");
          setPicture(null);
          setVideo(null);
          pictureRef.current.src = null;
        }
      }
    }
  };

  const handleCreatePost = async (e) => {
    if (picture || video || description) {
      e.preventDefault();
      if (picture?.size > 2 * 1024 * 1024) {
        alert("File size exceeds the maximum allowed size (2MB).");
        setPicture(null);
      } else {
        axios.defaults.maxBodyLength = 2 * 1024 * 1024;
        const formData = new FormData();
        formData.append("token", Cookies.get("token"));
        formData.append("description", description);
        formData.append("fileType", fileType);
        formData.append("file", picture || video || null);

        axios
          .post(postLink.createPost, formData)
          .then((res) => {
            if (res.status === 200)
              window.location.href = `/${Cookies.get("username")}`;
          })
          .catch((err) => {
            handleCatchAxios(err);
          });
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

  const profilePicture = (
    <img
      style={{
        objectFit: "cover",
        height: "43px",
        width: "43px",
        borderRadius: "100%",
        marginRight: "0.5rem",
      }}
      alt="pfp"
      src={JSON.parse(sessionStorage.getItem("picture"))?.url}
    />
  );

  const textArea = (
    <textarea
      type="textarea"
      placeholder="What do you think?"
      style={{
        resize: "vertical",
      }}
      value={description}
      onChange={(e) => handleOnChangeDescription(e.target.value)}
    />
  );

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
        display:
          fileType === "picture"
            ? pictureRef.current && picture
              ? pictureRef.current.src.split("/").some((element) => {
                  return element === "null";
                })
                ? "none"
                : "flex"
              : "none"
            : videoSrc && video
            ? "flex"
            : "none",
      }}
      onClick={() => {
        setPicture(null);
        pictureRef.current.src = null;
        setVideo(null);
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
          pictureRef.current && picture
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
        display: videoSrc && video ? "block" : "none",
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

      <img
        src={isDarkMode ? galeryIconDark : galeryIconLight}
        alt="Add"
        style={{
          width: "25px",
          height: "25px",
          marginLeft: ".5rem",
          cursor: "pointer",
          display: picture ? "none" : "flex",
        }}
        onClick={handleUploadPictureClick}
      />
    </>
  );

  return (
    <div className="container-y full-width">
      <div
        className="container-x"
        style={{ alignItems: "center", marginBottom: "1rem" }}
      >
        {profilePicture}
        {textArea}
      </div>
      {addedFileDisplay}
      <div className="container-x" style={{ alignItems: "center" }}>
        <button
          className="full-width"
          style={{ margin: "0" }}
          onClick={handleCreatePost}
        >
          Share
        </button>
        {addPictureIcon}
      </div>
    </div>
  );
};

export default CreatePost;

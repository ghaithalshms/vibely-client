import React, { useState, useRef } from "react";
import axios from "axios";
import { postLink } from "../../API";
import Cookies from "js-cookie";
import galeryIconLight from "../icon/light-mode/create post/galery.png";
import galeryIconDark from "../icon/dark-mode/create post/galery.png";
import { useNavigate } from "react-router-dom";

const CreatePost = ({
  isDarkMode,
  handleCatchAxios,
  updateUserPostFlow,
  onRequestClose,
}) => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("text/plain");
  const [warning, setWarning] = useState("");
  const pictureRef = useRef();
  const [videoSrc, setVideoSrc] = useState(null);
  const [shareButtonDisabled, setShareButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const handleOnChangeDescription = (value) => {
    setDescription(value);
  };

  const handleFileLoad = (e) => {
    setWarning("");
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 30 * 1024 * 1024) {
      setWarning("Sorry, max file size is 30 MB");
      resetFileState();
    } else {
      setFile(selectedFile);
      setFileType(selectedFile.type);

      if (selectedFile.type?.startsWith("image/")) {
        showImagePreview(selectedFile);
      } else if (selectedFile.type?.startsWith("video/")) {
        showVideoPreview(selectedFile);
      } else {
        setWarning("Invalid file type, please upload an image or video");
        resetFileState();
      }
    }
  };

  const resetFileState = () => {
    setFile(null);
    setVideoSrc(null);
    pictureRef.current.src = null;
  };

  const showImagePreview = (file) => {
    pictureRef.current.src = URL.createObjectURL(file);
  };

  const showVideoPreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async (e) => {
    if (shareButtonDisabled || (!file && !description)) return;

    e.preventDefault();

    if (file && file.size > 30 * 1024 * 1024) {
      alert("File size exceeds the maximum allowed size (30 MB).");
      resetFileState();
      return;
    }

    setShareButtonDisabled(true);
    const formData = new FormData();
    formData.append("token", Cookies.get("token"));
    formData.append("description", description);
    formData.append("fileType", fileType);
    formData.append("file", file);

    try {
      axios.defaults.maxBodyLength = 30 * 1024 * 1024;
      const res = await axios.post(postLink.createPost, formData);
      if (res.status === 200) {
        if (updateUserPostFlow) updateUserPostFlow();
        navigate(`/${Cookies.get("username")}`);
        onRequestClose();
      }
    } catch (err) {
      handleCatchAxios(err);
    }
  };

  const handleUploadPictureClick = () => {
    hiddenFileInput.current.click();
  };

  const hiddenFileInput = useRef(null);

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
      src={`${
        process.env.REACT_APP_API_URL
      }/api/user/data/picture?username=${Cookies.get("username")}`}
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
          (fileType?.startsWith("image/") && pictureRef.current && file) ||
          (fileType?.startsWith("video/") && videoSrc && file)
            ? "flex"
            : "none",
      }}
      onClick={() => {
        setFile(null);
        pictureRef.current.src = null;
        setVideoSrc(null);
        setFileType("text/plain");
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
          fileType?.startsWith("image/") && pictureRef.current && file
            ? "block"
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
          fileType?.startsWith("video/") && videoSrc && file ? "block" : "none",
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
          display: file ? "none" : "flex",
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
          id="btn-share"
          className="full-width"
          style={{ margin: "0" }}
          onClick={handleCreatePost}
        >
          {shareButtonDisabled && (
            <span style={{ marginBottom: "5px" }} className="mini-loader" />
          )}
          {!shareButtonDisabled && "Share"}
        </button>
        {addPictureIcon}
      </div>
    </div>
  );
};

export default CreatePost;

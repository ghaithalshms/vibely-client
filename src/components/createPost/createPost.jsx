import React, { useState, useRef } from "react";
import axios from "axios";
import { postLink } from "../../API";

import galeryIconLight from "../icon/light-mode/create post/galery.png";
import galeryIconDark from "../icon/dark-mode/create post/galery.png";
import Cookies from "js-cookie";

const CreatePost = ({ isDarkMode, handleCatchAxios }) => {
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [pictureWarning, setPictureWarning] = useState("");
  const pictureRef = useRef();

  const handleOnChangeDescription = (value) => {
    setDescription(value);
  };

  //UPLOAD POST PICTURE
  const handlePictureLoad = (e) => {
    setPictureWarning("");
    if (e.target.files[0]) {
      if (e.target.files[0]?.size > 2 * 1024 * 1024) {
        setPictureWarning("Sorry, max file size is 2mb");
        pictureRef.current.src = null;
        setPicture(null);
      } else {
        setPicture(e.target.files[0]);
        pictureRef.current.src = URL.createObjectURL(e.target.files[0]);
      }
    }
  };

  const handleCreatePost = async (e) => {
    if (picture || description) {
      e.preventDefault();
      if (picture?.size > 2 * 1024 * 1024) {
        alert("File size exceeds the maximum allowed size (2MB).");
        setPicture(null);
      } else {
        axios.defaults.maxBodyLength = 2 * 1024 * 1024;
        const formData = new FormData();
        formData.append("token", Cookies.get("token"));
        formData.append("description", description);
        formData.append("file", picture ?? null);

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
      src={JSON.parse(sessionStorage.getItem("picture"))?.url}
    />
  );

  const textArea = (
    <textarea
      type="textarea"
      placeholder="What do you think?"
      style={{
        width: "100%",
        minHeight: "40px",
        height: "40px",
        overflow: "hidden",
        resize: "vertical",
      }}
      value={description}
      onChange={(e) => handleOnChangeDescription(e.target.value)}
    />
  );

  const addedPictureDisplay = (
    <>
      {pictureWarning && <div>{pictureWarning}</div>}
      {/* ADDED PICTURE DISPLAY */}
      <div style={{ position: "relative", marginBottom: "0.5rem" }}>
        <img
          className="post-picture"
          ref={pictureRef}
          alt="Added"
          style={{
            borderRadius: "3%",
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
              pictureRef.current && picture
                ? pictureRef.current.src.split("/").some((element) => {
                    return element === "null";
                  })
                  ? "none"
                  : "flex"
                : "none",
          }}
          onClick={() => {
            setPicture(null);
            pictureRef.current.src = null;
          }}
        >
          <span style={{ color: "white" }}>X</span>
        </div>
      </div>
    </>
  );

  const addPictureIcon = (
    <>
      {/* ADD PICTURE */}
      <input
        type="file"
        accept="image/*"
        onChange={handlePictureLoad}
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
        style={{ alignItems: "center", marginBottom: "0.3rem" }}
      >
        {profilePicture}
        {textArea}
      </div>
      {addedPictureDisplay}
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

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getLink, updateLink } from "../../API";
import Cookies from "js-cookie";
import "./editProfileCss.css";
import Navbar from "../navbar/navbar";
import CheckboxStyled from "../navbar/checkboxStyled";
import defaultPfp from "../icon/default profile picture.jpg";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ isDarkMode, handleCatchAxios }) => {
  const navigate = useNavigate();

  const userSigned = Cookies.get("username");
  const [isLoading, setIsLoading] = useState(true);

  const [userData, setUserData] = useState();

  const [isPictureLoaded, setPictureLoaded] = useState(false);

  const [username, setUsername] = useState("");
  const [picture, setPicture] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [biography, setBiography] = useState("");
  const [link, setLink] = useState("");
  const [privacity, setPrivacity] = useState(true);

  let isUserDataGot = false;

  const handleUpdateProfileData = async () => {
    await axios
      .post(updateLink.updateProfileData, {
        token: Cookies.get("token"),
        username,
        firstName,
        lastName,
        biography,
        link,
        privacity,
      })
      .catch((err) => handleCatchAxios(err));
  };

  const handleUpdateProfilePicture = async () => {
    if (picture?.size > 2 * 1024 * 1024) {
      alert("File size exceeds the maximum allowed size (2MB).");
      setPicture(null);
      pictureRef.current.src = null;
    } else {
      axios.defaults.maxBodyLength = 2 * 1024 * 1024;
      const formData = new FormData();
      formData.append("token", Cookies.get("token"));
      formData.append("file", picture || null);

      await axios
        .post(updateLink.updateProfilePicture, formData)
        .catch((err) => handleCatchAxios(err));
    }
  };

  const handleUpdate = async () => {
    if (isPictureLoaded) await handleUpdateProfilePicture();
    await handleUpdateProfileData();
    if (userData.username !== username || pictureRef?.current?.src) {
      Cookies.set("username", username);
      window.location.href = "/";
    }
    navigate("/");
  };

  const handleGetUserData = async (username) => {
    setIsLoading(true);
    await axios
      .get(getLink.getUserData, {
        params: {
          username: userSigned,
          userSigned,
        },
      })
      .then((res) => {
        setUserData(res.data);
        setUsername(res.data.username);
        setPicture(res.data.picture);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setBiography(res.data.biography);
        setLink(res.data.link);
        setPrivacity(res.data.privacity);
      })
      .catch((err) => handleCatchAxios(err));
    setIsLoading(false);
    isUserDataGot = true;
  };

  useEffect(() => {
    // GET USER DATA ON LOAD
    if (!isUserDataGot)
      handleGetUserData(
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ]
      );
    // eslint-disable-next-line
  }, []);

  const [warning, setWarning] = useState("");
  const pictureRef = useRef();
  // a reference to the hidden file input element
  const hiddenFileInput = useRef(null);
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleUploadPictureClick = () => {
    hiddenFileInput.current.click();
  };

  //UPLOAD POST PICTURE
  const handleFileLoad = (e) => {
    setWarning("");
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setWarning("Sorry, max file size is 2mb");
        pictureRef.current.src = null;
        setPicture(null);
        setPictureLoaded(false);
      } else if (file.type.startsWith("image/")) {
        setPictureLoaded(true);
        setPicture(file);
        pictureRef.current.src = URL.createObjectURL(file);
      } else {
        setPictureLoaded(false);
        setWarning("Invalid file type, please upload an image");
        setPicture(null);
        pictureRef.current.src = null;
      }
    }
  };

  const removeFile = (
    <div
      className="remove-picture"
      style={{
        display: "flex",
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
      }}
      onClick={() => {
        setPicture(null);
        pictureRef.current.src = null;
      }}
    >
      <span style={{ color: "white" }}>X</span>
    </div>
  );

  const handlePfp = (picture) => {
    if (picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
    else return defaultPfp;
  };

  const pictureDisplay = (
    <img
      className="profile-picture"
      style={{ width: "130px", height: "130px" }}
      ref={pictureRef}
      src={
        handlePfp(picture) !== "data:image/png;base64,"
          ? handlePfp(picture)
          : pictureRef?.current?.src
      }
      alt="pfp"
      onClick={handleUploadPictureClick}
    />
  );

  const pictureElement = (
    <div style={{ marginBottom: "1rem" }}>
      {/* ADD PICTURE */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileLoad}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />
      {warning && <div>{warning}</div>}
      {/* ADDED PICTURE DISPLAY */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", height: "135px", width: "135px" }}>
          {pictureDisplay}
          {removeFile}
        </div>
      </div>
    </div>
  );

  const usernameElement = (
    <>
      <div
        className="container-x"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <span>Username:</span>
        <textarea
          type="textarea"
          placeholder="Username"
          style={{
            height: "32px",
            width: "65%",
            overflow: "hidden",
            padding: "6px 10px",
            resize: "none",
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
    </>
  );
  const firstNameElement = (
    <>
      <div
        className="container-x"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <span>First Name:</span>
        <textarea
          type="textarea"
          placeholder="First Name"
          style={{
            height: "32px",
            width: "65%",
            overflow: "hidden",
            padding: "6px 10px",
            resize: "none",
          }}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
    </>
  );

  const lastNameElement = (
    <>
      <div
        className="container-x"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <span>Last Name:</span>
        <textarea
          type="textarea"
          placeholder="Last Name"
          style={{
            height: "32px",
            width: "65%",
            overflow: "hidden",
            padding: "6px 10px",
            resize: "none",
          }}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
    </>
  );

  const biographyElement = (
    <>
      <div
        className="container-x"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <span>Biography:</span>
        <textarea
          type="textarea"
          placeholder="Biography"
          style={{
            height: "32px",
            width: "65%",
            overflow: "hidden",
            padding: "6px 10px",
            minHeight: "32px",
            resize: "vertical",
          }}
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
        />
      </div>
    </>
  );

  const linkElement = (
    <>
      <div
        className="container-x"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <span>Web site:</span>
        <textarea
          type="textarea"
          placeholder="Link"
          style={{
            height: "32px",
            width: "65%",
            overflow: "hidden",
            padding: "6px 10px",
            minHeight: "32px",
            resize: "none",
          }}
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
    </>
  );

  const privacityElement = (
    <>
      <div
        className="container-x"
        style={{ alignItems: "center", marginTop: "5px" }}
      >
        <span style={{ marginRight: "1rem" }}>Private account:</span>
        <CheckboxStyled
          isDarkMode={isDarkMode}
          isCheckedParam={privacity}
          isCheckedClick={() => {
            setPrivacity(false);
          }}
          isNotCheckedClick={() => {
            setPrivacity(true);
          }}
        />
      </div>
    </>
  );

  return (
    <div className="container-y  main-container">
      <Navbar
        isDarkMode={isDarkMode}
        visitUser={handleGetUserData}
        handleCatchAxios={handleCatchAxios}
      />
      {isLoading && (
        <div className="loader-container">
          <span className="loader" />
        </div>
      )}
      {!isLoading && username && (
        <div
          className="full-width"
          style={{
            maxWidth: "400px",
            marginRight: "auto",
            marginLeft: "auto",
            paddingTop: "1rem",
          }}
        >
          {pictureElement}
          {usernameElement}
          {firstNameElement}
          {lastNameElement}
          {biographyElement}
          {linkElement}
          {privacityElement}
          <button className="full-width" onClick={handleUpdate}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};
export default EditProfile;

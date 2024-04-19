import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getLink, updateLink } from "../../API";
import Cookies from "js-cookie";
import Navbar from "../navbar/navbar";
import CheckboxStyled from "../navbar/checkboxStyled";
import defaultPfp from "../icon/default profile picture.jpg";

const EditProfile = ({ isDarkMode, handleCatchAxios, setErrorCode }) => {
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [warning, setWarning] = useState("");
  const pictureRef = useRef();
  const hiddenFileInput = useRef(null);

  const [username, setUsername] = useState("");
  const [picture, setPicture] = useState(null);
  const [fileType, setFileType] = useState(null); // Added fileType state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [biography, setBiography] = useState("");
  const [link, setLink] = useState("");
  const [privacity, setPrivacity] = useState(true);

  useEffect(() => {
    handleGetUserData(); // eslint-disable-next-line
  }, []);

  const handleGetUserData = async () => {
    const userSigned = Cookies.get("username");
    setIsLoading(true);
    try {
      const response = await axios.get(getLink.getUserData, {
        params: { username: userSigned, token: Cookies.get("token") },
      });
      setUserData(response.data);
      setFormValues(response.data);
    } catch (error) {
      handleCatchAxios(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setFormValues = (data) => {
    setUsername(data.username);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setBiography(data.biography);
    setLink(data.link);
    setPrivacity(data.privacity);
  };

  const handleUpdate = async () => {
    await handleUpdateProfileData();
    localStorage.removeItem(`pfp_${Cookies.get("username")}`);
    if (userData.username !== username) {
      Cookies.set("username", username, { expires: 1000 });
    }
    setErrorCode(0);
    window.location.href = `/${username}`;
    // navigate("/");
  };

  const handleUpdateProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("token", Cookies.get("token"));
      formData.append("username", username);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("biography", biography);
      formData.append("link", link);
      formData.append("privacity", privacity);
      formData.append("file", picture);
      formData.append("fileType", fileType);

      await axios.post(updateLink.updateProfileData, formData);
    } catch (error) {
      handleCatchAxios(error);
    }
  };

  const handleUploadPictureClick = () => {
    hiddenFileInput.current.click();
  };

  const handleFileLoad = (e) => {
    setWarning("");
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setWarning("Sorry, max file size is 10 mb");
      resetPicture();
    } else if (file.type.startsWith("image/")) {
      setPicture(file);
      setFileType(file.type); // Set fileType when picture is selected
      pictureRef.current.src = URL.createObjectURL(file);
    } else {
      setWarning("Invalid file type, please upload an image");
      resetPicture();
    }
  };

  const resetPicture = () => {
    setPicture(null);
    setFileType(null);
    pictureRef.current.src = defaultPfp;
  };

  const pictureElement = (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileLoad}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />
      {warning && <div>{warning}</div>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", height: "135px", width: "135px" }}>
          <img
            className="edit-profile-picture"
            style={{ borderRadius: "100%", width: "130px", height: "130px" }}
            ref={pictureRef}
            src={
              pfpLoaded
                ? `${process.env.REACT_APP_API_URL}/api/user/data/picture?username=${userData.username}`
                : defaultPfp
            }
            onLoad={() => setPfpLoaded(true)}
            onError={() => setPfpLoaded(true)}
            alt="Pfp"
            onClick={handleUploadPictureClick}
          />
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
              setFileType("image/png");
              pictureRef.current.src = defaultPfp;
            }}
          >
            <span style={{ color: "white" }}>X</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInput = (label, value, onChange) => (
    <div
      className="container-x"
      style={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <span>{label}</span>
      <textarea
        type="textarea"
        placeholder={label}
        style={{
          height: "32px",
          width: "65%",
          overflow: "hidden",
          padding: "6px 10px",
          resize: "none",
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  );

  const usernameElement = renderInput("Username:", username, (e) =>
    setUsername(e.target.value)
  );
  const firstNameElement = renderInput("First Name:", firstName, (e) =>
    setFirstName(e.target.value)
  );
  const lastNameElement = renderInput("Last Name:", lastName, (e) =>
    setLastName(e.target.value)
  );
  const biographyElement = renderInput("Biography:", biography, (e) =>
    setBiography(e.target.value)
  );
  const linkElement = renderInput("Web site:", link, (e) =>
    setLink(e.target.value)
  );

  const privacityElement = (
    <div
      className="container-x"
      style={{ alignItems: "center", marginTop: "5px" }}
    >
      <span style={{ marginRight: "1rem" }}>Private account:</span>
      <CheckboxStyled
        isDarkMode={isDarkMode}
        isCheckedParam={privacity}
        isCheckedClick={() => setPrivacity(!privacity)}
        isNotCheckedClick={() => setPrivacity(!privacity)}
      />
    </div>
  );

  return (
    <div className="container-y  main-container">
      <Navbar
        isDarkMode={isDarkMode}
        visitUser={handleGetUserData}
        handleCatchAxios={handleCatchAxios}
        setErrorCode={setErrorCode}
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

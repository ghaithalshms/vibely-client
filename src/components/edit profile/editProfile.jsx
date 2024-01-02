import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLink } from "../../API";
import Cookies from "js-cookie";
import "./editProfileCss.css";
import Navbar from "../navbar/navbar";

const EditProfile = ({ isDarkMode, handleCatchAxios }) => {
  const userSigned = Cookies.get("username");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let isUserDataGot = false;

  const handleGetUserData = async (username) => {
    setIsLoading(true);
    await axios
      .get(getLink.getUserData, {
        params: {
          username: userSigned,
          userSigned,
        },
      })
      .then((res) => setUserData(res.data))
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
      {!isLoading && userData && (
        <div className="container-y edit-profile-elements-container"></div>
      )}
    </div>
  );
};

export default EditProfile;

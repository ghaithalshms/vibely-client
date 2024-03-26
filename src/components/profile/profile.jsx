import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLink } from "../../API";
import Cookies from "js-cookie";
import "./profile.css";
import DataContainer from "./dataContainer";
import UserPostFlow from "../postFlow/userPostFlow";
import Navbar from "../navbar/navbar";

const Profile = ({
  isDarkMode,
  scrollingPercentage,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUsernameFromUrl = () => {
    const urlParts = window.location.href.split("/");
    return urlParts[urlParts.length - 1].split("?")[0];
  };

  const handleGetUserData = async (username) => {
    setIsLoading(true);
    try {
      const response = await axios.get(getLink.getUserData, {
        params: {
          username,
          token: Cookies.get("token"),
        },
      });
      setUserData(response.data);
    } catch (error) {
      handleCatchAxios(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const username = getUsernameFromUrl();
    handleGetUserData(username);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container-y main-container">
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
      {!isLoading && userData?.username && (
        <>
          <DataContainer
            isDarkMode={isDarkMode}
            userData={userData}
            visitUser={handleGetUserData}
            setUserData={setUserData}
            handleCatchAxios={handleCatchAxios}
            setErrorCode={setErrorCode}
          />
          <UserPostFlow
            isDarkMode={isDarkMode}
            userData={userData}
            visitUser={handleGetUserData}
            handleCatchAxios={handleCatchAxios}
            scrollingPercentage={scrollingPercentage}
            setErrorCode={setErrorCode}
          />
        </>
      )}
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLink } from "../../API";
import Cookies from "js-cookie";
import "./profile.css";
import DataContainer from "./dataContainer";
import UserPostFlow from "../postFlow/userPostFlow";
import Navbar from "../navbar/navbar";
import LoginToSeeFeatures from "./loginToSeeFeatures";

const Profile = ({
  isDarkMode,
  scrollingPercentage,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPostFlowArray, setUserPostFlowArray] = useState([]);
  const [lastGotPostID, setLastGotPostID] = useState(0);
  const [isPostFlowLoading, setIsPostFlowLoading] = useState(true);

  const getUsernameFromUrl = () => {
    const urlParts = window.location.href.split("/");
    return urlParts[urlParts.length - 1].split("?")[0];
  };

  const handleGetUserData = async (username, token) => {
    isPostFlowGot = false;
    setUserPostFlowArray([]);
    setIsLoading(true);
    try {
      const response = await axios.get(getLink.getUserData, {
        params: {
          username,
          token,
        },
      });
      setUserData(response.data);
      return response.data;
    } catch (error) {
      handleCatchAxios(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUserPostFlow = async (
    isOnScrolling,
    username,
    _lastGotPostID
  ) => {
    isPostFlowFetching = true;

    if (!isOnScrolling) setIsPostFlowLoading(true);
    await axios
      .get(getLink.getUserPostFlow, {
        params: {
          username,
          token: Cookies.get("token"),
          lastGotPostID: _lastGotPostID ?? lastGotPostID,
        },
      })
      .then((response) => {
        if (
          response?.data !== "private account" &&
          response.data?.lastGotPostID !== lastGotPostID
        ) {
          setLastGotPostID(response.data?.lastGotPostID);
          if (!isOnScrolling)
            setUserPostFlowArray(response.data?.postFlowArray);
          else
            setUserPostFlowArray([
              ...userPostFlowArray,
              ...response.data?.postFlowArray,
            ]);
        }
      })
      .catch((error) => handleCatchAxios(error));

    setIsPostFlowLoading(false);
    isPostFlowGot = true;
    isPostFlowFetching = false;
  };

  let isPostFlowGot = false;

  const handleVisitUser = async (username) => {
    isPostFlowGot = false;
    const token = Cookies.get("token") || "";
    const signedUsername = Cookies.get("username") || "";

    handleGetUserData(username, token).then((userData) => {
      if (
        !isPostFlowGot &&
        (userData.username === signedUsername ||
          userData.isFollowing ||
          !userData.privacity)
      ) {
        handleGetUserPostFlow(false, username, 0);
      } else {
        setIsPostFlowLoading(false);
      }
    });
  };

  useEffect(() => {
    handleVisitUser(getUsernameFromUrl());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let isPostFlowFetching = false;

  useEffect(() => {
    if (!isPostFlowFetching)
      if (
        scrollingPercentage > 70 &&
        userData?.postCount > userPostFlowArray?.length
      ) {
        handleGetUserPostFlow(true, userData.username, lastGotPostID);
      } // eslint-disable-next-line
  }, [scrollingPercentage]);

  return (
    <div className="container-y main-container">
      {Cookies.get("token") && (
        <Navbar
          isDarkMode={isDarkMode}
          visitUser={handleVisitUser}
          handleCatchAxios={handleCatchAxios}
          setErrorCode={setErrorCode}
          updateUserPostFlow={() =>
            handleGetUserPostFlow(false, userData.username, 0)
          }
        />
      )}
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
            visitUser={handleVisitUser}
            setUserData={setUserData}
            handleCatchAxios={handleCatchAxios}
            setErrorCode={setErrorCode}
            setUserPostFlowArray={setUserPostFlowArray}
          />
          <UserPostFlow
            isDarkMode={isDarkMode}
            userData={userData}
            visitUser={handleVisitUser}
            handleCatchAxios={handleCatchAxios}
            scrollingPercentage={scrollingPercentage}
            setErrorCode={setErrorCode}
            isPostFlowLoading={isPostFlowLoading}
            userPostFlowArray={userPostFlowArray}
            setUserPostFlowArray={setUserPostFlowArray}
          />
        </>
      )}
      {!Cookies.get("token") && userData && (
        <LoginToSeeFeatures isDarkMode={isDarkMode} userData={userData} />
      )}
    </div>
  );
};

export default Profile;

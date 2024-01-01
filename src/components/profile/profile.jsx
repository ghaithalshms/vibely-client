import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLink } from "../../API";
import Cookies from "js-cookie";
import DialogModal from "../dialogModal/dialogModal";
import "./profile.css";
import DataContainer from "./dataContainer";
import UserPostFlow from "../postfFow/userPostFlow";
import Navbar from "../navbar/navbar";

const Profile = ({ isDarkMode, scrollingPercentage }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogModalHeader, setDialogModalHeader] = useState("");
  const [dialogModalBody, setDialogModalBody] = useState("");

  const userSigned = Cookies.get("username");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let isUserDataGot = false;

  const handleGetUserData = async (username) => {
    setIsLoading(true);
    await axios
      .get(getLink.getUserData, {
        params: {
          username,
          userSigned,
        },
      })
      .then((res) => setUserData(res.data))
      .catch((err) => handleCatchAxios(err));
    setIsLoading(false);
    isUserDataGot = true;
  };

  const handleCatchAxios = (err) => {
    setDialogOpen(true);
    setDialogModalHeader("Ooups");
    if (err?.code === "ERR_NETWORK")
      setDialogModalBody(
        `Sorry, a problem happened while connecting to the server`
      );
    else
      setDialogModalBody(`Sorry, an error happened: ${err?.response?.status}`);
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
      {!isLoading && userData?.username && (
        <>
          <DataContainer
            isDarkMode={isDarkMode}
            userData={userData}
            visitUser={handleGetUserData}
            setUserData={setUserData}
            handleCatchAxios={handleCatchAxios}
          />
          <UserPostFlow
            isDarkMode={isDarkMode}
            userData={userData}
            visitUser={handleGetUserData}
            handleCatchAxios={handleCatchAxios}
            scrollingPercentage={scrollingPercentage}
          />
        </>
      )}
      {isDialogOpen && (
        <DialogModal
          isDarkMode={isDarkMode}
          isOpen={isDialogOpen}
          header={dialogModalHeader}
          body={dialogModalBody}
          onNo={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;

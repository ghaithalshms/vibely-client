import React, { useState, useEffect } from "react";
import axios from "axios";
import { getLink } from "../../API";
import Cookies from "js-cookie";
import YesNoDialog from "../yesNoDialog/yesNoDialog";
import "./profile.css";
import DataContainer from "./dataContainer";

const Profile = ({ isDarkMode }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalBody, setModalBody] = useState("");

  const userSigned = Cookies.get("username");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetUserData = async () => {
    await axios
      .get(getLink.getUserData, {
        params: {
          username:
            window.location.href.split("/")[
              window.location.href.split("/").length - 1
            ],
          userSigned,
        },
      })
      .then((res) => setUserData(res.data))
      .catch((err) => {
        setDialogOpen(true);
        setModalHeader("Ooups");
        setModalBody(`Sorry, an error happened: ${err?.response?.code}`);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetUserData();

    // eslint-disable-next-line
  }, []);

  if (isLoading)
    return (
      <div className="loader-container">
        <span className="loader" />
      </div>
    );
  return (
    <div className="container-y profile-container">
      <DataContainer
        userData={userData}
        isDarkMode={isDarkMode}
        setUserData={setUserData}
      />
      <YesNoDialog
        isDarkMode={isDarkMode}
        isOpen={isDialogOpen}
        header={modalHeader}
        body={modalBody}
        onNo={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default Profile;

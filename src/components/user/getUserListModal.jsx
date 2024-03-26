import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../../modal.css";
import { getLink } from "../../API";
import axios from "axios";
import UserComponent from "./userComponent";
import Cookies from "js-cookie";

Modal.setAppElement("#root");

const GetUserListModal = ({
  isDarkMode,
  isOpen,
  onRequestClose,
  header,
  type,
  username,
  postID,
  visitUser,
  setChatUser,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getUserListLink = () => {
    switch (type) {
      case "Followers":
        return getLink.getUserFollowers;
      case "Following":
      case "Inbox":
        return getLink.getUserFollowing;
      case "Liked Users":
        return getLink.getPostLikedUsers;
      default:
        return null;
    }
  };

  const getDataParams = () => {
    return type === "Liked Users"
      ? { postID, token: Cookies.get("token") }
      : { username, token: Cookies.get("token") };
  };

  const handleGetUserList = async () => {
    const reqLink = getUserListLink();
    if (!reqLink) return;

    try {
      const res = await axios.get(reqLink, { params: getDataParams() });
      setUserList(res?.data);
    } catch (err) {
      handleCatchAxios(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetUserList();
    // eslint-disable-next-line
  }, [type]);

  const renderLoader = () => (
    <div
      className="full-width"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <span className="loader" />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setUserList([]);
        setLoading(true);
        onRequestClose();
      }}
      contentLabel="User List"
      className="modal-container"
      ariaHideApp={false}
      style={{
        overlay: {
          zIndex: 100,
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: "fadeIn 0.3s",
        },
        content: {
          position: "static",
          width: "400px",
          maxWidth: "95vw",
          height: "auto",
          maxHeight: "60svh",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "#202020" : "white",
          borderColor: isDarkMode ? "black" : "white",
          animation: "fadeIn 0.3s",
        },
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>{header}</h2>
      <div>
        {isLoading && renderLoader()}
        {userList?.map((user, index) => (
          <UserComponent
            key={index}
            user={user}
            setChatUser={setChatUser}
            visitUser={visitUser}
            followBtn={type !== "Inbox"}
            handleCatchAxios={handleCatchAxios}
            setErrorCode={setErrorCode}
          />
        ))}
      </div>
    </Modal>
  );
};

export default GetUserListModal;

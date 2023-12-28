import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../../modal.css";
import { getLink } from "../../API";
import axios from "axios";
import UserComponent from "./userComponent";

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
}) => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const handleGetUserList = async () => {
    let reqLink;
    switch (type) {
      case "Followers":
        reqLink = getLink.getUserFollowers;
        break;
      case "Following":
        reqLink = getLink.getUserFollowing;
        break;
      default:
        return;
    }
    await axios
      .get(reqLink, {
        params: {
          username,
        },
      })
      .then((res) => setUserList(res.data));
    setLoading(false);
  };

  useEffect(() => {
    handleGetUserList();
    // eslint-disable-next-line
  }, [type]);

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
          backgroundColor: isDarkMode
            ? "rgba(255, 255, 255, 0.25)"
            : "rgba(0, 0, 0, 0.25)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: "fadeIn 0.3s",
        },
        content: {
          position: "static",
          width: "300px",
          height: "auto",
          maxHeight: "60svh",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "black" : "white",
          borderColor: isDarkMode ? "black" : "white",
          animation: "fadeIn 0.3s",
        },
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>{header}</h2>
      <div>
        {isLoading && (
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
        )}
        {userList.map((user, index) => (
          <UserComponent key={index} user={user} visitUser={visitUser} />
        ))}
      </div>
    </Modal>
  );
};

export default GetUserListModal;

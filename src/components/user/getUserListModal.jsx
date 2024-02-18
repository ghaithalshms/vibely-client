import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../../modal.css";
import { getLink } from "../../API";
import axios from "axios";
import UserComponent from "./userComponent";
import { updateUserListArrayPfp } from "../../usersPfp";

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
      case "Liked Users":
        reqLink = getLink.getPostLikedUsers;
        break;
      default:
        return;
    }
    const data = {
      params:
        type === "Liked Users"
          ? {
              postID,
            }
          : {
              username,
            },
    };
    await axios
      .get(reqLink, data)
      .then((res) => {
        setUserList(res?.data);
        for (const user of res.data) {
          const username = user.username;
          updateUserListArrayPfp(username, setUserList);
        }
      })
      .catch((err) => {
        handleCatchAxios(err);
      });
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
          width: "400px",
          maxWidth: "95vw",
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
        {userList?.map((user, index) => (
          <UserComponent
            key={index}
            user={user}
            setChatUser={setChatUser}
            visitUser={visitUser}
          />
        ))}
      </div>
    </Modal>
  );
};

export default GetUserListModal;

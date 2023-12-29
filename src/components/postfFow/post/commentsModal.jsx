import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../../../modal.css";
import { getLink } from "../../../API";
import axios from "axios";
import CommentComponent from "./commentComponent";
import Cookies from "js-cookie";

Modal.setAppElement("#root");

const CommentsModal = ({
  isDarkMode,
  isOpen,
  onRequestClose,
  header,
  postID,
}) => {
  const [comments, setComments] = useState();
  const [isLoading, setLoading] = useState(true);

  const handleGetComments = async () => {
    await axios
      .get(getLink.getPostComments, {
        params: {
          postID,
          token: Cookies.get("token"),
        },
      })
      .then((res) => setComments(res.data));
    setLoading(false);
  };

  useEffect(() => {
    handleGetComments();
    console.log(comments);
    // eslint-disable-next-line
  }, []);

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
          <CommentComponent key={index} user={user} visitUser={visitUser} />
        ))}
      </div>
    </Modal>
  );
};

export default CommentsModal;

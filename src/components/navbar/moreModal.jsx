import React from "react";
import Modal from "react-modal";
import "../../modal.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { deleteLink } from "../../API";

Modal.setAppElement("#root");

const MoreModal = ({ isDarkMode, isOpen, onRequestClose, setErrorCode }) => {
  const navigate = useNavigate();

  const unsubscribeWebPush = async () => {
    await axios.post(deleteLink.unsubscribeWebPush, {
      token: Cookies.get("token"),
      browserID: Cookies.get("browser-id"),
    });
  };

  const removeAllCookies = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieKey = cookie.split("=")[0].trim();
      Cookies.remove(cookieKey);
    });
  };

  const handleNavigation = (path) => {
    if (window.location.href.split("/").slice(-2, -1)[0] !== "activities") {
      setErrorCode(0);
      navigate(`/activities/${path}`);
    } else {
      window.location.href = `/activities/${path}`;
    }
  };

  const handleSignOut = async () => {
    await unsubscribeWebPush();
    removeAllCookies();
    window.location.href = "/login";
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="More Modal"
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
          width: "300px",
          height: "auto",
          maxHeight: "99svh",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "#202020" : "white",
          borderColor: isDarkMode ? "black" : "white",
          animation: "fadeIn 0.3s",
        },
      }}
    >
      <div className="container-y full-width">
        <h2 className="uppercase">{"More"}</h2>
        <br />
        <h3 className="uppercase">Activities</h3>
        <button onClick={() => handleNavigation("liked")}>Liked posts</button>
        <button onClick={() => handleNavigation("saved")}>Saved posts</button>
        <button onClick={() => handleNavigation("archived")}>
          Archived posts
        </button>
        <br />
        <h3 className="uppercase">Account</h3>
        <button onClick={() => navigate("/account/edit-profile")}>
          Edit your profile
        </button>
        <button> Change your password</button>
        <button>Change your e-mail</button>
        <br />
        <h3 className="uppercase">Settings</h3>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </Modal>
  );
};

export default MoreModal;

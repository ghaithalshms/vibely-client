import React from "react";
import Modal from "react-modal";
import "../../modal.css";
// import CheckboxStyled from "./checkboxStyled";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { deleteLink } from "../../API";

Modal.setAppElement("#root");

const MoreModal = ({ isDarkMode, isOpen, onRequestClose }) => {
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Yes/No Dialog"
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
        <button
          onClick={() => {
            if (
              window.location.href.split("/")[
                window.location.href.split("/").length - 2
              ] !== "activities"
            )
              navigate("/activities/liked");
            else window.location.href = "/activities/liked";
          }}
        >
          Liked posts
        </button>
        <button
          onClick={() => {
            if (
              window.location.href.split("/")[
                window.location.href.split("/").length - 2
              ] !== "activities"
            )
              navigate("/activities/saved");
            else window.location.href = "/activities/saved";
          }}
        >
          Saved posts
        </button>
        <button
          onClick={() => {
            if (
              window.location.href.split("/")[
                window.location.href.split("/").length - 2
              ] !== "activities"
            )
              navigate("/activities/archived");
            else window.location.href = "/activities/archived";
          }}
        >
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
        <button
          onClick={async () => {
            await unsubscribeWebPush();
            removeAllCookies();
            window.location.href = "/login";
          }}
        >
          Sign out
        </button>
        {/* <button style={{ display: "flex", justifyContent: "center" }}>
          Dark mode
          <CheckboxStyled
            isCheckedParam={isDarkMode}
            isDarkMode={isDarkMode}
            isCheckedClick={() => {
              Cookies.remove("dark-mode");
              document.body.classList.remove("dark-mode");

              const metaThemeColor = document.querySelector(
                'meta[name="theme-color"]'
              );
              if (metaThemeColor) metaThemeColor.content = "#f874bb";
              const metaColorScheme = document.querySelector(
                'meta[name="color-scheme"]'
              );
              if (metaColorScheme) metaColorScheme.content = "light";
            }}
            isNotCheckedClick={() => {
              Cookies.set("dark-mode", true, { expires: 1000 });
              document.body.classList.add("dark-mode");

              const metaThemeColor = document.querySelector(
                'meta[name="theme-color"]'
              );
              if (metaThemeColor) metaThemeColor.content = "#68053a";
              const metaColorScheme = document.querySelector(
                'meta[name="color-scheme"]'
              );
              if (metaColorScheme) metaColorScheme.content = "dark";
            }}
          /> 
        </button> */}
      </div>
    </Modal>
  );
};

export default MoreModal;

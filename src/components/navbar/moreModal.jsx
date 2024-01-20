import React from "react";
import Modal from "react-modal";
import "../../modal.css";
// import CheckboxStyled from "./checkboxStyled";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const MoreModal = ({ isDarkMode, isOpen, onRequestClose }) => {
  const navigate = useNavigate();
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
          maxHeight: "99svh",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "black" : "white",
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
          onClick={() => {
            Cookies.remove("token");
            Cookies.remove("username");
            sessionStorage.removeItem("picture");
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

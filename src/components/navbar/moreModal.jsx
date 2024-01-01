import React from "react";
import Modal from "react-modal";
import "../../modal.css";
import CheckboxStyled from "./checkboxStyled";
import Cookies from "js-cookie";
import darkModeLight from "../icon/light-mode/navbar/dark theme.png";
import darkModeDark from "../icon/dark-mode/navbar/dark theme.png";

Modal.setAppElement("#root");

const MoreModal = ({ isDarkMode, isOpen, onRequestClose }) => {
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
        <h2>{"More"}</h2>
        <br />
        <h3>Activities</h3>
        <button>Liked posts</button>
        <button> Saved posts</button>
        <button>Archived posts</button>
        <br />
        <h3>Account</h3>
        <button>Edit your profile</button>
        <button> Change your password</button>
        <button>Change your e-mail</button>
        <br />
        <h3>Settings</h3>
        <button
          onClick={() => {
            Cookies.remove("dark-mode");
            Cookies.remove("token");
            Cookies.remove("username");
            sessionStorage.removeItem("picture");
            window.location.href = "/login";
          }}
        >
          Sign out
        </button>
        <button style={{ display: "flex", justifyContent: "center" }}>
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
              Cookies.set("dark-mode", true);
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
        </button>
      </div>
    </Modal>
  );
};

export default MoreModal;

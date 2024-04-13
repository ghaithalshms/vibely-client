import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import MoreModal from "./moreModal";
import CreatePostModal from "../createPost/createPostModal";
import NotificationModal from "../notification/notificationModal";

import appIcon from "../icon/icon.png";
import appTextLight from "../icon/light-mode/vibely-text-light.png";
import appTextDark from "../icon/dark-mode/vibely-text-dark.png";
// ICONS LIGHT MODE
import home0Light from "../icon/light-mode/navbar/home 0.png";
import home1Light from "../icon/light-mode/navbar/home 1.png";
import search0Light from "../icon/light-mode/navbar/search 0.png";
import search1Light from "../icon/light-mode/navbar/search 1.png";
import inbox0Light from "../icon/light-mode/navbar/inbox 0.png";
import inbox1Light from "../icon/light-mode/navbar/inbox 1.png";
import createLight from "../icon/light-mode/navbar/create.png";
import explorer0Light from "../icon/light-mode/navbar/explore 0.png";
import explorer1Light from "../icon/light-mode/navbar/explore 1.png";
import profile0Light from "../icon/light-mode/navbar/profile 0.png";
import profile1Light from "../icon/light-mode/navbar/profile 1.png";
import notification0Light from "../icon/light-mode/navbar/notifications 0.png";
import notification1Light from "../icon/light-mode/navbar/notifications 1.png";
import optionsLight from "../icon/light-mode/navbar/options.png";

// ICONS DARK MODE
import home0Dark from "../icon/dark-mode/navbar/home 0.png";
import home1Dark from "../icon/dark-mode/navbar/home 1.png";
import search0Dark from "../icon/dark-mode/navbar/search 0.png";
import search1Dark from "../icon/dark-mode/navbar/search 1.png";
import inbox0Dark from "../icon/dark-mode/navbar/inbox 0.png";
import inbox1Dark from "../icon/dark-mode/navbar/inbox 1.png";
import createDark from "../icon/dark-mode/navbar/create.png";
import explorer0Dark from "../icon/dark-mode/navbar/explore 0.png";
import explorer1Dark from "../icon/dark-mode/navbar/explore 1.png";
import profile0Dark from "../icon/dark-mode/navbar/profile 0.png";
import profile1Dark from "../icon/dark-mode/navbar/profile 1.png";
import notification0Dark from "../icon/dark-mode/navbar/notifications 0.png";
import notification1Dark from "../icon/dark-mode/navbar/notifications 1.png";
import optionsDark from "../icon/dark-mode/navbar/options.png";
import axios from "axios";
import { getLink } from "../../API";
import handleCache from "../../cache/cacheMedia";

const Navbar = ({
  isDarkMode,
  visitUser,
  handleCatchAxios,
  setErrorCode,
  error500,
  updateUserPostFlow,
}) => {
  const [actualPage, setActualPage] = useState("home");
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);

  const [pfp, setPfp] = useState(null);
  const [pfpLoaded, setPfpLoaded] = useState(false);

  const [notiCount, setNotiCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);

  const handleGetNotificationCount = async () => {
    await axios
      .get(getLink.getNotificationCount, {
        params: { token: Cookies.get("token") },
      })
      .then((res) => setNotiCount(res?.data))
      .catch((err) => handleCatchAxios(err));
  };

  const handleGetMessagesCount = async () => {
    await axios
      .get(getLink.getMessagesCount, {
        params: { token: Cookies.get("token") },
      })
      .then((res) => setMsgCount(res?.data))
      .catch((err) => handleCatchAxios(err));
  };

  useEffect(() => {
    handleGetNotificationCount();
    handleGetMessagesCount();
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const handleCloseModals = () => {
    setCreatePostModalOpen(false);
    setNotificationModalOpen(false);
  };

  const handleSetActualPage = () => {
    if (isNotificationModalOpen) {
      setActualPage("notification");
      return;
    }

    const urlPage = window.location.href.split("/")[3].split("?")[0];
    switch (urlPage.split("/")[0]) {
      case "":
        setActualPage("home");
        break;
      case "search":
        setActualPage("search");
        break;
      case "inbox":
        setActualPage("inbox");
        break;
      case "explorer":
        setActualPage("explorer");
        break;
      case Cookies.get("username"):
        setActualPage("profile");
        break;
      default:
        setActualPage("");
    }
  };

  useEffect(() => {
    handleSetActualPage();
  });

  const borderColor = isDarkMode
    ? "1px solid rgb(74, 74, 74)"
    : "1px solid rgb(183, 183, 183)";

  const homeIcon = (
    <img
      style={{
        width: "22px",
        height: "22px",
      }}
      src={
        actualPage === "home"
          ? isDarkMode
            ? home1Dark
            : home1Light
          : isDarkMode
          ? home0Dark
          : home0Light
      }
      alt="profile"
      className="pointer"
      onClick={() => {
        handleCloseModals();
        setActualPage("profile");
        setErrorCode(0);
        navigate("/");
      }}
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    />
  );

  const searchIcon = (
    <img
      style={{
        width: "21px",
        height: "21px",
      }}
      src={
        actualPage === "search"
          ? isDarkMode
            ? search1Dark
            : search1Light
          : isDarkMode
          ? search0Dark
          : search0Light
      }
      alt="search"
      className="pointer"
      onClick={() => {
        handleCloseModals();
        setActualPage("search");
        setErrorCode(0);
        navigate("/search");
      }}
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    />
  );

  const inboxIcon = (
    <div
      style={{
        width: "22px",
        height: "22px",
        position: "relative",
      }}
    >
      <img
        style={{
          width: "22px",
          height: "22px",
        }}
        src={
          actualPage.split("/")[0] === "inbox"
            ? isDarkMode
              ? inbox1Dark
              : inbox1Light
            : isDarkMode
            ? inbox0Dark
            : inbox0Light
        }
        alt="inbox"
        className="pointer"
        onClick={() => {
          handleCloseModals();
          setActualPage("inbox");
          setErrorCode(0);
          navigate("/inbox");
        }}
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
      <span
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          color: "red",
        }}
      >
        {msgCount > 0 ? msgCount : ""}
      </span>
    </div>
  );

  const createIcon = (
    <img
      style={{
        width: "24px",
        height: "24px",
      }}
      src={isDarkMode ? createDark : createLight}
      alt="create"
      className="pointer"
      onClick={() => {
        handleCloseModals();
        setCreatePostModalOpen(true);
      }}
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    />
  );

  const explorerIcon = (
    <img
      style={{
        width: "24px",
        height: "24px",
      }}
      src={
        actualPage === "explorer"
          ? isDarkMode
            ? explorer1Dark
            : explorer1Light
          : isDarkMode
          ? explorer0Dark
          : explorer0Light
      }
      alt="explorer"
      className="pointer"
      onClick={() => {
        handleCloseModals();
        setActualPage("explorer");
        setErrorCode(0);
        navigate("/explorer");
      }}
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    />
  );

  const notificationIcon = (
    <div
      style={{
        width: "25px",
        height: "25px",
        position: "relative",
      }}
    >
      <img
        style={{
          width: "25px",
          height: "25px",
        }}
        src={
          actualPage === "notification"
            ? isDarkMode
              ? notification1Dark
              : notification1Light
            : isDarkMode
            ? notification0Dark
            : notification0Light
        }
        alt="notification"
        className="pointer"
        onClick={() => {
          handleCloseModals();
          setActualPage("notification");
          setNotificationModalOpen(true);
        }}
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
      <span
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          color: "red",
        }}
      >
        {notiCount > 0 ? notiCount : ""}
      </span>
    </div>
  );

  const profileIcon = (
    <img
      style={{
        width: pfpLoaded ? "28px" : "24px",
        height: pfpLoaded ? "28px" : "24px",
        borderRadius: pfpLoaded ? "100%" : "0",
      }}
      src={
        pfpLoaded
          ? pfp
          : actualPage === "profile"
          ? isDarkMode
            ? profile1Dark
            : profile1Light
          : isDarkMode
          ? profile0Dark
          : profile0Light
      }
      onLoad={() =>
        handleCache(
          "pfp",
          `${
            process.env.REACT_APP_API_URL
          }/api/user/data/picture?username=${Cookies.get("username")}`,
          Cookies.get("username"),
          setPfp,
          setPfpLoaded
        )
      }
      alt="profile"
      className="pointer"
      onClick={() => {
        if (visitUser) visitUser(Cookies.get("username"));
        handleCloseModals();
        setActualPage("profile");
        setErrorCode(0);
        navigate(`/${Cookies.get("username")}`);
      }}
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    />
  );

  const optionIcon = (
    <div className="options-icon">
      <img
        style={{
          width: "30px",
          height: "30px",
        }}
        src={isDarkMode ? optionsDark : optionsLight}
        alt="option"
        className="pointer"
        onClick={() => {
          handleCloseModals();
          setActualPage("options");
          setOptionsModalOpen(true);
        }}
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
    </div>
  );

  const navbarPC = (
    <div
      className="container-y"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        left: "0",
        top: "0",
        width: "72px",
        height: "100svh",
        padding: "8svh 0",
        borderRight: borderColor,
      }}
    >
      <div className="app-icon">
        <img
          style={{
            width: "45px",
            height: "45px",
          }}
          src={appIcon}
          alt="vibely"
          className="pointer"
          onClick={() => {
            setActualPage("home");
            setErrorCode(0);
            navigate("/");
          }}
          // block right click
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
      </div>
      <div
        className="container-y navbar-icon"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "72px",
          height: "380px",
        }}
      >
        {homeIcon}
        {searchIcon}
        {inboxIcon}
        {createIcon}
        {explorerIcon}
        {notificationIcon}
        {profileIcon}
      </div>
      {optionIcon}
    </div>
  );

  const homeHeader = (
    <div
      className="container-x navbar-icon"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100svw",
        padding: "0px 8px",
      }}
    >
      <img
        style={{
          height: "60px",
        }}
        src={isDarkMode ? appTextDark : appTextLight}
        alt="vibely"
        className="pointer"
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
      <div className="container-x">
        <div style={{ marginRight: "15px", alignItems: "center" }}>
          {notificationIcon}
        </div>
        {inboxIcon}
      </div>
    </div>
  );

  const navbarMobile = (
    <div style={{ display: "flex" }}>
      {!error500 &&
        (actualPage === "home" || actualPage === "notification") &&
        homeHeader}
      <div
        className="container-x navbar-icon navbar-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          left: "0",
          bottom: "0",
          width: "100svw",
          height: "8svh",
          padding: "0 8svw",
          borderTop: borderColor,
        }}
      >
        {homeIcon}
        {searchIcon}
        {createIcon}
        {explorerIcon}
        {profileIcon}
      </div>
    </div>
  );
  return (
    <div style={{ zIndex: "9998" }}>
      <div className="only-pc">{navbarPC}</div>
      <div className="only-mobile">
        {navbarMobile}
        {isOptionsModalOpen && (
          <MoreModal
            isDarkMode={isDarkMode}
            isOpen={isOptionsModalOpen}
            onRequestClose={() => setOptionsModalOpen(false)}
            setErrorCode={setErrorCode}
          />
        )}
      </div>
      {isCreatePostModalOpen && (
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onRequestClose={() => setCreatePostModalOpen(false)}
          isDarkMode={isDarkMode}
          handleCatchAxios={handleCatchAxios}
          updateUserPostFlow={updateUserPostFlow}
        />
      )}
      {isNotificationModalOpen && (
        <NotificationModal
          isDarkMode={isDarkMode}
          isOpen={isNotificationModalOpen}
          onRequestClose={() => setNotificationModalOpen(false)}
          handleCatchAxios={handleCatchAxios}
          visitUser={(username) => {
            setNotificationModalOpen(false);
            if (visitUser) visitUser(username);
          }}
          setErrorCode={setErrorCode}
        />
      )}
    </div>
  );
};
export default Navbar;

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../../modal.css";
import axios from "axios";
import { getLink, updateLink } from "../../API";
import Cookies from "js-cookie";
import NotificationComponent from "./notificationComponent";

Modal.setAppElement("#root");

const NotificationModal = ({
  isDarkMode,
  isOpen,
  onRequestClose,
  handleCatchAxios,
  visitUser,
  setErrorCode,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [notificationArray, setNotificationArray] = useState([]);

  const handleGetNotification = async () => {
    await axios
      .get(getLink.getNotification, {
        params: {
          token: Cookies.get("token"),
        },
      })
      .then((res) => {
        setNotificationArray(res?.data);
      })
      .catch((err) => handleCatchAxios(err));
    setLoading(false);
  };

  const handleSetNotificationSeen = () => {
    axios
      .post(updateLink.setNotificationSeen, {
        token: Cookies.get("token"),
      })
      .catch((err) => handleCatchAxios(err));
  };

  useEffect(() => {
    handleGetNotification();
    handleSetNotificationSeen();
    // eslint-disable-next-line
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Notification"
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
          width: "350px",
          maxWidth: "95svw",
          height: "auto",
          maxHeight: "60svh",
          borderRadius: "8px",
          backgroundColor: isDarkMode ? "black" : "white",
          borderColor: isDarkMode ? "black" : "white",
          animation: "fadeIn 0.3s",
        },
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Notifications</h2>
      <div>
        {isLoading && (
          <div
            className="full-width"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <span className="loader" />
          </div>
        )}
        {!isLoading && notificationArray?.length === 0 && (
          <div>There's nothing new</div>
        )}
        {!isLoading && notificationArray.length > 0 && (
          <div>
            {notificationArray.map((noti, index) => (
              <NotificationComponent
                key={index}
                notification={noti.notification}
                user={noti.user}
                visitUser={visitUser}
                handleCatchAxios={handleCatchAxios}
                refreshNoitfication={handleGetNotification}
                setLoading={setLoading}
                setErrorCode={setErrorCode}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NotificationModal;

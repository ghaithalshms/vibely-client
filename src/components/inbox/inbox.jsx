import React, { useEffect, useState } from "react";
import axios from "axios";
import "./inbox.css";
import { getLink } from "../../API";
import Cookies from "js-cookie";
import GetInboxUsers from "./getInboxUsers";
import ChatComponent from "../chat/chatComponent";

const Inbox = ({
  isDarkMode,
  scrollingPercentage,
  handleCatchAxios,
  clientSocket,
  setErrorCode,
}) => {
  const [inboxUsers, setInboxUsers] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const handleUpdateInboxUsers = (messageData) => {
    setInboxUsers((prevUserInboxUsers) => {
      let newInboxUsers = [];
      prevUserInboxUsers.forEach((inboxUser) => {
        if (
          inboxUser.user.username === messageData.from ||
          inboxUser.user.username === messageData.to
        ) {
          newInboxUsers.unshift({
            user: inboxUser.user,
            message: messageData,
          });
        } else newInboxUsers.push(inboxUser);
      });
      return newInboxUsers;
    });
  };

  const setChatUserFromLink = async () => {
    const username = window.location.href.split("/").pop().split("?")[0];
    if (username && username !== "inbox") {
      try {
        const res = await axios.get(getLink.getUserData, {
          params: {
            username,
            token: Cookies.get("token"),
          },
        });
        setChatUser(res?.data);
      } catch (error) {
        handleCatchAxios(error);
      }
    }
  };

  useEffect(() => {
    setChatUserFromLink();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="inbox-container">
      <GetInboxUsers
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        setChatUser={setChatUser}
        chatUser={chatUser}
        inboxUsers={inboxUsers}
        setInboxUsers={setInboxUsers}
        setErrorCode={setErrorCode}
      />
      <ChatComponent
        isDarkMode={isDarkMode}
        chatUser={chatUser}
        setChatUser={setChatUser}
        handleCatchAxios={handleCatchAxios}
        clientSocket={clientSocket}
        handleUpdateInboxUsers={handleUpdateInboxUsers}
        setErrorCode={setErrorCode}
      />
    </div>
  );
};

export default Inbox;

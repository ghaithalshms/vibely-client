import React, { useEffect, useState } from "react";
import "./inbox.css";
import GetInboxUsers from "./getInboxUsers";
import ChatComponent from "../chat/chatComponent";
import axios from "axios";
import { getLink } from "../../API";
import Cookies from "js-cookie";

const Inbox = ({
  isDarkMode,
  scrollingPercentage,
  handleCatchAxios,
  clientSocket,
}) => {
  const [chatUser, setChatUser] = useState(null);

  const setChatUserFromLink = async () => {
    const username = window.location.href
      .split("/")
      [window.location.href.split("/").length - 1].split("?")[0];
    if (username && username !== "inbox")
      await axios
        .get(getLink.getUserData, {
          params: {
            username,
            userSigned: Cookies.get("token"),
          },
        })
        .then((res) => {
          setChatUser(res?.data);
        });
  };

  useEffect(() => {
    setChatUserFromLink();
  }, []);

  return (
    <div className="inbox-container">
      <GetInboxUsers
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        setChatUser={setChatUser}
        chatUser={chatUser}
      />
      <ChatComponent
        isDarkMode={isDarkMode}
        chatUser={chatUser}
        setChatUser={setChatUser}
        handleCatchAxios={handleCatchAxios}
        clientSocket={clientSocket}
      />
    </div>
  );
};

export default Inbox;

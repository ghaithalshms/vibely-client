import React, { useState } from "react";
import "./inbox.css";
import GetInboxUsers from "./getInboxUsers";
import ChatComponent from "../chat/chatComponent";

const Inbox = ({
  isDarkMode,
  scrollingPercentage,
  handleCatchAxios,
  clientSocket,
}) => {
  const [chatUser, setChatUser] = useState(null);

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

import React, { useState } from "react";
import "./chat.css";
import ChatBody from "./chatBody";
import ChatHeader from "./chatHeader";
import ChatFooter from "./chatFooter";
import appIcon from "../icon/icon.png";

const ChatComponent = ({
  isDarkMode,
  chatUser,
  setChatUser,
  handleCatchAxios,
  clientSocket,
}) => {
  const [chatArray, setChatArray] = useState();

  const startChatElement = (
    <div
      className="container-y"
      style={{ alignItems: "center", marginTop: "35svh" }}
    >
      <img
        style={{
          width: "80px",
          height: "80px",
          marginBottom: "1rem",
        }}
        src={appIcon}
        alt="vibely"
        className="pointer"
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
      <h2>Start talking with your friends!</h2>
    </div>
  );

  return (
    <div className="chat-container">
      <div className="only-pc">{!chatUser && startChatElement}</div>
      {chatUser && (
        <>
          <ChatHeader
            isDarkMode={isDarkMode}
            chatUser={chatUser}
            setChatUser={setChatUser}
          />
          <ChatBody
            isDarkMode={isDarkMode}
            chatUser={chatUser}
            handleCatchAxios={handleCatchAxios}
            clientSocket={clientSocket}
            chatArray={chatArray}
            setChatArray={setChatArray}
          />
          <ChatFooter
            isDarkMode={isDarkMode}
            chatUser={chatUser}
            handleCatchAxios={handleCatchAxios}
            clientSocket={clientSocket}
            chatArray={chatArray}
            setChatArray={setChatArray}
          />
        </>
      )}
    </div>
  );
};

export default ChatComponent;

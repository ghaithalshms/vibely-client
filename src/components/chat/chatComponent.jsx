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
  handleUpdateInboxUsers,
  setErrorCode,
}) => {
  const [chatArray, setChatArray] = useState([]);
  const [chatBodyScrollPosition, setChatBodyScrollPosition] = useState(0);

  const handleUpdateChatArray = (messageData) =>
    setChatArray((prevChatArray) => [...prevChatArray, messageData]);

  const startChatElement = (
    <div
      className="container-y"
      style={{ alignItems: "center", marginTop: "35vh" }}
    >
      <img
        style={{ width: "80px", height: "80px", marginBottom: "1rem" }}
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

  const renderChatElements = () => {
    if (!chatUser) {
      return <div className="only-pc">{startChatElement}</div>;
    } else {
      return (
        <>
          <ChatHeader
            isDarkMode={isDarkMode}
            chatUser={chatUser}
            setChatUser={setChatUser}
            setErrorCode={setErrorCode}
          />
          <ChatBody
            isDarkMode={isDarkMode}
            chatUser={chatUser}
            handleCatchAxios={handleCatchAxios}
            clientSocket={clientSocket}
            chatArray={chatArray}
            setChatArray={setChatArray}
            handleUpdateInboxUsers={handleUpdateInboxUsers}
            handleUpdateChatArray={handleUpdateChatArray}
            chatBodyScrollPosition={chatBodyScrollPosition}
            setChatBodyScrollPosition={setChatBodyScrollPosition}
          />
          <ChatFooter
            isDarkMode={isDarkMode}
            chatUser={chatUser}
            handleCatchAxios={handleCatchAxios}
            clientSocket={clientSocket}
            chatArray={chatArray}
            setChatArray={setChatArray}
            handleUpdateChatArray={handleUpdateChatArray}
            handleUpdateInboxUsers={handleUpdateInboxUsers}
            setChatBodyScrollPosition={setChatBodyScrollPosition}
          />
        </>
      );
    }
  };

  return <div className="chat-container">{renderChatElements()}</div>;
};

export default ChatComponent;

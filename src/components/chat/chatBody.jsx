import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageComponent from "./messageComponent";
import { getLink, updateLink } from "../../API";
import Cookies from "js-cookie";

const ChatBody = ({
  isDarkMode,
  chatUser,
  handleCatchAxios,
  clientSocket,
  chatArray,
  setChatArray,
  handleUpdateChatArray,
}) => {
  const [isLoading, setLoading] = useState(false);
  // GET OLD CHAT FROM DATABASE
  const handleGetChat = async () => {
    await axios
      .get(getLink.getChat, {
        params: {
          token: Cookies.get("token"),
          username: chatUser.username,
        },
      })
      .then((res) => setChatArray(res?.data))
      .catch((err) => handleCatchAxios(err));
    setLoading(false);
  };

  // RUN GET CHAT FROM DB
  useEffect(() => {
    if (chatUser) {
      setLoading(true);
      handleGetChat();
    } else setChatArray(null);
    // eslint-disable-next-line
  }, [chatUser]);

  // SCROLL TO THE END AFTER GETTING CHAT
  const handleScrollChatBodyToEnd = () => {
    const chatBody = document.querySelector(".chat-body-container");
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  };

  // RUN SCROLL TO THE END
  useEffect(() => handleScrollChatBodyToEnd(), [chatArray]);

  // SOCKET'S RECEIVE MESSAGE
  const handleReceiveMessage = () => {
    clientSocket.on("receive_message", (messageData) => {
      console.log(messageData);
      if (chatUser.username === messageData.from)
        handleUpdateChatArray(messageData);
    });
  };

  useEffect(() => {
    handleReceiveMessage();
    return () => clientSocket.off("receive_message");
    // eslint-disable-next-line
  }, []);

  // SET MESSAGES SEEN
  const handleSetMessagesSeen = () => {
    axios.post(updateLink.setMessagesSeen, {
      token: Cookies.get("token"),
      username: chatUser.username,
    });
  };

  useEffect(() => handleSetMessagesSeen());

  const loadingElement = (
    <div
      className="full-width"
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "35svh",
      }}
    >
      <span className="loader" />
    </div>
  );

  const seenElement = chatArray &&
    !isLoading &&
    chatArray[chatArray.length - 1]?.from === Cookies.get("username") &&
    chatArray[chatArray.length - 1]?.seen && (
      <div
        className="full-width"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <span>seen</span>
      </div>
    );

  return (
    <div className="chat-body-container">
      {isLoading && loadingElement}
      {!isLoading &&
        chatArray?.map((message) => (
          <MessageComponent
            key={message.id}
            isDarkMode={isDarkMode}
            message={message}
          />
        ))}
      {/* MESSAGE SEEN */}
      {seenElement}
    </div>
  );
};

export default ChatBody;

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
  handleUpdateInboxUsers,
  handleUpdateChatArray,
}) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (chatUser) {
      setLoading(true);
      handleGetChat();
    } else {
      setChatArray(null);
    } // eslint-disable-next-line
  }, [chatUser]);

  useEffect(() => {
    handleScrollChatBodyToEnd();
    // eslint-disable-next-line
  }, [chatArray]);

  useEffect(() => {
    handleReceiveMessage();
    return () => clientSocket.off("receive_message");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleSetMessagesSeen();
    // eslint-disable-next-line
  }, []);

  const handleGetChat = async () => {
    try {
      const res = await axios.get(getLink.getChat, {
        params: {
          token: Cookies.get("token"),
          username: chatUser.username,
        },
      });
      setChatArray(res?.data);
      setLoading(false);
    } catch (err) {
      handleCatchAxios(err);
      setLoading(false);
    }
  };

  const handleScrollChatBodyToEnd = () => {
    const chatBody = document.querySelector(".chat-body-container");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  };

  const handleReceiveMessage = () => {
    clientSocket.on("receive_message", (messageData) => {
      if (chatUser.username === messageData.from) {
        handleUpdateChatArray(messageData);
      }
      handleUpdateInboxUsers(messageData);
    });
  };

  const handleSetMessagesSeen = () => {
    if (chatArray && chatArray.length > 0) {
      const lastMessage = chatArray[chatArray.length - 1];
      if (lastMessage.from === Cookies.get("username") && !lastMessage.seen) {
        axios.post(updateLink.setMessagesSeen, {
          token: Cookies.get("token"),
          username: chatUser.username,
        });
      }
    }
  };

  const loadingElement = (
    <div
      className="full-width"
      style={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
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
            handleScrollChatBodyToEnd={handleScrollChatBodyToEnd}
          />
        ))}
      {seenElement}
    </div>
  );
};

export default ChatBody;

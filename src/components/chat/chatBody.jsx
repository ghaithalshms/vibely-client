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
  chatBodyScrollPosition,
  setChatBodyScrollPosition,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [oldestMessageGot, setOldestMessageGot] = useState(0);

  const handleResetChat = () => {
    setChatArray([]);
    setOldestMessageGot(0);
    setLoading(true);
    setChatBodyScrollPosition(0);
  };

  useEffect(() => {
    if (chatUser) {
      handleResetChat();
      handleGetChat(0);
    } else {
      handleResetChat();
    } // eslint-disable-next-line
  }, [chatUser]);

  useEffect(() => {
    handleUpdateScrollChatBody();
    // eslint-disable-next-line
  }, [chatArray, chatBodyScrollPosition]);

  useEffect(() => {
    handleReceiveMessageSocket();
    handleGetMessageSeenSocket();
    return () => {
      clientSocket.off("receive_message");
      clientSocket.off("get_message_seen");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleSetMessageSeen();
    // eslint-disable-next-line
  });

  let isChatFetching = false;

  const handleGetChat = async (_oldestMessageGot) => {
    if (isChatFetching) return;

    isChatFetching = true;
    const oldestMessageBeforeUpdate = _oldestMessageGot ?? oldestMessageGot;
    axios
      .get(getLink.getChat, {
        params: {
          token: Cookies.get("token"),
          username: chatUser.username,
          oldestMessageGot: _oldestMessageGot ?? oldestMessageGot,
        },
      })

      .then((res) => {
        if (res?.data.oldestMessageGot !== oldestMessageGot) {
          setChatArray((prevChatArray) => [
            ...res?.data.chatArray,
            ...prevChatArray,
          ]);

          setOldestMessageGot(res?.data.oldestMessageGot);
        }
        setLoading(false);
      })
      .catch((err) => {
        handleCatchAxios(err);
        setLoading(false);
      });

    if (oldestMessageBeforeUpdate === 0) {
      handleScrollChatBodyToEnd();
    }
    isChatFetching = false;
  };

  const handleScrollChatBodyToEnd = () => {
    const chatBody = document.querySelector(".chat-body-container");
    if (chatBody) {
      setChatBodyScrollPosition(chatBody.scrollHeight);
    }
  };

  const handleUpdateScrollChatBody = () => {
    const chatBody = document.querySelector(".chat-body-container");
    if (chatBody) {
      // chatBody.scrollTop = chatBody.scrollHeight;
      chatBody.scrollTop = chatBodyScrollPosition;
    }
  };

  const handleReceiveMessageSocket = () => {
    clientSocket.on("receive_message", (messageData) => {
      if (chatUser.username === messageData.from) {
        handleUpdateChatArray(messageData);
      }
      handleUpdateInboxUsers(messageData);
      // handleSetMessageSeenSocket(messageData);
    });
  };

  const handleGetMessageSeenSocket = () => {
    clientSocket.on("get_message_seen", (msgID) => {
      handleUpdateSetMessageSeenArray(msgID);
    });
  };

  const handleUpdateSetMessageSeenArray = (msgID) => {
    setChatArray((prevChatArray) => {
      const newChatArray = prevChatArray.map((chat) => {
        if (chat.id === msgID) {
          return {
            ...chat,
            seen: true,
          };
        }
        return chat;
      });
      return newChatArray;
    });
  };

  const handleSetMessageSeen = () => {
    if (chatArray?.length > 0) {
      const lastMessage = chatArray[chatArray.length - 1];
      if (lastMessage.from === chatUser.username && !lastMessage.seen) {
        handleSetMessageSeenDB();
        handleSetMessageSeenSocket(lastMessage);
      }
    }
  };

  const handleSetMessageSeenDB = () => {
    axios.post(updateLink.setMessagesSeen, {
      token: Cookies.get("token"),
      username: chatUser.username,
    });
  };

  const handleSetMessageSeenSocket = (messageData) => {
    if (clientSocket && Cookies.get("username")) {
      clientSocket.emit("set_message_seen", messageData);
    }
  };

  const handleChatBodyOnScroll = (e) => {
    if (isChatFetching) return;

    if (e.target.scrollTop === 0) {
      handleGetChat();
    }
  };

  const loadingElement = (
    <div
      className="full-width"
      style={{ display: "flex", justifyContent: "center", marginTop: "35vh" }}
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
        <span style={{ marginRight: "10px" }}>seen</span>
      </div>
    );

  let timeoutId;

  return (
    <div
      className="chat-body-container"
      onWheel={(e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleChatBodyOnScroll(e);
        }, 300);
      }}
      onTouchMove={(e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleChatBodyOnScroll(e);
        }, 300);
      }}
    >
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

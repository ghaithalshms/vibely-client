import React, { useState } from "react";
import axios from "axios";
import { postLink } from "../../API";
import Cookies from "js-cookie";
import galleryLight from "../icon/light-mode/chat/galery.png";
import micLight from "../icon/light-mode/chat/mic.png";
import galleryDark from "../icon/dark-mode/chat/galery.png";
import micDark from "../icon/dark-mode/chat/mic.png";
import SelectMediaModal from "./selectMediaModal";

const ChatFooter = ({
  isDarkMode,
  chatUser,
  handleCatchAxios,
  clientSocket,
  chatArray,
  setChatArray,
}) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);

  const [isMediaModalOpen, setMediaModalOpen] = useState(false);

  const handleSendMessageToDB = async () => {
    axios.defaults.maxBodyLength = 2 * 1024 * 1024;
    const formData = new FormData();
    formData.append("token", Cookies.get("token"));
    formData.append("username", chatUser.username);
    formData.append("message", message);
    formData.append("fileType", fileType);
    formData.append("file", file);

    let id = 0;

    await axios
      .post(postLink.sendMessageToDB, formData)
      .then((res) => (id = res?.data?.id))
      .catch((err) => handleCatchAxios(err));

    return id;
  };

  const handleSendMessageToSocket = (id) => {
    if (clientSocket && Cookies.get("username")) {
      const messageData = {
        id,
        message,
        from: Cookies.get("username"),
        to: chatUser.username,
        file,
        fileType,
      };
      clientSocket.emit("send_message", messageData);
    }
  };

  const handleUpdateChatArray = (id) => {
    if (chatArray) {
      setChatArray([
        ...chatArray,
        {
          id,
          message: message,
          from: Cookies.get("username"),
          to: chatUser.username,
          // sentDate: messageData.sent_date, FIXXX
          file,
          fileType,
          seen: false,
        },
      ]);
    }
  };

  const handleClearTextArea = () => {
    setMessage("");
    document.getElementById("send-message-textarea")?.focus();
  };

  const handleSendMessage = async () => {
    const id = await handleSendMessageToDB();
    handleSendMessageToSocket(id);
    handleUpdateChatArray(id);
    handleClearTextArea();
  };

  return (
    <div className="container-x">
      {chatUser && (
        <>
          {!message && (
            <div className="chat-icons-container">
              <img
                className="chat-icon pointer"
                src={isDarkMode ? micDark : micLight}
                alt="mic icon"
              />
              <img
                className="chat-icon pointer"
                src={isDarkMode ? galleryDark : galleryLight}
                alt="gallery icon"
                onClick={() => setMediaModalOpen(true)}
              />
            </div>
          )}
          {message && (
            <button className="send-message-button" onClick={handleSendMessage}>
              Send
            </button>
          )}
          <textarea
            id="send-message-textarea"
            className="send-message-textarea"
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            placeholder="Your message..."
          />
        </>
      )}
      {isMediaModalOpen && (
        <SelectMediaModal
          isDarkMode={isDarkMode}
          isOpen={isMediaModalOpen}
          onRequestClose={() => setMediaModalOpen(false)}
          handleCatchAxios={handleCatchAxios}
          file={file}
          setFile={setFile}
          fileType={fileType}
          setFileType={setFileType}
          chatUser={chatUser}
          chatArray={chatArray}
          setChatArray={setChatArray}
          clientSocket={clientSocket}
        />
      )}
    </div>
  );
};

export default ChatFooter;

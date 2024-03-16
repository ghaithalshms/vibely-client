import React, { useState } from "react";
import axios from "axios";
import { postLink } from "../../API";
import Cookies from "js-cookie";
import { ReactMic } from "react-mic";

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
  handleUpdateChatArray,
  handleUpdateInboxUsers,
}) => {
  const [message, setMessage] = useState("");
  const [isMediaModalOpen, setMediaModalOpen] = useState(false);
  const [isRecording, setRecording] = useState(false);

  const handleOnEndRecording = (recordedBlob) => {
    setRecording(false);
    const audioFile = new File([recordedBlob.blob], "audio.mp3", {
      type: "audio/mp3",
    });
    handleSendMessage(audioFile, "audio/mp3");
  };

  const handleSendMessageToDB = async (file, fileType) => {
    axios.defaults.maxBodyLength = 30 * 1024 * 1024;
    const formData = new FormData();
    formData.append("token", Cookies.get("token"));
    formData.append("username", chatUser.username);
    formData.append("message", message);
    formData.append("fileType", fileType);
    formData.append("file", file);

    let id = 0;

    await axios
      .post(postLink.sendMessageToDB, formData)
      .then((res) => {
        id = res?.data?.id;
      })
      .catch((err) => handleCatchAxios(err));

    return id;
  };

  const handleSendMessageToSocket = (messageData) => {
    if (clientSocket && Cookies.get("username")) {
      clientSocket.emit("send_message", messageData);
    }
  };

  const handleClearTextArea = () => {
    setMessage("");
    document.getElementById("send-message-textarea")?.focus();
  };

  // FIXME: TIME
  const handleSendMessage = async (file, fileType) => {
    const id = await handleSendMessageToDB(file, fileType);
    const messageData = {
      id,
      message,
      from: Cookies.get("username"),
      to: chatUser.username,
      // sentDate: messageData.sent_date, FIXXX
      fileType: fileType,
      seen: false,
    };
    handleUpdateChatArray(messageData);
    handleSendMessageToSocket(messageData);
    handleUpdateInboxUsers(messageData);
    handleClearTextArea();
  };

  const micIcon = (
    <img
      onClick={
        isRecording ? () => setRecording(false) : () => setRecording(true)
      }
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      className="chat-icon pointer"
      src={isDarkMode ? micDark : micLight}
      alt="mic"
    />
  );

  const galleryIcon = (
    <img
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      className="chat-icon pointer"
      src={isDarkMode ? galleryDark : galleryLight}
      alt="gallery"
      onClick={() => setMediaModalOpen(true)}
    />
  );

  const chatIconsContainer = (
    <div className="chat-icons-container">
      {micIcon}
      {galleryIcon}
    </div>
  );

  const sendMessageButton = (
    <button className="send-message-button" onClick={() => handleSendMessage()}>
      Send
    </button>
  );

  const messageTextArea = (
    <textarea
      id="send-message-textarea"
      value={message}
      onChange={(e) => setMessage(e.currentTarget.value)}
      placeholder="Your message..."
    />
  );

  const reactMicBgColor = isDarkMode ? "#2b2b2b" : "#eee";

  const reactMicElement = (
    <ReactMic
      className={isRecording ? "react-mic-comp" : "react-mic-comp display-none"}
      record={isRecording}
      onStop={handleOnEndRecording}
      strokeColor={isDarkMode ? "#eee" : "##2b2b2b"}
      backgroundColor={reactMicBgColor}
      mimeType="audio/mp3"
    />
  );

  return (
    <div className="container-x">
      {chatUser && (
        <>
          {!message && chatIconsContainer}
          {message && sendMessageButton}
          {messageTextArea}
          {reactMicElement}
        </>
      )}
      {isMediaModalOpen && (
        <SelectMediaModal
          isDarkMode={isDarkMode}
          isOpen={isMediaModalOpen}
          onRequestClose={() => setMediaModalOpen(false)}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default ChatFooter;

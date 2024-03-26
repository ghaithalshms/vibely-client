import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReactMic } from "react-mic";
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
  handleUpdateChatArray,
  handleUpdateInboxUsers,
}) => {
  const [message, setMessage] = useState("");
  const [isMediaModalOpen, setMediaModalOpen] = useState(false);
  const [isRecording, setRecording] = useState(false);

  useEffect(() => {
    document.getElementById("send-message-textarea")?.focus();
  }, []);

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

    try {
      const res = await axios.post(postLink.sendMessageToDB, formData);
      return res?.data?.id;
    } catch (err) {
      handleCatchAxios(err);
    }
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

  const handleSendMessage = async (file, fileType) => {
    const id = await handleSendMessageToDB(file, fileType || "text/plain");
    const messageData = {
      id,
      message,
      from: Cookies.get("username"),
      to: chatUser.username,
      fileType: fileType || "text/plain",
      seen: false,
    };
    handleUpdateChatArray(messageData);
    handleSendMessageToSocket(messageData);
    handleUpdateInboxUsers(messageData);
    handleClearTextArea();
  };

  const renderMicIcon = () => (
    <img
      onClick={() => setRecording(!isRecording)}
      onContextMenu={(event) => event.preventDefault()}
      className="chat-icon pointer"
      src={isDarkMode ? micDark : micLight}
      alt="mic"
    />
  );

  const renderGalleryIcon = () => (
    <img
      onContextMenu={(event) => event.preventDefault()}
      className="chat-icon pointer"
      src={isDarkMode ? galleryDark : galleryLight}
      alt="gallery"
      onClick={() => setMediaModalOpen(true)}
    />
  );

  const renderChatIcons = () => (
    <div className="chat-icons-container">
      {renderMicIcon()}
      {renderGalleryIcon()}
    </div>
  );

  const renderSendMessageButton = () => (
    <button className="send-message-button" onClick={handleSendMessage}>
      Send
    </button>
  );

  const renderMessageTextArea = () => (
    <textarea
      id="send-message-textarea"
      value={message}
      onChange={(e) => setMessage(e.currentTarget.value)}
      placeholder="Your message..."
      onKeyDown={(event) => {
        if (event.key === "Enter") handleSendMessage();
      }}
    />
  );

  const renderReactMicElement = () => (
    <ReactMic
      className={isRecording ? "react-mic-comp" : "react-mic-comp display-none"}
      record={isRecording}
      onStop={handleOnEndRecording}
      strokeColor={isDarkMode ? "#eee" : "##2b2b2b"}
      backgroundColor={isDarkMode ? "#2b2b2b" : "#eee"}
      mimeType="audio/mp3"
    />
  );

  return (
    <div className="container-x">
      {chatUser && (
        <>
          {!message && renderChatIcons()}
          {message && renderSendMessageButton()}
          {renderMessageTextArea()}
          {renderReactMicElement()}
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

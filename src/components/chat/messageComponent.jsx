import Cookies from "js-cookie";
import React, { useState } from "react";
import AudioPlayer from "../audioPlayer/audioPlayer";

const MessageComponent = ({
  isDarkMode,
  message,
  handleScrollChatBodyToEnd,
}) => {
  const [fileLoaded, setFileLoaded] = useState(false);
  const userSigned = Cookies.get("username");

  const messageElement = (
    <div
      className="message"
      style={{
        flexDirection: message.from === userSigned ? "row-reverse" : "row",
        backgroundColor:
          message.from === userSigned
            ? isDarkMode
              ? "#68053a"
              : "#f874bb"
            : isDarkMode
            ? "#292929"
            : "#e6e5e5",
        color:
          message.from === userSigned
            ? "white"
            : isDarkMode
            ? "white"
            : "black",
        borderTopRightRadius: message.from === userSigned ? "0" : "22px",
        borderTopLeftRadius: message.from !== userSigned ? "0" : "22px",
        marginLeft: message.from === userSigned ? "auto" : "0",
        marginRight: message.from === userSigned ? "5px" : "0",
      }}
    >
      <pre
        style={{
          maxWidth: "100%",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {message.message}
      </pre>
    </div>
  );

  const fileLoading = (
    <div
      className="full-width"
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <span className="loader" />
    </div>
  );

  const pictureElement = (
    <>
      {!fileLoaded && fileLoading}
      <img
        className="message-picture"
        loading="lazy"
        src={`${
          process.env.REACT_APP_API_URL
        }/api/chat/message-file?token=${Cookies.get("token")}&messageID=${
          message.id
        }`}
        onLoad={() => {
          setFileLoaded(true);
          handleScrollChatBodyToEnd();
        }}
        onError={() => setFileLoaded(false)}
        alt="Chat pic"
        // block right click
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      />
    </>
  );

  const videoElement = (
    <video
      style={{ display: fileLoaded ? "inline" : "none" }}
      className="message-video"
      loading="lazy"
      src={`${
        process.env.REACT_APP_API_URL
      }/api/chat/message-file?token=${Cookies.get("token")}&messageID=${
        message.id
      }`}
      onLoadedData={() => {
        setFileLoaded(true);
        handleScrollChatBodyToEnd();
      }}
      onError={() => setFileLoaded(false)}
      type="video/mp4"
      controls
      controlsList="nodownload"
      // block right click
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    />
  );

  const audioElement = (
    <AudioPlayer
      isDarkMode={isDarkMode}
      audioFile={`${
        process.env.REACT_APP_API_URL
      }/api/chat/message-file?token=${Cookies.get("token")}&messageID=${
        message.id
      }`}
      sentByTheUser={message.from === userSigned}
    />
  );

  const messageFileElement = (
    <div
      className="message"
      style={{
        flexDirection: message.from === userSigned ? "row-reverse" : "row",
        borderTopRightRadius: message.from === userSigned ? "0" : "22px",
        borderTopLeftRadius: message.from !== userSigned ? "0" : "22px",
        marginLeft: message.from === userSigned ? "auto" : "0",
        marginRight: message.from === userSigned ? "5px" : "0",
        backgroundColor:
          !message.fileType?.startsWith("image") &&
          !message.fileType?.startsWith("video")
            ? message.from === userSigned
              ? isDarkMode
                ? "#68053a"
                : "#f874bb"
              : isDarkMode
              ? "#292929"
              : "#e6e5e5"
            : "",
      }}
    >
      {message.fileType?.startsWith("image") && pictureElement}
      {message.fileType?.startsWith("video") && videoElement}
      {message.fileType?.startsWith("audio") && audioElement}
    </div>
  );

  return (
    <div>
      {!message.fileType && message.message && messageElement}
      {message.fileType && messageFileElement}
    </div>
  );
};

export default MessageComponent;

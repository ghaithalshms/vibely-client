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

  const getMessageStyle = () => {
    const baseStyle = {
      flexDirection: message.from === userSigned ? "row-reverse" : "row",
      borderTopRightRadius: message.from === userSigned ? "0" : "22px",
      borderTopLeftRadius: message.from !== userSigned ? "0" : "22px",
      marginLeft: message.from === userSigned ? "auto" : "0",
      marginRight: message.from === userSigned ? "5px" : "0",
    };

    if (
      message.fileType?.startsWith("image") ||
      message.fileType?.startsWith("video")
    ) {
      return {
        ...baseStyle,
        backgroundColor: "",
      };
    }

    return {
      ...baseStyle,
      backgroundColor:
        message.from === userSigned
          ? isDarkMode
            ? "#68053a"
            : "#f874bb"
          : isDarkMode
          ? "#292929"
          : "#e6e5e5",
      color: message.from === userSigned || isDarkMode ? "white" : "black",
      maxWidth: "85%",
      wordWrap: "break-word",
      overflowWrap: "break-word",
    };
  };

  const handleFileLoad = () => {
    setFileLoaded(true);
    handleScrollChatBodyToEnd();
  };

  const handleFileError = () => {
    setFileLoaded(false);
  };

  const renderMediaElement = () => {
    if (message.fileType?.startsWith("image")) {
      return (
        <>
          {!fileLoaded && renderFileLoading()}
          <img
            className="message-picture"
            loading="lazy"
            src={`${
              process.env.REACT_APP_API_URL
            }/api/chat/message-file?token=${Cookies.get("token")}&messageID=${
              message.id
            }`}
            onLoad={handleFileLoad}
            onError={handleFileError}
            alt="Chat pic"
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          />
        </>
      );
    } else if (message.fileType?.startsWith("video")) {
      return (
        <video
          style={{ display: fileLoaded ? "inline" : "none" }}
          className="message-video"
          loading="lazy"
          src={`${
            process.env.REACT_APP_API_URL
          }/api/chat/message-file?token=${Cookies.get("token")}&messageID=${
            message.id
          }`}
          onLoadedData={handleFileLoad}
          onError={handleFileError}
          type="video/mp4"
          controls
          controlsList="nodownload"
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
      );
    } else if (message.fileType?.startsWith("audio")) {
      return (
        <AudioPlayer
          isDarkMode={isDarkMode}
          audioUrl={`${
            process.env.REACT_APP_API_URL
          }/api/chat/message-file?token=${Cookies.get("token")}&messageID=${
            message.id
          }`}
          sentByTheUser={message.from === userSigned}
        />
      );
    }
  };

  const renderFileLoading = () => {
    return (
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
  };

  return (
    <div className="message" style={getMessageStyle()}>
      {message.fileType === "text/plain" && message.message && (
        <pre>{message.message}</pre>
      )}
      {message.fileType !== "text/plain" && renderMediaElement()}
    </div>
  );
};

export default MessageComponent;

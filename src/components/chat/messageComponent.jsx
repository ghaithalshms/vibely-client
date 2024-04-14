import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import AudioPlayer from "../audioPlayer/audioPlayer";
import handleCache from "../../cache/cacheMedia";
import playIcon from "../icon/light-mode/chat/play.png";
import OneTimeFileModal from "./oneTimeFileModal";

const MessageComponent = ({
  isDarkMode,
  message,
  handleScrollChatBodyToEnd,
}) => {
  const [file, setFile] = useState(null);
  const [fileLoaded, setFileLoaded] = useState(false);

  const [isOneTimeModalOpen, setOneTimeModalOpen] = useState(false);
  const [isOneTimeOpened, setOneTimeOpened] = useState(message.oneTimeOpened);

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
      (message.fileType?.startsWith("image") ||
        message.fileType?.startsWith("video")) &&
      !message.oneTime
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

  useEffect(() => {
    if (
      !message.fileType.startsWith("text") &&
      !message.fileType.startsWith("audio") &&
      !message.oneTime
    ) {
      handleCache(
        "chat",
        `${
          process.env.REACT_APP_API_URL
        }/api/chat/message-file?token=${Cookies.get("token")}&messageID=${
          message.id
        }`,
        message.id,
        setFile,
        setFileLoaded
      );
    }
    // eslint-disable-next-line
  }, []);

  const oneTimeMediaSpanText = () => {
    if (isOneTimeOpened) {
      if (message.from === Cookies.get("username")) {
        return `${
          message.fileType.startsWith("image") ? "Image" : "Video"
        } opened`;
      } else {
        return message.fileType.startsWith("image") ? "Image" : "Video";
      }
    } else {
      if (message.from === Cookies.get("username")) {
        return `${
          message.fileType.startsWith("image") ? "Image" : "Video"
        } sent`;
      } else {
        return `Click to open the ${
          message.fileType.startsWith("image") ? "Image" : "Video"
        }`;
      }
    }
  };

  const oneTimeMediaElement = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        cursor:
          !isOneTimeOpened && message.to === Cookies.get("username")
            ? "pointer"
            : "default",
        padding: "2px",
      }}
      onClick={() => {
        if (!isOneTimeOpened && message.to === Cookies.get("username")) {
          setOneTimeOpened(true);
          setOneTimeModalOpen(true);
        }
      }}
    >
      <img
        style={{ width: "18px", height: "18px", marginRight: "8px" }}
        src={playIcon}
        alt="open media"
      />
      <span>{oneTimeMediaSpanText()}</span>
    </div>
  );

  const renderMediaElement = () => {
    if (!message.oneTime) {
      if (message.fileType?.startsWith("image")) {
        return (
          <>
            {!fileLoaded && renderFileLoading()}
            {fileLoaded && (
              <img
                className="message-picture"
                loading="lazy"
                src={file}
                onLoad={handleScrollChatBodyToEnd}
                onError={() => setFileLoaded(false)}
                alt="Chat pic"
                onContextMenu={(event) => {
                  event.preventDefault();
                }}
              />
            )}
          </>
        );
      } else if (message.fileType?.startsWith("video")) {
        return (
          <video
            style={{ display: fileLoaded ? "inline" : "none" }}
            className="message-video"
            loading="lazy"
            src={file}
            onLoad={handleScrollChatBodyToEnd}
            onError={() => setFileLoaded(false)}
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
    } else {
      return oneTimeMediaElement;
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
      {isOneTimeModalOpen && (
        <OneTimeFileModal
          isDarkMode={isDarkMode}
          isOpen={isOneTimeModalOpen}
          onRequestClose={() => setOneTimeModalOpen(false)}
          message={message}
        />
      )}
    </div>
  );
};

export default MessageComponent;

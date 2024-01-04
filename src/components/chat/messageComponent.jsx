import Cookies from "js-cookie";
import React from "react";

const MessageComponent = ({ isDarkMode, message }) => {
  const userSigned = Cookies.get("username");

  const handlePicture = (picture) => {
    if (picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
  };

  const handleVideo = (video) => {
    return video
      ? `data:video/mp4;base64,${btoa(
          new Uint8Array(video.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`
      : null;
  };

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

  const pictureElement = (
    <div
      className="message"
      style={{
        flexDirection: message.from === userSigned ? "row-reverse" : "row",
        borderTopRightRadius: message.from === userSigned ? "0" : "22px",
        borderTopLeftRadius: message.from !== userSigned ? "0" : "22px",
        marginLeft: message.from === userSigned ? "auto" : "0",
        marginRight: message.from === userSigned ? "5px" : "0",
      }}
    >
      <img
        className="message-picture"
        src={handlePicture(message.file)}
        alt="msg img"
      />
    </div>
  );

  const videoElement = (
    <div
      className="message"
      style={{
        flexDirection: message.from === userSigned ? "row-reverse" : "row",
        borderTopRightRadius: message.from === userSigned ? "0" : "22px",
        borderTopLeftRadius: message.from !== userSigned ? "0" : "22px",
        marginLeft: message.from === userSigned ? "auto" : "0",
        marginRight: message.from === userSigned ? "5px" : "0",
      }}
    >
      <video
        src={handleVideo(message.file)}
        type="video/mp4"
        controls
        controlsList="nodownload"
        className="message-video"
      />
    </div>
  );

  return (
    <div>
      {message.message && messageElement}
      {message.file && message.fileType === "picture" && pictureElement}
      {message.file && message.fileType === "video" && videoElement}
    </div>
  );
};

export default MessageComponent;

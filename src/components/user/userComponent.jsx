import React from "react";
import defaultPfp from "../../icon/default profile picture.jpg";
import adminIcon from "../../icon/admin.png";
import verifiedIcon from "../../icon/verified.png";
import { useNavigate } from "react-router-dom";

const UserComponent = ({ user, visitUser }) => {
  const handlePfp = () => {
    if (user?.picture)
      return `data:image/png;base64,${btoa(
        new Uint8Array(user.picture.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
    else return defaultPfp;
  };
  const navigate = useNavigate();
  const nameAndIcon = (
    <div className="container-y">
      <div className="container-x" style={{ alignItems: "center" }}>
        <h3 style={{ marginRight: "5px" }}>{`${user.firstName} `}</h3>
        {user.isVerified && (
          <img
            style={{ height: "20px", width: "20px", marginRight: "3px" }}
            src={verifiedIcon}
            alt="verified"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          />
        )}
        {user.isAdmin && (
          <img
            style={{ height: "15px", width: "15px" }}
            src={adminIcon}
            alt="admin"
            // block right click
            onContextMenu={(event) => {
              event.preventDefault();
            }}
          />
        )}
      </div>
      <span>{`@${user.username}`}</span>
    </div>
  );
  return (
    <div
      className="container-x pointer"
      onClick={() => {
        navigate(`/${user.username}`);
        visitUser(user.username);
      }}
    >
      <img
        className="profile-picture"
        style={{
          width: "43px",
          height: "43px",
          marginRight: "0.8rem",
          marginBottom: "0.5rem",
        }}
        src={handlePfp()}
        alt=""
      />
      <div>{nameAndIcon}</div>
    </div>
  );
};

export default UserComponent;

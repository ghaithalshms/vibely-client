import React, { useEffect, useState } from "react";
import axios from "axios";
import { getLink } from "../../API";
import InboxUserComponent from "./inboxUserComponent";
import Cookies from "js-cookie";
import Navbar from "../navbar/navbar";
import { updateArrayPfp } from "../../usersPfp";
import sendMsgDark from "../icon/dark-mode/inbox/send_message.png";
import sendMsgLight from "../icon/light-mode/inbox/send_message.png";
import GetUserListModal from "../user/getUserListModal";
import { useNavigate } from "react-router-dom";

const GetInboxUsers = ({
  isDarkMode,
  handleCatchAxios,
  chatUser,
  setChatUser,
}) => {
  const [inboxUsers, setInboxUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isDataGot, setDataGot] = useState(false);
  const [userListModalIsOpen, setUserListModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleGetInboxUsers = async () => {
    await axios
      .get(getLink.getInbox, {
        params: {
          token: Cookies.get("token"),
        },
      })
      .then((res) => {
        setInboxUsers(res?.data);
        for (const postData of res.data) {
          const username = postData.user.username;
          updateArrayPfp(username, setInboxUsers);
        }
      })
      .catch((err) => handleCatchAxios(err));
    setLoading(false);
    setDataGot(true);
  };

  useEffect(() => {
    if (!isDataGot) {
      handleGetInboxUsers();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={chatUser ? "only-pc" : ""}>
      <Navbar isDarkMode={isDarkMode} handleCatchAxios={handleCatchAxios} />
      <div className="inbox-users-container">
        <div
          className="container-x"
          style={{
            justifyContent: "space-between",
            marginTop: "0.5rem",
            marginBottom: "1.5rem",
            marginLeft: ".5rem",
            borderBottom: isDarkMode
              ? "solid  rgb(183, 183, 183) 2px"
              : "solid rgb(74, 74, 74) 2px",
          }}
        >
          <h2>Inbox</h2>
          <img
            className="pointer"
            onClick={setUserListModalOpen}
            style={{ width: "25px", height: "25px", marginRight: "1rem" }}
            src={isDarkMode ? sendMsgDark : sendMsgLight}
            alt="send_msg"
          />
        </div>
        {isLoading && (
          <div
            className="full-width"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30svh",
            }}
          >
            <span className="loader" />
          </div>
        )}

        {!isLoading &&
          inboxUsers &&
          inboxUsers?.map((inbox, index) => (
            <InboxUserComponent
              key={index}
              user={inbox.user}
              message={inbox.message}
              setChatUser={(user) => {
                navigate(`/inbox/${user.username}`);
                setChatUser(user);
              }}
            />
          ))}

        {!isLoading && !inboxUsers?.length > 0 && (
          <h3
            className="pointer"
            onClick={() => setUserListModalOpen(true)}
            style={{ marginTop: "30vh", textAlign: "center" }}
          >
            Click here to send a message to your friends!
          </h3>
        )}
      </div>
      {userListModalIsOpen && (
        <GetUserListModal
          isDarkMode={isDarkMode}
          isOpen={userListModalIsOpen}
          onRequestClose={() => setUserListModalOpen(false)}
          header={"Send a message"}
          type={"Following"}
          username={Cookies.get("username")}
          setChatUser={(user) => {
            setChatUser(user);
            setUserListModalOpen(false);
          }}
          handleCatchAxios={handleCatchAxios}
        />
      )}
    </div>
  );
};

export default GetInboxUsers;

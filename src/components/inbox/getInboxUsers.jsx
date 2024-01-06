import React, { useEffect, useState } from "react";
import axios from "axios";
import { getLink } from "../../API";
import InboxUserComponent from "./inboxUserComponent";
import Cookies from "js-cookie";
import Navbar from "../navbar/navbar";

const GetInboxUsers = ({
  isDarkMode,
  handleCatchAxios,
  chatUser,
  setChatUser,
}) => {
  const [inboxUsers, setInboxUsers] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isDataGot, setDataGot] = useState(false);

  const handleGetInboxUsers = async () => {
    await axios
      .get(getLink.getInbox, {
        params: {
          token: Cookies.get("token"),
        },
      })
      .then((res) => setInboxUsers(res?.data))
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
        <h2 style={{ marginBottom: "1rem" }}>Inbox</h2>
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
              setChatUser={setChatUser}
            />
          ))}

        {!isLoading && !inboxUsers?.length > 0 && (
          <h3 style={{ marginLeft: "20%", marginTop: "40%" }}>
            Try to add some friends!
          </h3>
        )}
      </div>
    </div>
  );
};

export default GetInboxUsers;

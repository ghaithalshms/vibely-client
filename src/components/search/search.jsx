import axios from "axios";
import React, { useEffect, useState } from "react";
import { getLink } from "../../API";
import UserComponent from "../user/userComponent";
import Navbar from "../navbar/navbar";

const Search = ({ isDarkMode, handleCatchAxios, setErrorCode }) => {
  const [username, setUsername] = useState();
  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleGetSearchUser = async () => {
    setLoading(true);
    setUserList([]);
    await axios
      .get(getLink.getSearchUser, { params: { username } })
      .then((res) => setUserList(res.data))
      .catch((err) => {
        handleCatchAxios(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    if (username) handleGetSearchUser();
    document.getElementById("search-txtarea")?.focus();
    // eslint-disable-next-line
  }, [username]);

  const searchUserElement = (
    <textarea
      id="search-txtarea"
      placeholder="Search for a user"
      onChange={(e) => setUsername(e.currentTarget.value)}
      style={{ resize: "none", marginBottom: "1rem", width: "100%" }}
      rows={"1"}
    />
  );

  const userListElement = (
    <>
      {isLoading && (
        <div
          className="full-width"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
            marginTop: "40%",
          }}
        >
          <span className="loader" />
        </div>
      )}
      {userList?.map((user, index) => (
        <UserComponent key={index} user={user} setErrorCode={setErrorCode} />
      ))}
    </>
  );

  return (
    <div className="main-container">
      <Navbar
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        setErrorCode={setErrorCode}
      />
      {searchUserElement}
      {userListElement}
    </div>
  );
};
export default Search;

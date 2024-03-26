import axios from "axios";
import React, { useEffect, useState } from "react";
import { getLink } from "../../API";
import UserComponent from "../user/userComponent";
import Navbar from "../navbar/navbar";

const Search = ({ isDarkMode, handleCatchAxios, setErrorCode }) => {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleGetSearchUser = async () => {
    setLoading(true);
    setUserList([]);
    try {
      const res = await axios.get(getLink.getSearchUser, {
        params: { username },
      });
      setUserList(res.data);
    } catch (err) {
      handleCatchAxios(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (username) handleGetSearchUser();
    document.getElementById("search-txtarea")?.focus();
    // eslint-disable-next-line
  }, [username]);

  const renderLoader = () => (
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
  );

  const renderUserList = () => (
    <>
      {isLoading && renderLoader()}
      {userList.map((user, index) => (
        <UserComponent key={index} user={user} setErrorCode={setErrorCode} />
      ))}
    </>
  );

  const handleInputChange = (e) => {
    setUsername(e.currentTarget.value);
  };

  return (
    <div className="main-container">
      <Navbar
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        setErrorCode={setErrorCode}
      />
      <textarea
        id="search-txtarea"
        placeholder="Search for a user"
        onChange={handleInputChange}
        style={{ resize: "none", marginBottom: "1rem", width: "100%" }}
        rows={"1"}
      />
      {renderUserList()}
    </div>
  );
};

export default Search;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getLink } from "../../API";
import Cookies from "js-cookie";
import "./suggestions.css";
import { updateUserListArrayPfp } from "../../usersPfp";
import SuggestionUserComponent from "./suggestionUserComponent";

const SuggestionsList = ({ isDarkMode, handleCatchAxios }) => {
  const [suggestionUserArray, setSuggestionUserArray] = useState([]);

  useEffect(() => {
    getSuggestionUsers();
    // eslint-disable-next-line
  }, []);

  const getSuggestionUsers = async () => {
    await axios
      .get(getLink.getSuggestions, {
        params: {
          token: Cookies.get("token"),
        },
      })
      .then((res) => {
        setSuggestionUserArray(res.data);
        for (const user of res.data) {
          const username = user.username;
          updateUserListArrayPfp(username, setSuggestionUserArray);
        }
      })
      .catch((err) => handleCatchAxios(err));
  };
  return (
    <div className="suggestions-container">
      <h3 className="suggestions-h3">Suggestions for you</h3>
      {suggestionUserArray.map((user, index) => (
        <SuggestionUserComponent
          user={user}
          handleCatchAxios={handleCatchAxios}
          key={index}
        />
      ))}
    </div>
  );
};

export default SuggestionsList;

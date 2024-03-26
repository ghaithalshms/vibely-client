import axios from "axios";
import React, { useEffect, useState } from "react";
import { getLink } from "../../API";
import Cookies from "js-cookie";
import "./suggestions.css";
import SuggestionUserComponent from "./suggestionUserComponent";

const SuggestionsList = ({
  isDarkMode,
  handleCatchAxios,
  setHomeContainerMargin,
  setErrorCode,
}) => {
  const [suggestionUserArray, setSuggestionUserArray] = useState([]);

  useEffect(() => {
    getSuggestionUsers(); // eslint-disable-next-line
  }, []);

  const getSuggestionUsers = async () => {
    try {
      const res = await axios.get(getLink.getSuggestions, {
        params: {
          token: Cookies.get("token"),
        },
      });
      setSuggestionUserArray(res.data);
      if (res.data?.length > 0) setHomeContainerMargin(true);
    } catch (err) {
      handleCatchAxios(err);
    }
  };

  const renderSuggestions = () => {
    return (
      suggestionUserArray?.length > 0 && (
        <div className="suggestions-container">
          <h3 className="suggestions-h3">Suggestions for you</h3>
          {suggestionUserArray.map((user, index) => (
            <SuggestionUserComponent
              user={user}
              handleCatchAxios={handleCatchAxios}
              key={index}
              setErrorCode={setErrorCode}
            />
          ))}
        </div>
      )
    );
  };

  return <>{renderSuggestions()}</>;
};

export default SuggestionsList;

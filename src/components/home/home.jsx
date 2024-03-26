import React, { useState } from "react";
import HomePostFlow from "../postFlow/homePostFlow";
import Navbar from "../navbar/navbar";
import CreatePost from "../createPost/createPost";
import SuggestionsList from "../suggestions/suggestionsList";

const Home = ({
  isDarkMode,
  scrollingPercentage,
  handleCatchAxios,
  setErrorCode,
}) => {
  const [homeContainerMargin, setHomeContainerMargin] = useState(false);

  const toggleHomeContainerMargin = () => {
    setHomeContainerMargin(!homeContainerMargin);
  };

  const renderNavbar = () => (
    <Navbar
      isDarkMode={isDarkMode}
      handleCatchAxios={handleCatchAxios}
      setErrorCode={setErrorCode}
    />
  );

  const renderCreatePost = () => (
    <div className="only-pc">
      <CreatePost isDarkMode={isDarkMode} handleCatchAxios={handleCatchAxios} />
    </div>
  );

  const renderSuggestionsList = () => (
    <SuggestionsList
      isDarkMode={isDarkMode}
      handleCatchAxios={handleCatchAxios}
      setHomeContainerMargin={toggleHomeContainerMargin}
      setErrorCode={setErrorCode}
    />
  );

  const renderHomePostFlow = () => (
    <HomePostFlow
      isDarkMode={isDarkMode}
      handleCatchAxios={handleCatchAxios}
      scrollingPercentage={scrollingPercentage}
      setErrorCode={setErrorCode}
    />
  );

  return (
    <div
      className={`container-y main-container ${
        homeContainerMargin ? "home-container" : ""
      }`}
    >
      {renderNavbar()}
      {renderCreatePost()}
      {renderSuggestionsList()}
      {renderHomePostFlow()}
    </div>
  );
};

export default Home;

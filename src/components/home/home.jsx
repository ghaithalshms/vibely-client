import React, { useState } from "react";
import HomePostFlow from "../postFlow/homePostFlow";
import Navbar from "../navbar/navbar";
import CreatePost from "../createPost/createPost";
import SuggestionsList from "../suggestions/suggestionsList";

const Home = ({ isDarkMode, scrollingPercentage, handleCatchAxios }) => {
  const [homeContainerMargin, setHomeContainerMargin] = useState(false);
  return (
    <div
      className={
        homeContainerMargin
          ? "container-y  main-container home-container"
          : "container-y  main-container"
      }
    >
      <Navbar isDarkMode={isDarkMode} handleCatchAxios={handleCatchAxios} />
      <div className="only-pc">
        <CreatePost
          isDarkMode={isDarkMode}
          handleCatchAxios={handleCatchAxios}
        />
      </div>
      <SuggestionsList
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        setHomeContainerMargin={setHomeContainerMargin}
      />
      <HomePostFlow
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        scrollingPercentage={scrollingPercentage}
      />
    </div>
  );
};

export default Home;

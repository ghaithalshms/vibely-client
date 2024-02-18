import React from "react";
import HomePostFlow from "../postfFow/homePostFlow";
import Navbar from "../navbar/navbar";
import CreatePost from "../createPost/createPost";
import SuggestionsList from "../suggestions/suggestionsList";

const Home = ({ isDarkMode, scrollingPercentage, handleCatchAxios }) => {
  return (
    <div className="container-y  main-container home-container">
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

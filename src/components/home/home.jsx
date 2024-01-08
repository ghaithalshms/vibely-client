import React from "react";
import HomePostFlow from "../postfFow/homePostFlow";
import Navbar from "../navbar/navbar";
import CreatePost from "../createPost/createPost";

const Home = ({ isDarkMode, scrollingPercentage, handleCatchAxios }) => {
  return (
    <div className="container-y  main-container">
      <Navbar isDarkMode={isDarkMode} handleCatchAxios={handleCatchAxios} />
      <div className="only-pc">
        <CreatePost
          isDarkMode={isDarkMode}
          handleCatchAxios={handleCatchAxios}
        />
        <br />
      </div>
      <HomePostFlow
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        scrollingPercentage={scrollingPercentage}
      />
    </div>
  );
};

export default Home;

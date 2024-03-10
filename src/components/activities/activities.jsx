import React from "react";
import Navbar from "../navbar/navbar";
import ActivitiesPostFlow from "../postFlow/activitiesPostFlow";

const Activities = ({ isDarkMode, scrollingPercentage, handleCatchAxios }) => {
  return (
    <div className="container-y  main-container">
      <Navbar isDarkMode={isDarkMode} handleCatchAxios={handleCatchAxios} />
      <br />
      <ActivitiesPostFlow
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        scrollingPercentage={scrollingPercentage}
      />
    </div>
  );
};

export default Activities;
